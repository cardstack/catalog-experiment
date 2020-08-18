import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
} from "../../../builder-worker/src/nodes/common";
import { MountNode } from "../../../builder-worker/src/nodes/file";
import { MakePkgESCompliantNode } from "./cjs-interop";
import {
  Package,
  PackageJSON,
  PackageEntrypointsNode,
  PackageSrcNode,
  PackageHashNode,
  getPackageJSON,
  LockFileNode,
} from "./package";
import _glob from "glob";
import { join } from "path";
import { resolveNodePkg } from "../resolve";
import { NodeFileSystemDriver } from "../node-filesystem-driver";
import { ensureDirSync } from "fs-extra";

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
  private pkgJSON: PackageJSON;
  constructor(name: string, consumedFrom: string, private workingDir: string) {
    let pkgPath = resolveNodePkg(name, consumedFrom);
    if (!pkgPath) {
      throw new Error(
        `Could not resolve package '${name}' consumed from ${consumedFrom}`
      );
    }
    this.pkgPath = pkgPath;
    this.pkgJSON = getPackageJSON(pkgPath);
    this.cacheKey = `npm-import-project:${pkgPath}`;
  }

  deps() {
    return {
      project: new MakeProjectNode(this.pkgPath, this.pkgJSON, this.workingDir),
    };
  }

  async run({
    project: { pkgURL, pkgHash },
  }: {
    project: {
      pkgURL: URL;
      pkgHash: string;
    };
  }): Promise<NextNode<Package>> {
    let dependencies = Object.entries(this.pkgJSON.dependencies ?? {}).map(
      ([name]) => new NpmImportProjectNode(name, this.pkgPath, this.workingDir)
    );
    return {
      node: new FinishNpmImportNode(
        this.pkgJSON,
        pkgURL,
        pkgHash,
        dependencies
      ),
    };
  }
}

class MakeProjectNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `make-project:${pkgPath}`;
  }

  deps() {
    return {
      pkgURL: new PrepareProjectNode(
        this.pkgPath,
        this.pkgJSON,
        this.workingDir
      ),
      pkgHash: new PackageHashNode(this.pkgPath, this.pkgJSON),
    };
  }

  async run({
    pkgURL,
    pkgHash: [, pkgHash],
  }: {
    pkgURL: URL;
    pkgHash: string[];
  }): Promise<
    NextNode<{ pkgURL: URL; pkgJSON: PackageJSON; pkgHash: string }>
  > {
    return {
      node: new FinishProjectNode(
        this.pkgPath,
        pkgURL,
        pkgHash,
        this.pkgJSON,
        this.workingDir
      ),
    };
  }
}

class FinishProjectNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgURL: URL,
    private pkgHash: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `finish-project:${pkgPath}`;
  }

  deps() {
    let pkgSourceNode = new PackageSrcNode(
      this.pkgJSON,
      this.pkgPath,
      this.pkgURL,
      this.workingDir
    );
    return {
      entrypoints: new PackageEntrypointsNode(
        this.pkgJSON,
        this.pkgURL,
        pkgSourceNode
      ),
      esCompliant: new MakePkgESCompliantNode(this.pkgURL, pkgSourceNode),
    };
  }

  async run(): Promise<
    Value<{ pkgURL: URL; pkgJSON: PackageJSON; pkgHash: string }>
  > {
    return {
      value: {
        pkgURL: this.pkgURL,
        pkgJSON: this.pkgJSON,
        pkgHash: this.pkgHash,
      },
    };
  }
}

class PrepareProjectNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `prepare-project:${pkgPath}`;
  }

  deps() {
    return {
      pkgHash: new PackageHashNode(this.pkgPath, this.pkgJSON),
    };
  }

  async run({
    pkgHash: pkgHash,
  }: {
    pkgHash: [string, string];
  }): Promise<NextNode<URL>> {
    let [pkgName, hash] = pkgHash;
    let underlyingPkgPath = join(
      this.workingDir,
      "es-compat-pkgs",
      pkgName,
      hash
    ); // this is just temp until we don't need to debug any longer..
    ensureDirSync(underlyingPkgPath);
    return {
      node: new MountNode(
        new URL(`https://${pkgName}/${hash}/`),
        // TODO turn this into MemoryDriver after getting the node pre-build
        // wired into the core build, using node fs for now because it easy to
        // debug.
        new NodeFileSystemDriver(underlyingPkgPath)
      ),
    };
  }
}

class FinishNpmImportNode implements BuilderNode {
  cacheKey: FinishNpmImportNode;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgURL: URL,
    private pkgHash: string,
    private dependencies: NpmImportProjectNode[]
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.dependencies;
  }
  async run(dependencies: {
    [index: number]: Package;
  }): Promise<NextNode<Package>> {
    return {
      node: new PackageLockNode(
        new Package(
          this.pkgJSON,
          this.pkgURL,
          this.pkgHash,
          this.dependencies.map((_, index) => dependencies[index])
        )
      ),
    };
  }
}

class PackageLockNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: Package) {
    this.cacheKey = `pkg-lock:${pkg.packageURL.href}`;
  }

  deps() {
    return {
      lock: new LockFileNode(this.pkg),
    };
  }

  async run(): Promise<Value<Package>> {
    return { value: this.pkg };
  }
}
