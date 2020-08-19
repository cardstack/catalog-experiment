import {
  BuilderNode,
  NextNode,
  Value,
  AllNode,
  ConstantNode,
  NodeOutput,
} from "../../../builder-worker/src/nodes/common";
import { log, debug } from "../../../builder-worker/src/logger";
import childProcess from "child_process";
import { promisify } from "util";
import { ensureDirSync, existsSync, readJSONSync } from "fs-extra";
import fs from "fs";
import { join } from "path";
import { getRecipe, Recipe } from "../recipes";
import { resolveNodePkg } from "../resolve";
import { createHash } from "crypto";
import _glob from "glob";
import { WriteFileNode } from "../../../builder-worker/src/nodes/file";
import { SrcTransformNode } from "./src-transform";

const glob = promisify(_glob);
const readFile = promisify(fs.readFile);
const exec = promisify(childProcess.exec);
const githubRepoRegex = /^https:\/\/github.com\/(?<org>[^\/]+)\/(?<repo>[^\/]+)(\/tree\/(?<branch>[^\/]+)(?<subdir>\/.+|\/)?)?$/;

export interface Package {
  packageJSON: PackageJSON;
  url: URL;
  hash: string;
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

export interface LockFile {
  [pkgName: string]: string;
}

export function getPackageJSON(pkgPath: string): PackageJSON {
  return readJSONSync(join(pkgPath, "package.json")) as PackageJSON;
}

export class LockFileNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: Package) {
    this.cacheKey = `pkg-lock-file:${pkg.url.href}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<void>> {
    let lockfile: LockFile = {
      [this.pkg.packageJSON.name]: this.pkg.url.href,
    };
    for (let dep of this.pkg.dependencies) {
      lockfile[dep.packageJSON.name] = dep.url.href;
    }
    return {
      node: new WriteFileNode(
        new ConstantNode(JSON.stringify(lockfile)),
        new URL("catalogjs.lock", `${this.pkg.url}src/`)
      ),
    };
  }
}

export class PackageHashNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgPath: string, private pkgJSON: PackageJSON) {
    this.cacheKey = `package-identifier:${pkgPath}`;
  }

  deps() {}

  async run(): Promise<NextNode<string>> {
    let dependencies = Object.entries(this.pkgJSON.dependencies ?? {}).map(
      ([name]) => {
        let depPkgPath = resolveNodePkg(name, this.pkgPath);
        return new PackageHashNode(depPkgPath, getPackageJSON(depPkgPath));
      }
    );
    return {
      node: new FinishPackageHashNode(this.pkgJSON, dependencies),
    };
  }
}

class FinishPackageHashNode implements BuilderNode {
  cacheKey: FinishPackageHashNode;
  constructor(
    private pkgJSON: PackageJSON,
    private dependencies: PackageHashNode[]
  ) {
    this.cacheKey = this;
  }

  deps() {
    return this.dependencies;
  }

  async run(dependencies: { [index: number]: string }): Promise<Value<string>> {
    let depHashes = this.dependencies.map((_, index) => dependencies[index]);
    let hash = createHash("sha1")
      .update(
        `${this.pkgJSON.name}${this.pkgJSON.version}${depHashes.join("")}`
      )
      .digest("base64")
      .replace(/\//g, "-");
    return { value: hash };
  }
}

export class PackageSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgPath: string,
    private pkgURL: URL,
    private workingDir: string
  ) {
    this.cacheKey = `pkg-source:${pkgPath}`;
  }

  deps() {
    return {
      prepare: new PackageSrcPrepareNode(
        this.pkgJSON,
        this.pkgPath,
        this.pkgURL,
        this.workingDir
      ),
    };
  }

  async run(): Promise<NodeOutput<void>> {
    return {
      node: new PackageSrcFinishNode(this.pkgURL),
    };
  }
}

export class PackageSrcPrepareNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgPath: string,
    private pkgURL: URL,
    private workingDir: string
  ) {
    this.cacheKey = `pkg-source-prepare:${pkgPath}`;
  }

  deps() {}

  async run(): Promise<NextNode<void[]>> {
    let { name, version } = this.pkgJSON;
    let recipe = getRecipe(name, version);
    let srcPath: string;
    if (recipe?.srcRepo) {
      srcPath = await clonePkg(this.pkgJSON, this.workingDir, recipe);
    } else {
      srcPath = this.pkgPath;
    }
    let { srcIncludeGlob, srcIgnoreGlob } = recipe ?? {};
    // TODO need to include .ts too...
    srcIncludeGlob = srcIncludeGlob ?? "**/*.{js,json}";
    srcIgnoreGlob = srcIgnoreGlob ?? "{node_modules,test}/**";

    let files = await glob(srcIncludeGlob, {
      cwd: srcPath,
      absolute: true,
      ignore: `${srcPath}/${srcIgnoreGlob}`,
    });
    let contents = await Promise.all(
      files.map((file) => readFile(file, "utf8"))
    );
    return {
      node: new AllNode(
        files.map((file, index) => {
          let url = file.match(/\.json$/)
            ? new URL(file.slice(srcPath.length + 1), `${this.pkgURL}src/`)
            : new URL(
                file.slice(srcPath.length + 1),
                `${this.pkgURL}__stage1/`
              );
          return new WriteFileNode(new ConstantNode(contents[index]), url);
        })
      ),
    };
  }
}

class PackageSrcFinishNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL) {
    this.cacheKey = `pkg-source-finish:${pkgURL.href}`;
  }

  deps() {
    return {
      transform: new SrcTransformNode(this.pkgURL),
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
  if (recipeRepo?.version) {
    version = recipeRepo.version;
  } else {
    ({ version } = pkgJSON);
    if (!recipeRepo?.bareVersion) {
      version = `v${version}`;
    }
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
