import {
  BuilderNode,
  NextNode,
  RecipeGetter,
  ConstantNode,
  NodeOutput,
} from "../../builder-worker/src/nodes/common";
import { NpmImportPackageNode } from "./nodes/npm-import";
import {
  pkgInfoFromSpecifier,
  pkgInfoFromCatalogJsURL,
  Resolver,
  AbstractResolver,
} from "../../builder-worker/src/resolver";
import { UpdateLockFileNode } from "./nodes/lock";
import { buildSrcDir, pkgPathFile } from "./nodes/package";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { FileDescriptor } from "../../builder-worker/src/filesystem-drivers/filesystem-driver";

export class NodeResolver extends AbstractResolver {
  private pkgPathFileCache: Map<string, string> = new Map();
  constructor(fs: FileSystem, recipesURL: URL, private workingDir: string) {
    super(fs, recipesURL);
  }
  async resolveAsBuilderNode(
    specifier: string,
    source: URL
  ): Promise<BuilderNode<URL>> {
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
      let url = await this.resolve(specifier, source);
      return new ConstantNode(url);
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

class EnterDependencyNode implements BuilderNode<URL> {
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
    depOutput: { finalURL: URL; workingURL?: URL };
  }): Promise<NextNode<URL>> {
    return {
      node: new ExitDependencyNode(
        this.specifier,
        this.depName,
        finalURL,
        this.consumedFromURL,
        this.resolver
      ),
    };
  }
}

class ExitDependencyNode implements BuilderNode<URL> {
  cacheKey: string;
  constructor(
    private specifier: string,
    private depName: string,
    private depFinalURL: URL,
    private consumedFromURL: URL,
    private resolver: Resolver
  ) {
    this.cacheKey = `exit-dep:${depFinalURL.href},consumedFrom=${consumedFromURL.href}`;
  }

  async deps() {
    let pkgWorkingURL = new URL(
      this.consumedFromURL.href.split(buildSrcDir)[0]
    );
    return {
      updateLockFile: new UpdateLockFileNode(
        pkgWorkingURL,
        this.depFinalURL,
        this.depName
      ),
    };
  }

  async run(): Promise<NodeOutput<URL>> {
    let resolvedURL = await this.resolver.resolve(
      this.specifier,
      this.consumedFromURL
    );
    return { value: resolvedURL };
  }
}
