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
import { EntrypointsNode } from "./entrypoints";
import { log } from "../../../builder-worker/src/logger";

export class NpmImportPackagesNode implements BuilderNode {
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
      (p) => new NpmImportPackageNode(p, this.consumedFrom, this.workingDir)
    );
    return {
      // TODO add another node to unpack the PackageInfo and turn into project input/output roots
      node: new AllNode(nodes),
    };
  }
}

class NpmImportPackageNode implements BuilderNode {
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
    this.cacheKey = `npm-import-pkg:${pkgPath}`;
  }

  deps() {
    return {
      package: new MakePackageNode(this.pkgPath, this.pkgJSON, this.workingDir),
    };
  }

  async run({
    package: { url, hash },
  }: {
    package: Omit<Package, "dependencies">;
  }): Promise<NextNode<Package>> {
    let dependencies = Object.entries(this.pkgJSON.dependencies ?? {}).map(
      ([name]) => new NpmImportPackageNode(name, this.pkgPath, this.workingDir)
    );
    return {
      node: new FinishNpmImportPackageNode(
        this.pkgJSON,
        url,
        hash,
        dependencies
      ),
    };
  }
}

class MakePackageNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `make-pkg:${pkgPath}`;
  }

  deps() {
    return {
      pkgURL: new PreparePackageNode(
        this.pkgPath,
        this.pkgJSON,
        this.workingDir
      ),
      pkgHash: new PackageHashNode(this.pkgPath, this.pkgJSON),
    };
  }

  async run({
    pkgURL,
    pkgHash,
  }: {
    pkgURL: URL;
    pkgHash: string;
  }): Promise<NextNode<Omit<Package, "dependencies">>> {
    return {
      node: new FinishPackageNode(
        this.pkgPath,
        pkgURL,
        pkgHash,
        this.pkgJSON,
        this.workingDir
      ),
    };
  }
}

class FinishPackageNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgURL: URL,
    private pkgHash: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `finish-pkg:${pkgPath}`;
  }

  deps() {
    let esCompliantNode = new MakePkgESCompliantNode(
      this.pkgURL,
      new PackageSrcNode(
        this.pkgJSON,
        this.pkgPath,
        this.pkgURL,
        this.workingDir
      )
    );
    return {
      entrypoints: new EntrypointsNode(
        this.pkgJSON,
        this.pkgURL,
        esCompliantNode
      ),
      esCompliant: esCompliantNode,
    };
  }

  async run(): Promise<Value<Omit<Package, "dependencies">>> {
    return {
      value: {
        url: this.pkgURL,
        packageJSON: this.pkgJSON,
        hash: this.pkgHash,
      },
    };
  }
}

class PreparePackageNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgPath: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `prepare-pkg:${pkgPath}`;
  }

  deps() {
    return {
      hash: new PackageHashNode(this.pkgPath, this.pkgJSON),
    };
  }

  async run({ hash }: { hash: string }): Promise<NextNode<URL>> {
    log(`processing package ${this.pkgJSON.name} ${this.pkgJSON.version}`);
    let underlyingPkgPath = join(
      this.workingDir,
      "cdn",
      this.pkgJSON.name,
      hash
    ); // this is just temp until we don't need to debug any longer..
    ensureDirSync(underlyingPkgPath);
    return {
      node: new MountNode(
        new URL(
          `https://catalogjs.com/pkgs/npm/${this.pkgJSON.name}/${this.pkgJSON.version}/${hash}/`
        ),
        // TODO turn this into MemoryDriver after getting the node pre-build
        // wired into the core build, using node fs for now because it easy to
        // debug.
        new NodeFileSystemDriver(underlyingPkgPath)
      ),
    };
  }
}

class FinishNpmImportPackageNode implements BuilderNode {
  cacheKey: FinishNpmImportPackageNode;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgURL: URL,
    private pkgHash: string,
    private dependencies: NpmImportPackageNode[]
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
      node: new PackageLockNode({
        packageJSON: this.pkgJSON,
        url: this.pkgURL,
        hash: this.pkgHash,
        dependencies: this.dependencies.map((_, index) => dependencies[index]),
      }),
    };
  }
}

class PackageLockNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: Package) {
    this.cacheKey = `pkg-lock:${pkg.url.href}`;
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
