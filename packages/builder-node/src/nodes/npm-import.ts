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
  PackageIdentifierNode,
  getPackageJSON,
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
    project: { pkgURL, pkgIdentifier },
  }: {
    project: {
      pkgURL: URL;
      pkgIdentifier: string;
    };
  }): Promise<NextNode<Package>> {
    let dependencies = Object.entries(this.pkgJSON.dependencies ?? {}).map(
      ([name]) => new NpmImportProjectNode(name, this.pkgPath, this.workingDir)
    );
    return {
      node: new FinishNpmImportNode(
        this.pkgJSON,
        pkgURL,
        pkgIdentifier,
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
      pkgIdentifier: new PackageIdentifierNode(this.pkgPath, this.pkgJSON),
    };
  }

  async run({
    pkgURL,
    pkgIdentifier: [, pkgIdentifier],
  }: {
    pkgURL: URL;
    pkgIdentifier: string[];
  }): Promise<
    NextNode<{ pkgURL: URL; pkgJSON: PackageJSON; pkgIdentifier: string }>
  > {
    return {
      node: new FinishProjectNode(
        this.pkgPath,
        pkgURL,
        pkgIdentifier,
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
    private pkgIdentifier: string,
    private pkgJSON: PackageJSON,
    private workingDir: string
  ) {
    this.cacheKey = `finish-project:${pkgPath}`;
  }

  deps() {
    // TODO need to generate lockfile. We should determine the pkg identifiers of
    // our deps first (by resolving those here), which might mean that we should
    // recurse into this node here in deps() instead of in run()
    let pkgSourceNode = new PackageSrcNode(
      this.pkgJSON,
      this.pkgPath,
      this.pkgURL,
      this.workingDir
    );
    return {
      entrypoints: new PackageEntrypointsNode(
        this.pkgPath,
        this.pkgJSON,
        this.pkgURL,
        pkgSourceNode
      ),
      esCompliant: new MakePkgESCompliantNode(this.pkgURL, pkgSourceNode),
    };
  }

  async run(): Promise<
    Value<{ pkgURL: URL; pkgJSON: PackageJSON; pkgIdentifier: string }>
  > {
    return {
      value: {
        pkgURL: this.pkgURL,
        pkgJSON: this.pkgJSON,
        pkgIdentifier: this.pkgIdentifier,
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
      pkgIdentifier: new PackageIdentifierNode(this.pkgPath, this.pkgJSON),
    };
  }

  async run({
    pkgIdentifier,
  }: {
    pkgIdentifier: [string, string];
  }): Promise<NextNode<URL>> {
    let [pkgName, pkgId] = pkgIdentifier;
    let underlyingPkgPath = join(
      this.workingDir,
      "es-compat-pkgs",
      pkgName,
      pkgId
    ); // this is just temp until we don't need to debug any longer..
    ensureDirSync(underlyingPkgPath);
    return {
      node: new MountNode(
        new URL(`https://${pkgName}/${pkgId}/`),
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
    private pkgIdentifier: string,
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
        packageURL: this.pkgURL,
        packageIdentifier: this.pkgIdentifier,
        dependencies: this.dependencies.map((_, index) => dependencies[index]),
      },
    };
  }
}
