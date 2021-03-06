import {
  BuilderNode,
  RecipeGetter,
  ConstantNode,
  Value,
  NextNode,
} from "../../builder-worker/src/nodes/common";
import { NpmImportPackageNode } from "./nodes/npm-import";
import {
  pkgInfoFromSpecifier,
  pkgInfoFromCatalogJsURL,
  Resolver,
  AbstractResolver,
} from "../../builder-worker/src/resolver";
import { LockEntries } from "../../builder-worker/src/nodes/lock-file";
import { pkgPathFile } from "./nodes/package";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { FileDescriptor } from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import { FileNode } from "../../builder-worker/src/nodes/file";
import { EntrypointsJSON } from "../../builder-worker/src/nodes/entrypoint";
import { maybeRelativeURL } from "../../builder-worker/src/path";

export class NodeResolver extends AbstractResolver {
  private pkgPathFileCache: Map<string, string> = new Map();
  constructor(fs: FileSystem, private workingDir: string) {
    super(fs);
  }
  async resolveAsBuilderNode(
    specifier: string,
    source: URL,
    projectInput: URL
  ): Promise<BuilderNode<{ resolution: URL; lockEntries: LockEntries }>> {
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
      let resolution = await this.resolve(specifier, source);
      return new ConstantNode({ resolution, lockEntries: {} });
    }

    // deal with a module that refers to a local import using it's own pkg name
    let specifierPkgInfo = pkgInfoFromSpecifier(specifier);
    let sourcePkgInfo = pkgInfoFromCatalogJsURL(source);
    if (
      specifierPkgInfo?.pkgName &&
      specifierPkgInfo?.pkgName === sourcePkgInfo?.pkgName &&
      specifierPkgInfo.modulePath
    ) {
      let specifier = maybeRelativeURL(
        new URL(`./${specifierPkgInfo.modulePath}`, projectInput),
        source
      );
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        let resolution = await this.resolve(specifier, source);
        return new ConstantNode({ resolution, lockEntries: {} });
      }
    }

    return new EnterDependencyNode(
      specifier,
      await this.getPkgPath(source),
      source,
      this.workingDir,
      this
    );
  }

  private async getPkgPath(url: URL): Promise<string> {
    let lastCandidate: URL | undefined;
    let pkgPath = this.pkgPathFileCache.get(url.href);
    if (pkgPath) {
      return pkgPath;
    }
    let candidateURL = new URL(pkgPathFile, url);
    while (lastCandidate?.href !== candidateURL.href) {
      lastCandidate = candidateURL;
      let fd: FileDescriptor | undefined;
      try {
        fd = await this.fs.openFile(candidateURL);
        let pkgPath = await fd.readText();
        this.pkgPathFileCache.set(url.href, pkgPath);
        return pkgPath;
      } catch (err) {
        if (err.code !== "NOT_FOUND") {
          throw err;
        }
        candidateURL = new URL(`../${pkgPathFile}`, candidateURL);
      } finally {
        if (fd) {
          await fd.close();
        }
      }
    }
    throw new Error(`Could not find '${pkgPathFile}' when resolving ${url}`);
  }
}

class EnterDependencyNode
  implements BuilderNode<{ resolution: URL; lockEntries: LockEntries }> {
  cacheKey: string;
  private depName: string;
  constructor(
    private specifier: string,
    private consumedFromPath: string,
    private consumedFromURL: URL,
    private workingDir: string,
    private resolver: Resolver
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
    depOutput: { finalURL },
  }: {
    depOutput: { finalURL: URL };
  }): Promise<NextNode<{ resolution: URL; lockEntries: LockEntries }>> {
    return {
      node: new ExitDependencyNode(
        this.specifier,
        finalURL,
        this.consumedFromURL,
        this.resolver
      ),
    };
  }
}

class ExitDependencyNode
  implements BuilderNode<{ resolution: URL; lockEntries: LockEntries }> {
  cacheKey: string;
  constructor(
    private specifier: string,
    private depPkgFinalURL: URL,
    consumedFromURL: URL,
    private resolver: Resolver
  ) {
    this.cacheKey = `exit-dep:${depPkgFinalURL.href},consumedFrom=${consumedFromURL.href}`;
  }

  async deps() {
    return {
      entrypointsFile: new FileNode(
        new URL("entrypoints.json", this.depPkgFinalURL)
      ),
    };
  }

  async run({
    entrypointsFile,
  }: {
    entrypointsFile: string;
  }): Promise<Value<{ resolution: URL; lockEntries: LockEntries }>> {
    let entrypointsJSON: EntrypointsJSON = JSON.parse(entrypointsFile);
    let resolution: URL;

    let { modulePath } = pkgInfoFromSpecifier(this.specifier)!;
    if (modulePath) {
      // deal with specifiers that look like "lodash/flatMap", where there is a
      // corresponding bundle in the pkg folder
      resolution = await this.resolver.resolve(
        `./${modulePath}`,
        this.depPkgFinalURL
      );
    } else {
      // otherwise we use the first entrypoint in the entrypoints.json
      let entrypoint = entrypointsJSON.js?.[0];
      if (!entrypoint) {
        throw new Error(
          `Cannot find js entrypoint for package ${this.depPkgFinalURL}`
        );
      }
      resolution = new URL(entrypoint, this.depPkgFinalURL);
    }
    return {
      value: { resolution, lockEntries: { [this.specifier]: resolution } },
    };
  }
}
