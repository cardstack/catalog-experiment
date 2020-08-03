import { BuilderNode, NextNode, AllNode, Value, ConstantNode } from "./common";
import { FileNode, FileExistsNode } from "./file";
import { flatten } from "lodash";
import { log } from "../logger";
import git, { GitProgressEvent } from "isomorphic-git";
import http from "isomorphic-git/http/node";

const githubRepoRegex = /^https:\/\/github.com\/(?<org>[^\/]+)\/(?<repo>[^\/]+)(\/tree\/(?<branch>[^\/]+)(?<subdir>\/.+|\/)?)?$/;

export interface GitRoot {
  // TODO we can eliminate this param if we make our node fs abstraction
  // compatible with isomorphic git
  nodeFSPath: string;
  fsURL: URL;
}

export interface PackageEntry {
  name: string;
  semver: string;
}
export interface PackageInfo {
  package: PackageEntry;
  packageJSON: PackageJSON;
  packageSrc: URL;
  dependencies: PackageInfo[];
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
    private pkgs: PackageEntry[],
    private nodeModulesURL: URL,
    private gitRoot: GitRoot
  ) {
    //@ts-ignore
    if (typeof window !== "undefined") {
      throw new Error(`The NpmImportProjectsNode currently only runs in Node`);
    }
  }

  deps() {}

  async run(): Promise<NextNode<PackageInfo[]>> {
    let nodes = this.pkgs.map(
      (p) => new NpmImportProjectNode(p, this.nodeModulesURL, this.gitRoot)
    );
    return {
      // TODO add another node to unpack the PackageInfo and turn into project input/output roots
      node: new AllNode(nodes),
    };
  }
}

class NpmImportProjectNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkg: PackageEntry,
    private nodeModulesURL: URL,
    private gitRoot: GitRoot
  ) {
    this.cacheKey = `npm-import-project:${pkg.name},${pkg.semver}`;
  }

  deps() {
    let pkgJSON = new PackageJSONNode(this.pkg, this.nodeModulesURL);
    return {
      src: new PackageSrcNode(this.pkg, pkgJSON, this.gitRoot),
      pkgJSON,
      pkgURL: new PackageResolutionNode(this.pkg, this.nodeModulesURL),
    };
  }

  async run({
    src,
    pkgJSON,
    pkgURL,
  }: {
    src: URL;
    pkgJSON: PackageJSON;
    pkgURL: URL;
  }): Promise<NextNode<PackageInfo>> {
    console.log(`loaded package.json for ${pkgJSON.name} ${this.pkg.semver}`);
    let dependencies = await Promise.all(
      Object.entries(pkgJSON.dependencies ?? []).map(
        async ([name, semver]) =>
          new NpmImportProjectNode(
            {
              name,
              semver,
            },
            new URL(`node_modules/`, pkgURL),
            this.gitRoot
          )
      )
    );
    return {
      node: new FinishNpmImportNode(this.pkg, pkgJSON, src, dependencies),
    };
  }
}

class FinishNpmImportNode implements BuilderNode {
  cacheKey: FinishNpmImportNode;
  constructor(
    private pkg: PackageEntry,
    private pkgJSON: PackageJSON,
    private src: URL,
    private dependencies: NpmImportProjectNode[]
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.dependencies;
  }
  async run(dependencies: {
    [index: number]: PackageInfo;
  }): Promise<Value<PackageInfo>> {
    return {
      value: {
        package: this.pkg,
        packageJSON: this.pkgJSON,
        packageSrc: this.src,
        dependencies: this.dependencies.map((_, index) => dependencies[index]),
      },
    };
  }
}

class PackageSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkg: PackageEntry,
    private pkgJSONNode: PackageJSONNode,
    private gitRoot: GitRoot
  ) {
    this.cacheKey = `prepare-pkg-source:${pkg.name},${pkg.semver}:${gitRoot.fsURL.href}`;
  }

  deps() {
    return {
      src: new PreparePackageSrcNode(this.pkg, this.pkgJSONNode, this.gitRoot),
      pkgJSON: this.pkgJSONNode,
    };
  }

  async run({
    src,
    pkgJSON,
  }: {
    src: URL;
    pkgJSON: PackageJSON;
  }): Promise<Value<URL>> {
    // TODO need to create entrypoints.json: use PackageEntrypointsNode
    return { value: src };
  }
}

// Clone to gitRootURL. This is where our input project root will come from.
class PreparePackageSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkg: PackageEntry,
    private pkgJSONNode: PackageJSONNode,
    private gitRoot: GitRoot
  ) {
    this.cacheKey = `prepare-pkg-source:${pkg.name},${pkg.semver}:${gitRoot.fsURL.href}`;
  }
  deps() {
    return {
      pkgJSON: this.pkgJSONNode,
    };
  }
  async run({ pkgJSON }: { pkgJSON: PackageJSON }): Promise<NextNode<URL>> {
    if (!pkgJSON.repository) {
      throw new Error(
        `the package.json for ${this.pkg.name} does not have a repository`
      );
    }
    let remoteGitURL: URL;
    let subdir: string | undefined;
    let repositoryHref: string;
    if (typeof pkgJSON.repository === "string") {
      repositoryHref = pkgJSON.repository;
    } else {
      repositoryHref = pkgJSON.repository.url;
    }
    if (repositoryHref.startsWith("git@github.com:")) {
      repositoryHref = `https://github.com/${repositoryHref.replace(
        "git@github.com:",
        ""
      )}`;
    } else if (repositoryHref.startsWith("git://github.com/")) {
      repositoryHref = `https://github.com/${repositoryHref.replace(
        "git://github.com/",
        ""
      )}`;
    } else if (repositoryHref.startsWith("http://github.com")) {
      // seriously....
      repositoryHref = repositoryHref.replace(/^http:/, "https:");
    } else if (!repositoryHref.startsWith("https")) {
      // just try using the string as a path in the github origin, there are
      // many types of shortcuts here --ugh
      // https://docs.npmjs.com/files/package.json#repository
      let url = new URL(repositoryHref, "https://github.com");
      let response = await http.request({ url: `${url.href}.git` });
      if (response.statusCode !== 200) {
        throw new Error(
          `Cannot figure out HTTPS repo URL for '${repositoryHref}' of package ${this.pkg.name}`
        );
      }
      repositoryHref = url.href;
    }

    // strip off .git from the URL if it exists--we'll add it afterwards (pkgs
    // seem to be inconsistent in terms of having ".git" in the URL)
    repositoryHref = repositoryHref.replace(/\.git$/, "");

    let match = githubRepoRegex.exec(repositoryHref);
    if (!match) {
      remoteGitURL = new URL(repositoryHref);
    } else {
      let { org, repo, subdir: remoteSubdir } = match.groups!;
      remoteGitURL = new URL(`https://github.com/${org}/${repo}.git`);
      subdir = remoteSubdir;
    }

    return {
      node: new GitCloneNode(
        remoteGitURL,
        `v${pkgJSON.version}`,
        subdir,
        this.gitRoot
      ),
    };
  }
}

class GitCloneNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private remoteGitURL: URL,
    private version: string,
    private subdir: string | undefined,
    private gitRoot: GitRoot
  ) {
    this.cacheKey = `git-clone:${remoteGitURL.href}/tree/${version}`;
  }

  deps() {}

  async run(): Promise<Value<URL>> {
    // using dynamic import so we don't cause problems when the builder is used
    // in a non-node context.
    let fs = await import("fs");
    let path = await import("path");
    let repoDir = `${this.remoteGitURL.pathname.replace(".git", "")}/tree/${
      this.version
    }`;
    let dir = path.join(this.gitRoot.nodeFSPath, repoDir);

    // Probably should use a more rigorous way to test to see if this is a valid
    // git repo...
    if (
      !fs.existsSync(path.join(dir, ".git")) ||
      fs.readdirSync(dir).length < 2
    ) {
      let gitProgress: string;
      let args = {
        fs,
        http,
        dir,
        url: this.remoteGitURL.href,
        ref: this.version,
        singleBranch: true,
        onProgress: (event: GitProgressEvent) => {
          if (gitProgress !== event.phase) {
            gitProgress = event.phase;
            log(`cloning ${this.remoteGitURL.href}: ${event.phase}`);
          }
        },
      };
      try {
        fs.mkdirSync(dir, { recursive: true });
        await git.clone(args);
      } catch (e) {
        // sometimes versions are not prefixed with a 'v'
        if (e.code === "NotFoundError") {
          args.ref = args.ref.slice(1);
          try {
            await git.clone(args);
          } catch (ee) {
            debugger;
            throw ee;
          }
        } else {
          debugger;
          throw e;
        }
      }
    }

    // TODO need to take into account the git clone dir too...
    let src = new URL(
      `${repoDir}${this.subdir ? this.subdir + "/" : ""}`,
      this.gitRoot.fsURL
    );

    return { value: src };
  }
}

class PackageEntrypointsNode implements BuilderNode {
  cacheKey: string;
  constructor(private src: URL, private pkgJSONNode: PackageJSONNode) {
    this.cacheKey = `package-entrypoints:${src.href}`;
  }

  deps() {
    return {
      pkgJSON: this.pkgJSONNode,
    };
  }

  async run({ pkgJSON }: { pkgJSON: PackageJSON }): Promise<Value<URL>> {
    // TODO create entrypoints.json for this package
    return { value: this.src };
  }
}

class PackageJSONNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: PackageEntry, private nodeModulesURL: URL) {
    this.cacheKey = `package-json:${pkg.name},${pkg.semver}`;
  }

  deps() {
    return {
      pkgURL: new PackageResolutionNode(this.pkg, this.nodeModulesURL),
    };
  }

  async run({ pkgURL }: { pkgURL: URL }): Promise<NextNode<PackageJSON>> {
    return { node: new PackageJSONLoaderNode(pkgURL) };
  }
}

class PackageJSONLoaderNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL) {
    this.cacheKey = `package-json-loader:${pkgURL.href}`;
  }
  deps() {
    return {
      pkgJSON: new FileNode(new URL("package.json", this.pkgURL)),
    };
  }
  async run({ pkgJSON }: { pkgJSON: string }): Promise<Value<PackageJSON>> {
    return { value: JSON.parse(pkgJSON) as PackageJSON };
  }
}

class PackageResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: PackageEntry, private nodeModulesURL: URL) {
    this.cacheKey = `package-resolution:${pkg.name},${pkg.semver}`;
  }

  deps() {
    let pathSegments = this.nodeModulesURL.pathname.slice(0, -1).split("/");
    let nodeModulesPaths = pathSegments.reduceRight(
      (paths, segment, index, segments) => {
        if (index === 0) {
          // assumes that the root of this FS mount is the root node_modules folder
          paths.push(new URL(`/${this.pkg.name}/`, this.nodeModulesURL.origin));
        } else if (segment === "node_modules") {
          paths.push(
            new URL(
              `${segments.slice(0, index + 1).join("/")}/${this.pkg.name}/`,
              this.nodeModulesURL.origin
            )
          );
        }
        return paths;
      },
      [] as URL[]
    );
    return {
      possibleResolutions: new AllNode(
        nodeModulesPaths.map((p) => new ConstantNode(p))
      ),
      resolutionResults: new AllNode(
        nodeModulesPaths.map((url) => new FileExistsNode(url))
      ),
    };
  }

  async run({
    possibleResolutions,
    resolutionResults,
  }: {
    possibleResolutions: URL[];
    resolutionResults: boolean[][];
  }): Promise<Value<URL>> {
    let results = flatten(resolutionResults) as boolean[];
    for (let [index, result] of results.entries()) {
      if (result) {
        return {
          value: possibleResolutions[index],
        };
      }
    }
    throw new Error(
      `Cannot resolve package ${this.pkg.name} ${this.pkg.semver} from ${this.nodeModulesURL} or one of its ancestor node_modules folders`
    );
  }
}
