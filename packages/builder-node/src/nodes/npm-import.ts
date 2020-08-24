import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
} from "../../../builder-worker/src/nodes/common";
import {
  MountNode,
  WriteFileNode,
  FileNode,
} from "../../../builder-worker/src/nodes/file";
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
import { MakeProjectNode } from "../../../builder-worker/src/nodes/project";
import { Resolver } from "../../../builder-worker/src/resolver";
import { getRecipe } from "../recipes";
import partition from "lodash/partition";

export class NpmImportPackagesNode implements BuilderNode {
  // TODO the cache key for this should probably be some kind of lock file hash.
  // Until we do that, treating this as volatile...
  volatile = true;
  cacheKey = this;

  constructor(
    private pkgs: string[],
    private consumedFrom: string,
    private workingDir: string,
    private resolver: Resolver
  ) {
    //@ts-ignore
    if (typeof window !== "undefined") {
      throw new Error(`The NpmImportProjectsNode currently only runs in Node`);
    }
  }

  deps() {}

  async run(): Promise<NextNode<Package[]>> {
    let nodes = this.pkgs.map(
      (p) =>
        new NpmImportPackageNode(
          p,
          this.consumedFrom,
          this.workingDir,
          this.resolver
        )
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
  constructor(
    name: string,
    consumedFrom: string,
    private workingDir: string,
    private resolver: Resolver
  ) {
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
    package: Omit<Package, "dependencies" | "devDependencies">;
  }): Promise<NextNode<Package>> {
    let {
      name: pkgName,
      version,
      dependencies = {},
      devDependencies = {},
    } = this.pkgJSON;
    let { installDevDependencies, skipDependencies } =
      getRecipe(pkgName, version) ?? {};
    let allDependencies = {
      ...dependencies,
      ...(installDevDependencies ? devDependencies : {}),
    };
    if (Array.isArray(skipDependencies)) {
      for (let skip of skipDependencies) {
        delete allDependencies[skip];
      }
    }
    let deps = Object.entries(allDependencies).map(
      ([name]) =>
        new NpmImportPackageNode(
          name,
          this.pkgPath,
          this.workingDir,
          this.resolver
        )
    );
    return {
      node: new FinishNpmImportPackageNode(
        this.pkgJSON,
        url,
        hash,
        deps,
        this.resolver
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
  }): Promise<NextNode<Omit<Package, "dependencies" | "devDependencies">>> {
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

  async run(): Promise<
    Value<Omit<Package, "dependencies" | "devDependencies">>
  > {
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
    log(
      `entering package dependency: ${this.pkgJSON.name} ${this.pkgJSON.version}`
    );
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
    private dependencies: NpmImportPackageNode[],
    private resolver: Resolver
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.dependencies;
  }
  async run(deps: { [index: number]: Package }): Promise<NextNode<Package>> {
    let allDeps = this.dependencies.map((_, index) => deps[index]);
    let [dependencies, devDependencies] = partition(
      allDeps,
      (dep) => this.pkgJSON.dependencies?.[dep.packageJSON.name]
    );
    return {
      node: new CoreBuildNode(
        {
          packageJSON: this.pkgJSON,
          url: this.pkgURL,
          hash: this.pkgHash,
          dependencies,
          devDependencies,
        },
        this.resolver
      ),
    };
  }
}

class CoreBuildNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: Package, private resolver: Resolver) {
    this.cacheKey = `core-build:${pkg.url.href}`;
  }

  deps() {
    return {
      lock: new LockFileNode(this.pkg),
      entrypoints: new WriteFileNode(
        new FileNode(new URL("entrypoints.json", this.pkg.url)),
        new URL("es/entrypoints.json", this.pkg.url)
      ),
    };
  }

  async run(): Promise<NextNode<Package>> {
    return {
      node: new FinishCoreBuildNode(this.pkg, this.resolver),
    };
  }
}

class FinishCoreBuildNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkg: Package, private resolver: Resolver) {
    this.cacheKey = `finish-core-build:${pkg.url.href}`;
  }

  deps() {
    return {
      build: new MakeProjectNode(
        new URL("es/", this.pkg.url),
        this.pkg.url,
        this.resolver
      ),
    };
  }

  async run(): Promise<Value<Package>> {
    log(
      `exiting package dependency: ${this.pkg.packageJSON.name} ${this.pkg.packageJSON.version}`
    );
    return {
      value: this.pkg,
    };
  }
}
