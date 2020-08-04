import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
} from "../../builder-worker/src/nodes/common";
import { log, debug } from "../../builder-worker/src/logger";
import childProcess from "child_process";
import { promisify } from "util";
import { ensureDirSync, existsSync, readJSONSync } from "fs-extra";
import { join } from "path";
import resolvePkg from "resolve-pkg";

const exec = promisify(childProcess.exec);
const githubRepoRegex = /^https:\/\/github.com\/(?<org>[^\/]+)\/(?<repo>[^\/]+)(\/tree\/(?<branch>[^\/]+)(?<subdir>\/.+|\/)?)?$/;

export interface Package {
  packageJSON: PackageJSON;
  packageSrc: string;
  dependencies: Package[];
}
export interface PackageJSON {
  name: string;
  version: string;
  repository?: string | { type: "string"; url: "string" };
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
  constructor(name: string, consumedFrom: string, private workingDir: string) {
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
    return {
      src: new PackageEntrypointsNode(this.pkgPath, pkgJSON, this.workingDir),
      pkgJSON,
    };
  }

  async run({
    src,
    pkgJSON,
  }: {
    src: string;
    pkgJSON: PackageJSON;
  }): Promise<NextNode<Package>> {
    log(`loading package ${pkgJSON.name} from: ${this.pkgPath}`);
    let dependencies = await Promise.all(
      Object.entries(pkgJSON.dependencies ?? []).map(
        async ([name]) =>
          new NpmImportProjectNode(name, this.pkgPath, this.workingDir)
      )
    );
    return {
      node: new FinishNpmImportNode(pkgJSON, src, dependencies),
    };
  }
}

class FinishNpmImportNode implements BuilderNode {
  cacheKey: FinishNpmImportNode;
  constructor(
    private pkgJSON: PackageJSON,
    private src: string,
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
        packageSrc: this.src,
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
      src: new PackageSrcNode(this.pkgPath, this.pkgJSONNode, this.workingDir),
    };
  }

  async run({ src }: { src: string }): Promise<Value<string>> {
    // TODO create entrypoints.json for this package
    return { value: src };
  }
}

class PackageSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(
    pkgPath: string,
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

  async run({ pkgJSON }: { pkgJSON: PackageJSON }): Promise<NextNode<string>> {
    return {
      node: new PackageSrcFromGitNode(pkgJSON, this.workingDir),
    };
  }
}

class PackageSrcFromGitNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgJSON: PackageJSON, private workingDir: string) {
    this.cacheKey = `prepare-pkg-source:${pkgJSON.name},${pkgJSON.version}`;
  }

  deps() {}

  async run(): Promise<NextNode<string>> {
    // TODO move this stuff into a recipe...
    if (!this.pkgJSON.repository && this.pkgJSON.name === "gensync") {
      this.pkgJSON.repository = "https://github.com/loganfsmyth/gensync";
    }
    let { repoURL, repoSubdir } = await repoFromPkgJSON(this.pkgJSON);

    let version: string | undefined = `v${this.pkgJSON.version}`;

    // TODO recipe goes here
    if (this.pkgJSON.name === "path-parse") {
      // ugh this repo doesn't even have releases or even branches...
      version = undefined;
    }

    return {
      node: new GitCloneNode(repoURL, version, repoSubdir, this.workingDir),
    };
  }
}

class GitCloneNode implements BuilderNode {
  cacheKey: string;
  private version: string;
  constructor(
    private remoteGitURL: URL,
    version: string | undefined,
    private repoSubdir: string | undefined,
    private workingDir: string
  ) {
    this.cacheKey = `git-clone:${remoteGitURL.href}/tree/${version}`;
    this.version = version ?? "master";
  }

  deps() {}

  async run(): Promise<Value<string>> {
    let gitRoot = join(this.workingDir, "pkg-src");
    let dir = join(gitRoot, this.remoteGitURL.pathname.replace(".git", ""));
    ensureDirSync(dir);

    let repoDir = await nativeGitClone(dir, this.remoteGitURL, this.version);
    let src = this.repoSubdir ? join(repoDir, this.repoSubdir) : repoDir;
    return { value: src };
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
): Promise<{ repoURL: URL; repoSubdir: string | undefined }> {
  if (!pkgJSON.repository) {
    throw new Error(
      `the package.json for ${pkgJSON.name} does not have a repository`
    );
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
  } else if (repoHref.startsWith("http://github.com")) {
    // TODO remove this, it goes into a recipe
    // seriously....
    repoHref = repoHref.replace(/^http:/, "https:");
  } else if (!repoHref.startsWith("https")) {
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
    let { stdout } = await exec(`git tag -l ${version}`, {
      cwd: repoDir,
    });
    let tag = stdout.trim();
    if (!tag && version !== "master") {
      // TODO move into a recipe...
      // sometimes versions are not prefixed with a 'v'
      version = version.slice(1);
      ({ stdout } = await exec(`git tag -l ${version}`, {
        cwd: repoDir,
      }));
      tag = stdout.trim();
      if (!tag) {
        throw new Error(
          `Cannot find the tag '${version}' nor 'v${version}' in repo ${remoteURL}`
        );
      }
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
