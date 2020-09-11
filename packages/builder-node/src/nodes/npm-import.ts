import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
  NodeOutput,
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
  CreateLockFileNode,
  buildSrcDir,
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
import { recipesURL } from "../../../builder-worker/src/recipes";

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

  deps() {
    return {
      mountLoader: new MountLoaderNode(),
      mountRecipes: new MountRecipesNode(),
      mountPolyfills: new MountPolyfillsNode(),
    };
  }

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
    let { name: pkgName, version, dependencies = {} } = this.pkgJSON;
    let { additionalDependencies = {}, skipDependencies } =
      getRecipe(pkgName, version) ?? {};
    let allDependencies = {
      ...dependencies,
      ...additionalDependencies,
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
      this.pkgJSON.version,
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

// All node builds automatically include the @catalogjs/loader, so we
// mount the loader so the core build has access to it.
class MountLoaderNode implements BuilderNode {
  cacheKey = `mount-loader`;

  deps() {}

  async run(): Promise<NodeOutput<URL>> {
    let underlyingPkgPath = resolveNodePkg("@catalogjs/loader");
    return {
      node: new MountNode(
        new URL(`https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/`),
        new NodeFileSystemDriver(underlyingPkgPath)
      ),
    };
  }
}

class MountPolyfillsNode implements BuilderNode {
  cacheKey = `mount-polyfills`;

  deps() {}

  async run(): Promise<NodeOutput<URL>> {
    let underlyingPkgPath = resolveNodePkg("@catalogjs/polyfills");
    return {
      node: new MountNode(
        new URL(`https://catalogjs.com/pkgs/@catalogjs/polyfills/0.0.1/`),
        new NodeFileSystemDriver(underlyingPkgPath)
      ),
    };
  }
}

class MountRecipesNode implements BuilderNode {
  cacheKey = `mount-recipes`;

  deps() {}

  async run(): Promise<NodeOutput<URL>> {
    let underlyingPath = join(resolveNodePkg("@catalogjs/recipes"), "recipes");
    return {
      node: new MountNode(recipesURL, new NodeFileSystemDriver(underlyingPath)),
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
    let dependencies = this.dependencies.map((_, index) => deps[index]);
    return {
      node: new CoreBuildNode(
        {
          packageJSON: this.pkgJSON,
          url: this.pkgURL,
          hash: this.pkgHash,
          dependencies,
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
      lock: new CreateLockFileNode(this.pkg),
      entrypoints: new WriteFileNode(
        new FileNode(new URL("entrypoints.json", this.pkg.url)),
        new URL(`${buildSrcDir}entrypoints.json`, this.pkg.url)
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
        new URL(buildSrcDir, this.pkg.url),
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
