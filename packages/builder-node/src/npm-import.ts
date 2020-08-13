import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
  NodeOutput,
  ConstantNode,
} from "../../builder-worker/src/nodes/common";
import { log, debug } from "../../builder-worker/src/logger";
import childProcess from "child_process";
import { promisify } from "util";
import fsExtra, {
  ensureDirSync,
  existsSync,
  readJSONSync,
  readFileSync,
} from "fs-extra";
import { join, resolve, basename } from "path";
import resolvePkg from "resolve-pkg";
import { getRecipe, Recipe } from "./recipes";
import {
  FileDescription,
  describeFile,
  isModuleDescription,
  CJSDescription,
} from "../../builder-worker/src/describe-file";
import { JSParseNode } from "../../builder-worker/src/nodes/js";
import { File } from "@babel/types";
import { RegionEditor } from "../../builder-worker/src/code-region";
import _glob from "glob";

const glob = promisify(_glob);
const exec = promisify(childProcess.exec);
const writeFile = promisify(fsExtra.writeFile);
const writeJSON = promisify(fsExtra.writeJSON);
const remove = promisify(fsExtra.remove);
const githubRepoRegex = /^https:\/\/github.com\/(?<org>[^\/]+)\/(?<repo>[^\/]+)(\/tree\/(?<branch>[^\/]+)(?<subdir>\/.+|\/)?)?$/;

export interface Package {
  packageJSON: PackageJSON;
  packageSrc: string;
  packageNodeModulesPath: string;
  dependencies: Package[];
}
export interface PackageJSON {
  name: string;
  version: string;
  repository?: string | { type: "string"; url: "string" };
  main?: string;
  dependencies?: {
    [depName: string]: string;
  };
}

export class NpmImportProjectsNode implements BuilderNode {
  // TODO the cache key for this should probably be some kind of lock file hash.
  // Until we do that, treating this as volatile...
  volatile = true;
  cacheKey = this;

  constructor(
    private pkgs: string[],
    private consumedFrom: string,
    private workingDir: string
  ) {
    //@ts-ignore
    if (typeof window !== "undefined") {
      throw new Error(`The NpmImportProjectsNode currently only runs in Node`);
    }
  }

  deps() {}

  async run(): Promise<NextNode<Package[]>> {
    let nodes = this.pkgs.map(
      (p) => new NpmImportProjectNode(p, this.consumedFrom, this.workingDir)
    );
    return {
      // TODO add another node to unpack the PackageInfo and turn into project input/output roots
      node: new AllNode(nodes),
    };
  }
}

class NpmImportProjectNode implements BuilderNode {
  cacheKey: string;
  private pkgPath: string;
  constructor(
    name: string,
    consumedFrom: string,
    private workingDir: string,
    // TODO do we need this?
    private topConsumerPath: string = consumedFrom
  ) {
    let pkgPath = resolvePkg(name, { cwd: consumedFrom });
    if (!pkgPath) {
      throw new Error(
        `Could not resolve package '${name}' consumed from ${consumedFrom}`
      );
    }
    this.pkgPath = pkgPath;
    this.cacheKey = `npm-import-project:${pkgPath}`;
  }

  deps() {
    let pkgJSON = new PackageJSONNode(this.pkgPath);
    // TODO need to generate lockfile. We should determine the pkg identifiers of
    // our deps first (by resolving those here), which might mean that we should
    // recurse into this node here in deps() instead of in run()
    let entrypointsNode = new PackageEntrypointsNode(
      this.pkgPath,
      pkgJSON,
      this.workingDir
    );
    return {
      srcPath: entrypointsNode,
      pkgJSON,
      files: new MakePkgESCompliantNode(this.pkgPath, entrypointsNode),
    };
  }

  async run({
    srcPath,
    pkgJSON,
  }: {
    srcPath: string;
    pkgJSON: PackageJSON;
  }): Promise<NextNode<Package>> {
    log(`processing package ${pkgJSON.name} from: ${this.pkgPath}`);
    let dependencies = await Promise.all(
      Object.entries(pkgJSON.dependencies ?? []).map(
        async ([name]) =>
          new NpmImportProjectNode(
            name,
            this.pkgPath,
            this.workingDir,
            this.topConsumerPath
          )
      )
    );
    return {
      node: new FinishNpmImportNode(
        pkgJSON,
        this.pkgPath,
        srcPath,
        dependencies
      ),
    };
  }
}

class MakePkgESCompliantNode implements BuilderNode {
  cacheKey: string;
  constructor(
    pkgPath: string,
    private entrypointsNode: PackageEntrypointsNode
  ) {
    this.cacheKey = `make-pkg-es-compliant:${pkgPath}`;
  }

  deps() {
    return {
      srcPath: this.entrypointsNode,
    };
  }

  async run({ srcPath }: { srcPath: string }): Promise<NodeOutput<void[]>> {
    // using a glob here instead of trying to crawl deps from the file
    // description to find files to introspect, because we're not ready to start
    // resolving yet (and we don't want to be forced into node resolution for
    // the CJS files).
    let files = await glob("**/*.js", {
      cwd: srcPath,
      absolute: true,
      ignore: `${srcPath}/node_modules/**`,
    }); // TODO need to include .ts too...
    return {
      node: new AllNode(files.map((file) => new IntrospectSrcNode(file))),
    };
  }
}

class IntrospectSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string) {
    this.cacheKey = `introspect-src:${path}`;
  }

  deps() {
    return {
      desc: new AnalyzeFileNode(this.path),
    };
  }

  async run({ desc }: { desc: FileDescription }): Promise<NodeOutput<void>> {
    if (isModuleDescription(desc)) {
      return { value: undefined };
    } else {
      return { node: new ESInteropNode(this.path, desc) };
    }
  }
}

class ESInteropNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string, private desc: CJSDescription) {
    this.cacheKey = `es-interop:${path}`;
  }

  deps() {
    let src = readFileSync(this.path, { encoding: "utf8" });
    return {
      rewrite: new RewriteCJSNode(this.path, this.desc, src),
      shim: new ESModuleShimNode(this.path),
    };
  }

  async run(): Promise<NodeOutput<void>> {
    return { value: undefined };
  }
}

function remapRequires(origSrc: string, desc: CJSDescription): string {
  let editor = new RegionEditor(origSrc, desc, () => {
    throw new Error(`Cannot obtain unused binding name for CJS file`);
  });
  // TODO need to make sure "dependencies" does not collide with another binding
  // in origSrc--the parsed file should be able to tell us this...
  for (let [index, require] of desc.requires.entries()) {
    editor.replace(require.requireRegion, `dependencies[${index}]()`);
  }
  return editor.serialize();
}

function depFactoryName(specifier: string): string {
  return `${specifier.replace(/\W/g, "_")}Factory`.replace(/^_+/, "");
}

class RewriteCJSNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private path: string,
    private desc: CJSDescription,
    private src: string
  ) {
    this.cacheKey = `rewrite-cjs:${path}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<void>> {
    let imports = this.desc.requires.map(
      ({ specifier }) =>
        `import ${depFactoryName(specifier)} from "${specifier}$cjs$";`
    );
    let deps: string[] = this.desc.requires.map(({ specifier }) =>
      depFactoryName(specifier)
    );
    let newSrc = `${imports.join("\n")}
let module;
function implementation() {
  if (!module) {
    module = { exports: {} };
    Function(
      "module",
      "exports",
      "dependencies",
      \`${remapRequires(this.src, this.desc)
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")}\`
    )(module, module.exports, [${deps.join(", ")}]);
  }
  return module.exports;
}
export default implementation;`;
    await writeFile(this.path.replace(/\.js$/, ".cjs.js"), newSrc);
    return { value: undefined };
  }
}

class ESModuleShimNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string) {
    this.cacheKey = `es-shim:${path}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<void>> {
    await remove(this.path);
    await writeFile(
      this.path,
      `import implementation from "./${basename(this.path)}$cjs$";
export default implementation();`
    );
    return { value: undefined };
  }
}

class AnalyzeFileNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string) {
    this.cacheKey = `analyze-file:${path}`;
  }

  deps() {
    return {
      parsed: new JSParseNode(
        new ConstantNode(readFileSync(this.path, { encoding: "utf8" }))
      ),
    };
  }

  async run({ parsed }: { parsed: File }): Promise<Value<FileDescription>> {
    return { value: describeFile(parsed) };
  }
}

class FinishNpmImportNode implements BuilderNode {
  cacheKey: FinishNpmImportNode;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgNodeModulesPath: string,
    private srcPath: string,
    private dependencies: NpmImportProjectNode[]
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.dependencies;
  }
  async run(dependencies: {
    [index: number]: Package;
  }): Promise<Value<Package>> {
    return {
      value: {
        packageJSON: this.pkgJSON,
        packageNodeModulesPath: this.pkgNodeModulesPath,
        packageSrc: this.srcPath,
        dependencies: this.dependencies.map((_, index) => dependencies[index]),
      },
    };
  }
}

class PackageEntrypointsNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSONNode: PackageJSONNode,
    private workingDir: string
  ) {
    this.cacheKey = `pkg-entrypoints:${pkgPath}`;
  }

  deps() {
    return {
      pkgJSON: this.pkgJSONNode,
      srcPath: new PackageSrcNode(
        this.pkgPath,
        this.pkgJSONNode,
        this.workingDir
      ),
    };
  }

  async run({
    pkgJSON,
    srcPath,
  }: {
    pkgJSON: PackageJSON;
    srcPath: string;
  }): Promise<Value<string>> {
    let { name, version, main } = pkgJSON;
    let recipe = getRecipe(name, version);
    let entrypoints = recipe?.entrypoints ?? (main ? [main!] : ["./index.js"]);
    if (entrypoints.length === 0) {
      throw new Error(
        `No entrypoints were specified for the package ${name} ${version} at ${this.pkgPath}`
      );
    }
    let missingEntrypoints = entrypoints.filter(
      (e) => !existsSync(resolve(join(srcPath, e)))
    );
    if (missingEntrypoints.length > 0) {
      throw new Error(
        `The entrypoint(s) for the package ${name} ${version}: ${missingEntrypoints.join(
          ", "
        )} are missing from ${srcPath}`
      );
    }
    let entrypointsFile = join(srcPath, "entrypoints.json");
    log(`creating ${entrypointsFile}`);
    await remove(entrypointsFile);

    // TODO need to write dependencies...
    await writeJSON(entrypointsFile, {
      name,
      js: entrypoints,
    });

    return { value: srcPath };
  }
}

class PackageSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSONNode: PackageJSONNode,
    private workingDir: string
  ) {
    this.cacheKey = `pkg-source:${pkgPath}`;
  }

  deps() {
    return {
      pkgJSON: this.pkgJSONNode,
    };
  }

  async run({
    pkgJSON,
  }: {
    pkgJSON: PackageJSON;
  }): Promise<NodeOutput<string>> {
    let { name, version } = pkgJSON;
    let recipe = getRecipe(name, version);
    if (recipe?.srcRepo) {
      return {
        node: new PackageSrcFromGitNode(pkgJSON, this.workingDir, recipe),
      };
    } else {
      return { value: this.pkgPath };
    }
  }
}

class PackageSrcFromGitNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private workingDir: string,
    private recipe: Recipe | undefined
  ) {
    this.cacheKey = `prepare-pkg-source:${pkgJSON.name},${pkgJSON.version}`;
  }

  deps() {}

  async run(): Promise<NextNode<string>> {
    let pkgJSONRepoInfo = await repoFromPkgJSON(this.pkgJSON);
    let recipeRepo =
      typeof this.recipe?.srcRepo === "object"
        ? this.recipe?.srcRepo
        : undefined;
    let repoURL = recipeRepo?.repoHref
      ? new URL(recipeRepo.repoHref)
      : pkgJSONRepoInfo.repoURL;
    let repoSubdir = recipeRepo?.subdir ?? pkgJSONRepoInfo.repoSubdir;
    if (!repoURL) {
      throw new Error(
        `Cannot determine source repository for ${this.pkgJSON.name}`
      );
    }

    let version: string | undefined;
    if (recipeRepo?.version) {
      version = recipeRepo.version;
    } else {
      ({ version } = this.pkgJSON);
      if (!recipeRepo?.bareVersion) {
        version = `v${version}`;
      }
    }
    if (!version) {
      throw new Error(`Cannot determine version for ${this.pkgJSON.name}`);
    }

    return {
      node: new GitCloneNode(repoURL, version, repoSubdir, this.workingDir),
    };
  }
}

class GitCloneNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private remoteGitURL: URL,
    private version: string,
    private repoSubdir: string | undefined,
    private workingDir: string
  ) {
    this.cacheKey = `git-clone:${remoteGitURL.href}/tree/${version}`;
  }

  deps() {}

  async run(): Promise<Value<string>> {
    let gitRoot = join(this.workingDir, "pkg-src");
    let dir = join(gitRoot, this.remoteGitURL.pathname.replace(".git", ""));
    ensureDirSync(dir);

    let repoDir = await nativeGitClone(dir, this.remoteGitURL, this.version);
    let srcPath = this.repoSubdir ? join(repoDir, this.repoSubdir) : repoDir;
    return { value: srcPath };
  }
}

class PackageJSONNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgPath: string) {
    this.cacheKey = `package-json:${pkgPath}`;
  }

  deps() {}

  async run(): Promise<Value<PackageJSON>> {
    let pkgJSON = readJSONSync(
      join(this.pkgPath, "package.json")
    ) as PackageJSON;
    return { value: pkgJSON };
  }
}

// This function converts a repository as specified by the package.json API
// (https://docs.npmjs.com/files/package.json#repository) into a HTTP URL. Any
// repo specific one-offs should be handled as recipe.
async function repoFromPkgJSON(
  pkgJSON: PackageJSON
): Promise<{ repoURL: URL | undefined; repoSubdir: string | undefined }> {
  if (!pkgJSON.repository) {
    return { repoURL: undefined, repoSubdir: undefined };
  }

  let repoURL: URL;
  let repoSubdir: string | undefined;
  let repoHref: string;
  if (typeof pkgJSON.repository === "string") {
    repoHref = pkgJSON.repository;
  } else {
    repoHref = pkgJSON.repository.url;
  }

  if (repoHref.startsWith("git@github.com:")) {
    repoHref = `https://github.com/${repoHref.replace("git@github.com:", "")}`;
  } else if (repoHref.startsWith("git://github.com/")) {
    repoHref = `https://github.com/${repoHref.replace(
      "git://github.com/",
      ""
    )}`;
  } else if (repoHref.startsWith("git+https://github.com/")) {
    repoHref = repoHref.replace(/^git\+/, "");
  } else if (!repoHref.startsWith("https://")) {
    // try using the string as a path in the github origin
    let url = new URL(repoHref, "https://github.com");
    let response = await fetch(`${url.href}.git`);
    if (!response.ok) {
      throw new Error(
        `Cannot figure out HTTPS repo URL for '${repoHref}' of package ${pkgJSON.name}`
      );
    }
    repoHref = url.href;
  }

  // strip off .git from the URL if it exists--we'll add it afterwards (pkgs
  // seem to be inconsistent in terms of having ".git" in the URL)
  repoHref = repoHref.replace(/\.git$/, "");

  let match = githubRepoRegex.exec(repoHref);
  if (!match) {
    repoURL = new URL(repoHref);
  } else {
    let { org, repo, subdir } = match.groups!;
    repoURL = new URL(`https://github.com/${org}/${repo}.git`);
    repoSubdir = subdir;
  }

  return { repoURL, repoSubdir };
}

async function nativeGitClone(
  repoDir: string,
  remoteURL: URL,
  version: string
): Promise<string> {
  // TODO remove this try/catch
  try {
    if (!existsSync(join(repoDir, ".git"))) {
      log(`cloning ${remoteURL.href}`);
      await exec(`git clone ${remoteURL} ${repoDir} --no-checkout`, {
        cwd: repoDir,
      });
    }

    let versionDir = join(repoDir, version);
    if (!existsSync(versionDir)) {
      let { stdout } = await exec(`git worktree list`, { cwd: repoDir });
      let worktrees = stdout.trim();
      let match = /\[(?<mainWorkTree>[^\]].+)\]/.exec(worktrees);
      debug(`worktree-add ${remoteURL.href} ${version}`);

      if (match?.groups?.mainWorkTree === version) {
        // git worktrees don't allow you to add a worktree for the main branch,
        // so we need to check to see if that is what is being requested and if
        // so, just checkout the repo
        await exec(`git checkout ${version}`, { cwd: repoDir });
        return repoDir;
      } else {
        await exec(`git worktree add ${versionDir} ${version}`, {
          cwd: repoDir,
        });
      }
    }
    return versionDir;
  } catch (e) {
    debugger;
    throw e;
  }
}
