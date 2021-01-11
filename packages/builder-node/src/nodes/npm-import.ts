import {
  BuilderNode,
  NextNode,
  AllNode,
  Value,
  NodeOutput,
} from "../../../builder-worker/src/nodes/common";
import { MountNode } from "../../../builder-worker/src/nodes/file";
import {
  PackageJSON,
  PreparePackageNode,
  getPackageJSON,
  buildSrcDir,
  buildOutputDir,
} from "./package";
import { PublishPackageNode } from "./publish";
import _glob from "glob";
import { join } from "path";
import { resolveNodePkg } from "../pkg-resolve";
import { NodeFileSystemDriver } from "../node-filesystem-driver";
import { log } from "../../../builder-worker/src/logger";
import { MakeProjectNode } from "../../../builder-worker/src/nodes/project";
import { Resolver } from "../../../builder-worker/src/resolver";
import { recipesURL } from "../../../builder-worker/src/recipes";
import { catalogjsHref } from "../../../builder-worker/src/resolver";
import { LockEntries } from "../../../builder-worker/src/nodes/lock-file";

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

export class NpmImportPackageNode implements BuilderNode {
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
      `entering package dependency: ${this.pkgJSON.name} ${this.pkgJSON.version} (${this.pkgPath})`
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
      node: new CoreBuildNode(this.pkgJSON, workingPkgURL, this.resolver),
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
        new URL(`${catalogjsHref}@catalogjs/loader/0.0.1/`),
        new NodeFileSystemDriver(loaderPath)
      )
    );
    let polyfillsPath = resolveNodePkg("@catalogjs/polyfills");
    nodes.push(
      new MountNode(
        new URL(`${catalogjsHref}@catalogjs/polyfills/0.0.1/`),
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
  constructor(
    private pkgJSON: PackageJSON,
    private pkgWorkingURL: URL,
    private resolver: Resolver
  ) {
    this.cacheKey = `core-build:${pkgWorkingURL.href}`;
  }

  async deps() {
    return {
      lockEntries: new MakeProjectNode(
        new URL(buildSrcDir, this.pkgWorkingURL),
        new URL(buildOutputDir, this.pkgWorkingURL),
        this.resolver,
        {
          // all node builds should have resolutions for the runtime loader
          // available, so that runtime loading situations (e.g. a dynamic
          // require specifier) can be handled if they arise
          resolutions: {
            "@catalogjs/loader":
              "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
          },
        }
      ),
    };
  }

  async run({
    lockEntries,
  }: {
    lockEntries: LockEntries;
  }): Promise<NextNode<{ finalURL: URL; workingURL: URL }>> {
    return {
      node: new FinishCoreBuild(this.pkgJSON, this.pkgWorkingURL, lockEntries),
    };
  }
}

class FinishCoreBuild implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgWorkingURL: URL,
    private lockEntries: LockEntries
  ) {
    this.cacheKey = `finish-core-build:${this.pkgWorkingURL.href}`;
  }

  async deps() {
    return {
      pkgFinalURL: new PublishPackageNode(this.pkgWorkingURL, this.lockEntries),
    };
  }

  async run({
    pkgFinalURL,
  }: {
    pkgFinalURL: URL;
  }): Promise<Value<{ finalURL: URL; workingURL: URL }>> {
    log(
      `exiting package dependency: ${this.pkgJSON.name} ${this.pkgJSON.version}`
    );
    return {
      value: {
        finalURL: pkgFinalURL,
        workingURL: this.pkgWorkingURL,
      },
    };
  }
}
