import {
  BuilderNode,
  NextNode,
  Value,
  AllNode,
  ConstantNode,
  NodeOutput,
  RecipeGetter,
} from "../../../builder-worker/src/nodes/common";
import { workingHref } from "../../../builder-worker/src/resolver";
import { MakePkgESCompliantNode } from "./cjs-interop";
import { createHash } from "crypto";
import { NodeFileSystemDriver } from "../node-filesystem-driver";
import { EntrypointsNode } from "./entrypoints";
import { log, debug } from "../../../builder-worker/src/logger";
import childProcess from "child_process";
import { promisify } from "util";
import { ensureDirSync, existsSync, readJSONSync } from "fs-extra";
import fs from "fs";
import { join, resolve } from "path";
import _glob from "glob";
import {
  WriteFileNode,
  MountNode,
} from "../../../builder-worker/src/nodes/file";
import { SrcTransformNode } from "./src-transform";
import { Recipe } from "../../../builder-worker/src/recipes";
import { coerce } from "semver";
import { transform, TransformOptions } from "@babel/core";
import { applyVariantToTemplateCompiler, Variant } from "@embroider/core";

export const buildOutputDir = "__output/";
export const buildSrcDir = `__build_src/`;
export const pkgPathFile = `__pkgPath`;
const glob = promisify(_glob);
const readFile = promisify(fs.readFile);
const exec = promisify(childProcess.exec);
const githubRepoRegex = /^https:\/\/github.com\/(?<org>[^\/]+)\/(?<repo>[^\/]+)(\/tree\/(?<branch>[^\/]+)(?<subdir>\/.+|\/)?)?$/;

export interface PackageJSON {
  name: string;
  version: string;
  repository?: string | { type: "string"; url: "string" };
  main?: string;
  dependencies?: {
    [depName: string]: string;
  };
}

export function getPackageJSON(pkgPath: string): PackageJSON {
  return readJSONSync(join(pkgPath, "package.json")) as PackageJSON;
}

export class PreparePackageNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSON: PackageJSON,
    private workingDir: string,
    private consumedFrom: string
  ) {
    this.cacheKey = `prepare-pkg:${pkgPath}`;
  }

  async deps() {
    return {
      pkgURL: new MakePackageWorkingAreaNode(
        this.pkgPath,
        this.pkgJSON,
        this.workingDir
      ),
    };
  }

  async run({ pkgURL }: { pkgURL: URL }): Promise<NextNode<URL>> {
    return {
      node: new FinishPackagePreparationNode(
        this.pkgPath,
        pkgURL,
        this.pkgJSON,
        this.workingDir,
        this.consumedFrom
      ),
    };
  }
}

// TODO we can get rid of this node by making a higher level mount before the
// build starts and just assuming that directory is available
class MakePackageWorkingAreaNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `make-pkg-working-area:${pkgPath}`;
  }

  async deps() {
    return;
  }

  async run(): Promise<NextNode<URL>> {
    // we hash the pkgPath so that we can disambiguate between multiple copies
    // of the same pkg in different consumers--this should not be confused
    // with the hash that is ultimately used in the canonical URL for the pkg
    // which includes a rolled up hash of all the transitive dependencies.
    let hash = createHash("sha1")
      .update(this.pkgPath)
      .digest("base64")
      .replace(/\//g, "-");
    let underlyingPkgPath = join(
      this.workingDir,
      "build",
      this.pkgJSON.name,
      this.pkgJSON.version,
      hash
    ); // this is just temp until we don't need to debug any longer..
    ensureDirSync(underlyingPkgPath);
    return {
      node: new MountNode(
        new URL(
          `${workingHref}npm/${this.pkgJSON.name}/${this.pkgJSON.version}/${hash}/`
        ),
        // TODO make this configure-ably be a memory driver. using node fs by
        // default because it easy to debug when there are build failures.
        new NodeFileSystemDriver(underlyingPkgPath)
      ),
    };
  }
}

class FinishPackagePreparationNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgURL: URL,
    private pkgJSON: PackageJSON,
    private workingDir: string,
    private consumedFrom: string
  ) {
    this.cacheKey = `finish-pkg-preparation:${pkgPath}`;
  }

  async deps(getRecipe: RecipeGetter) {
    let esCompliance = new MakePkgESCompliantNode(
      this.pkgURL,
      new PackageSrcNode(
        this.pkgJSON,
        this.pkgPath,
        this.pkgURL,
        this.workingDir,
        this.consumedFrom
      )
    );
    let { name, version } = this.pkgJSON;
    let recipe = await getRecipe(name, version);
    // all node builds have the runtime loader package available as a
    // dependency, so that runtime loading situations (e.g. a dynamic
    // require specifier) can be handled if they arise, as well as a
    // polyfills package to polyfill node-isms
    let deps: { [specifier: string]: string } = {
      "@catalogjs/loader": "^0.0.1",
      "@catalogjs/polyfills": "^0.0.1",
    };
    if (recipe?.needsBabelRuntime) {
      deps["@babel/runtime"] = "^7.13.0";
    }
    return {
      pkgPathFile: new WriteFileNode(
        new ConstantNode(this.pkgPath),
        new URL(pkgPathFile, this.pkgURL)
      ),
      entrypoints: new EntrypointsNode(
        this.pkgJSON,
        this.pkgURL,
        esCompliance,
        deps
      ),
      esCompliance,
    };
  }

  async run(): Promise<Value<URL>> {
    return { value: this.pkgURL };
  }
}

export class PackageSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgPath: string,
    private pkgURL: URL,
    private workingDir: string,
    private consumedFrom: string
  ) {
    this.cacheKey = `pkg-source:${pkgPath}`;
  }

  async deps() {
    return {
      prepare: new PackageSrcPrepareNode(
        this.pkgJSON,
        this.pkgPath,
        this.pkgURL,
        this.workingDir,
        this.consumedFrom
      ),
    };
  }

  async run(): Promise<NodeOutput<void>> {
    return {
      node: new PackageSrcFinishNode(this.pkgURL, this.pkgJSON),
    };
  }
}

export class PackageSrcPrepareNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgPath: string,
    private pkgURL: URL,
    private workingDir: string,
    private consumedFrom: string
  ) {
    this.cacheKey = `pkg-source-prepare:${pkgPath}`;
  }

  async deps() {}

  async run(_: never, getRecipe: RecipeGetter): Promise<NextNode<void[]>> {
    let { name, version } = this.pkgJSON;
    let recipe = await getRecipe(name, version);
    let { srcRepo, macros } = recipe ?? {};
    let srcPath: string;
    if (srcRepo) {
      srcPath = await clonePkg(this.pkgJSON, this.workingDir, recipe);
    } else {
      srcPath = this.pkgPath;
    }
    let { srcIncludeGlob, srcIgnoreGlob } = recipe ?? {};
    srcIncludeGlob = srcIncludeGlob ?? "**/*.{ts,js,json,hbs}";
    srcIgnoreGlob = srcIgnoreGlob ?? "{node_modules,test}/**";

    let files = await glob(srcIncludeGlob, {
      cwd: srcPath,
      absolute: true,
      ignore: `${srcPath}/${srcIgnoreGlob}`,
    });

    let babelConfig: TransformOptions | undefined;
    if (recipe?.babelConfigPath) {
      let babelConfigPath = resolve(this.consumedFrom, recipe.babelConfigPath);
      log(`evaluating babel config ${babelConfigPath}`);
      babelConfig = require(babelConfigPath);
    }
    let compile: ((filePath: string, template: string) => string) | undefined;
    if (recipe?.templateCompilerPath) {
      let variant: Variant = {
        name: "default",
        runtime: "all",
        optimizeForProduction: false,
      };
      let templateCompiler = require(join(
        this.consumedFrom,
        recipe.templateCompilerPath
      ));
      compile = applyVariantToTemplateCompiler(
        variant,
        templateCompiler.compile
      );
    }

    let contents = await Promise.all(
      files.map(async (file) => {
        let content = await readFile(file, "utf8");
        for (let [macro, replacement] of Object.entries(macros ?? {})) {
          content = content.replace(new RegExp(macro, "g"), replacement);
        }

        if (babelConfig && file.endsWith(".js")) {
          let output = transform(content, { ...babelConfig, filename: file });
          if (!output || output.code == null) {
            throw new Error(
              `Empty babel result after babel transform of ${file}`
            );
          }
          content = output.code;
        }
        if (file.endsWith(".hbs")) {
          if (!compile) {
            throw new Error(
              `Encountered an .hbs file, ${file}, but there is no 'templateCompilerPath' specified in the recipe for ${name} ${version}`
            );
          }
          content = compile(file, content);
        }

        return content;
      })
    );
    return {
      node: new AllNode(
        files.map((file, index) => {
          if (!srcPath.endsWith("/")) {
            srcPath = `${srcPath}/`;
          }
          let url = new URL(
            file.slice(srcPath.length),
            `${this.pkgURL}__stage1/`
          );
          if (url.href.endsWith(".hbs")) {
            url = new URL(`${url.href}.js`);
          }
          return new WriteFileNode(new ConstantNode(contents[index]), url);
        })
      ),
    };
  }
}

class PackageSrcFinishNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL, private pkgJSON: PackageJSON) {
    this.cacheKey = `pkg-source-finish:${pkgURL.href}`;
  }

  async deps() {
    return {
      transform: new SrcTransformNode(this.pkgURL, this.pkgJSON),
    };
  }

  async run(): Promise<NodeOutput<void>> {
    return {
      value: undefined,
    };
  }
}

async function clonePkg(
  pkgJSON: PackageJSON,
  workingDir: string,
  recipe: Recipe | undefined
): Promise<string> {
  let pkgJSONRepoInfo = await repoFromPkgJSON(pkgJSON);
  let recipeRepo =
    typeof recipe?.srcRepo === "object" ? recipe?.srcRepo : undefined;
  let repoURL = recipeRepo?.repoHref
    ? new URL(recipeRepo.repoHref)
    : pkgJSONRepoInfo.repoURL;
  let repoSubdir = recipeRepo?.subdir ?? pkgJSONRepoInfo.repoSubdir;
  if (!repoURL) {
    throw new Error(`Cannot determine source repository for ${pkgJSON.name}`);
  }

  let version: string | undefined;
  let semver = coerce(pkgJSON.version);
  if (recipeRepo?.version) {
    version = recipeRepo.version;
    if (semver) {
      version = version
        .replace(/\$major\$/g, String(semver.major))
        .replace(/\$minor\$/g, String(semver.minor))
        .replace(/\$patch\$/g, String(semver.patch));
    }
  } else {
    ({ version } = pkgJSON);
  }
  if (!version) {
    throw new Error(`Cannot determine version for ${pkgJSON.name}`);
  }

  let pkgSrc = await gitClone(repoURL, version, workingDir);
  return repoSubdir ? join(pkgSrc, repoSubdir) : pkgSrc;
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

async function gitClone(
  remoteURL: URL,
  version: string,
  workingDir: string
): Promise<string> {
  let gitRoot = join(workingDir, "git");
  let repoDir = join(gitRoot, remoteURL.pathname.replace(".git", ""));
  ensureDirSync(repoDir);

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
}
