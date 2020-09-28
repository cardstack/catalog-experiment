import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
  NodeOutput,
  RecipeGetter,
  ConstantNode,
} from "../../../builder-worker/src/nodes/common";
import { MountNode } from "../../../builder-worker/src/nodes/file";
import { createHash } from "crypto";
import {
  PackageJSON,
  PreparePackageNode,
  PublishPackageNode,
  getPackageJSON,
  buildSrcDir,
  buildOutputDir,
} from "./package";
import _glob from "glob";
import { join } from "path";
import { resolveNodePkg } from "../resolve";
import { NodeFileSystemDriver } from "../node-filesystem-driver";
import { log } from "../../../builder-worker/src/logger";
import { MakeProjectNode } from "../../../builder-worker/src/nodes/project";
import {
  pkgInfoFromCatalogJsURL,
  pkgInfoFromSpecifier,
  Resolver,
} from "../../../builder-worker/src/resolver";
import { recipesURL } from "../../../builder-worker/src/recipes";
import {
  getNodeForImportResolution,
  CyclicModuleResolution,
  ModuleResolution,
  ImportResolutionNodeEmitter,
} from "../../../builder-worker/src/nodes/resolution";
import bind from "bind-decorator";
import { UpdateLockFileNode } from "./lock";

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

  async deps() {
    return {
      mounts: new MakeMountsNode(),
    };
  }

  async run(): Promise<NextNode<{ finalURL: URL; workingURL: URL }[]>> {
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

  async deps() {
    log(
      `entering package dependency: ${this.pkgJSON.name} ${this.pkgJSON.version}`
    );
    return {
      workingPkgURL: new PreparePackageNode(
        this.pkgPath,
        this.pkgJSON,
        this.workingDir
      ),
    };
  }

  async run({
    workingPkgURL,
  }: {
    workingPkgURL: URL;
  }): Promise<NextNode<{ finalURL: URL; workingURL: URL }>> {
    return {
      node: new CoreBuildNode(
        this.pkgJSON,
        this.pkgPath,
        workingPkgURL,
        this.resolver,
        this.workingDir
      ),
    };
  }
}

// All node builds automatically include the @catalogjs/loader, so we
// mount the loader so the core build has access to it.
class MakeMountsNode implements BuilderNode {
  cacheKey = `make-mounts`;

  async deps() {}

  async run(): Promise<NodeOutput<URL[]>> {
    let loaderPath = resolveNodePkg("@catalogjs/loader");
    let nodes: MountNode[] = [];
    nodes.push(
      new MountNode(
        new URL(`https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/`),
        new NodeFileSystemDriver(loaderPath)
      )
    );
    let polyfillsPath = resolveNodePkg("@catalogjs/polyfills");
    nodes.push(
      new MountNode(
        new URL(`https://catalogjs.com/pkgs/@catalogjs/polyfills/0.0.1/`),
        new NodeFileSystemDriver(polyfillsPath)
      )
    );
    let recipesPath = join(resolveNodePkg("@catalogjs/recipes"), "recipes");
    nodes.push(
      new MountNode(recipesURL, new NodeFileSystemDriver(recipesPath))
    );
    return {
      node: new AllNode(nodes),
    };
  }
}

class CoreBuildNode implements BuilderNode {
  cacheKey: string;
  private pkgDeps: Map<string, URL> = new Map();
  constructor(
    private pkgJSON: PackageJSON,
    private pkgPath: string,
    private pkgWorkingURL: URL,
    private resolver: Resolver,
    private workingDir: string
  ) {
    this.cacheKey = `core-build:${pkgWorkingURL.href}`;
  }

  @bind
  captureDependencyInfo(depName: string, depURL: URL) {
    this.pkgDeps.set(depName, depURL);
  }

  async deps() {
    return {
      build: new MakeProjectNode(
        new URL(buildSrcDir, this.pkgWorkingURL),
        new URL(buildOutputDir, this.pkgWorkingURL),
        this.resolver,
        makeDependencyDescentEmitter(
          this.pkgPath,
          this.pkgWorkingURL,
          this.workingDir,
          this.captureDependencyInfo
        )
      ),
    };
  }

  async run(): Promise<NextNode<{ finalURL: URL; workingURL: URL }>> {
    return {
      node: new FinishCoreBuild(
        this.pkgJSON,
        this.pkgWorkingURL,
        this.pkgDeps,
        this.workingDir
      ),
    };
  }
}

class FinishCoreBuild implements BuilderNode {
  cacheKey: string;
  private pkgFinalURL: URL;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgWorkingURL: URL,
    pkgDeps: Map<string, URL>,
    private workingDir: string
  ) {
    let { name, version } = pkgJSON;
    let depHrefs = [...pkgDeps.keys()]
      .sort()
      .map((depName) => pkgDeps.get(depName)!.href);
    let hash = createHash("sha1")
      .update(`${name}${version}${depHrefs.join("")}`)
      .digest("base64")
      .replace(/\//g, "-");
    this.pkgFinalURL = new URL(
      `https://catalogjs.com/pkgs/npm/${name}/${version}/${hash}/`
    );
    this.cacheKey = `finish-core-build:${this.pkgFinalURL.href}`;
  }

  async deps() {
    return {
      publish: new PublishPackageNode(
        this.pkgWorkingURL,
        this.pkgFinalURL,
        this.workingDir
      ),
    };
  }

  async run(): Promise<Value<{ finalURL: URL; workingURL: URL }>> {
    log(
      `exiting package dependency: ${this.pkgJSON.name} ${this.pkgJSON.version}`
    );
    return {
      value: { finalURL: this.pkgFinalURL, workingURL: this.pkgWorkingURL },
    };
  }
}

class EnterDependencyNode implements BuilderNode {
  cacheKey: string;
  private depName: string;
  constructor(
    private specifier: string,
    private consumedFromPath: string,
    private consumedFromURL: URL,
    private consumptionStack: string[],
    private workingDir: string,
    private resolver: Resolver,
    private captureDependencyInfo: (depName: string, depURL: URL) => void
  ) {
    let pkgInfo = pkgInfoFromSpecifier(specifier);
    if (!pkgInfo) {
      throw new Error(
        `bug: could not figure out package name from specifier ${specifier} when resolving module ${consumedFromURL.href}`
      );
    }
    this.depName = pkgInfo.pkgName;
    this.cacheKey = `enter-dep:${this.depName},consumedFrom=${consumedFromURL.href}`;
  }

  async deps(getRecipe: RecipeGetter) {
    let pkgInfo = pkgInfoFromCatalogJsURL(this.consumedFromURL)!;
    let { pkgName, version } = pkgInfo;
    if (version == null) {
      throw new Error(
        `bug: cannot determine version from URL ${this.consumedFromURL.href}`
      );
    }
    let { resolutions } = (await getRecipe(pkgName, version)) ?? {};
    let resolution = resolutions?.[this.depName];
    if (resolution) {
      return {
        depOutput: new ConstantNode({ finalURL: new URL(resolution) }),
      };
    }

    return {
      depOutput: new NpmImportPackageNode(
        this.depName,
        this.consumedFromPath,
        this.workingDir,
        this.resolver
      ),
    };
  }

  async run({
    depOutput,
  }: {
    depOutput: { finalURL: URL; workingURL?: URL };
  }): Promise<NextNode<ModuleResolution | CyclicModuleResolution>> {
    let { finalURL: depURL } = depOutput;
    this.captureDependencyInfo(this.depName, depURL);
    return {
      node: new ExitDependencyNode(
        this.depName,
        depURL,
        this.specifier,
        this.consumedFromURL,
        this.consumedFromPath,
        this.consumptionStack,
        this.resolver,
        this.workingDir,
        this.captureDependencyInfo
      ),
    };
  }
}

class ExitDependencyNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private depName: string,
    private depURL: URL,
    private specifier: string,
    private consumedFromURL: URL,
    private consumedFromPath: string,
    private consumptionStack: string[],
    private resolver: Resolver,
    private workingDir: string,
    private captureDependencyInfo: (depName: string, depURL: URL) => void
  ) {
    this.cacheKey = `exit-dep:${depURL.href},consumedFrom=${consumedFromURL.href}`;
  }

  async deps() {
    let pkgWorkingURL = new URL(
      this.consumedFromURL.href.split(buildSrcDir)[0]
    );
    return {
      updateLockFile: new UpdateLockFileNode(
        pkgWorkingURL,
        this.depURL,
        this.depName
      ),
    };
  }

  async run(): Promise<NextNode<ModuleResolution | CyclicModuleResolution>> {
    let importResolutionNodeEmitter = makeDependencyDescentEmitter(
      this.consumedFromPath,
      this.consumedFromURL,
      this.workingDir,
      this.captureDependencyInfo,
      this.specifier
    );
    return {
      node: await importResolutionNodeEmitter(
        this.specifier,
        this.consumedFromURL,
        this.resolver,
        importResolutionNodeEmitter,
        this.consumptionStack
      ),
    };
  }
}

function makeDependencyDescentEmitter(
  pkgPath: string,
  pkgWorkingURL: URL,
  workingDir: string,
  captureDependencyInfo: (depName: string, depURL: URL) => void,
  onExitSpecifier?: string
): ImportResolutionNodeEmitter {
  return async (
    specifier: string,
    source: URL,
    resolver: Resolver,
    nextEmitter: ImportResolutionNodeEmitter,
    stack: string[] = []
  ) => {
    if (
      specifier.startsWith(".") ||
      specifier.startsWith("/") ||
      specifier === onExitSpecifier
    ) {
      return getNodeForImportResolution(
        specifier,
        source,
        resolver,
        nextEmitter,
        stack
      );
    }
    return new EnterDependencyNode(
      specifier,
      pkgPath,
      pkgWorkingURL,
      stack,
      workingDir,
      resolver,
      captureDependencyInfo
    );
  };
}
