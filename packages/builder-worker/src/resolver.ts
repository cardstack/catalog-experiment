import { FileSystem } from "./filesystem";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";
import { BuilderNode, ConstantNode } from "./nodes/common";
import { LockEntries } from "./nodes/lock-file";
import { makeURLEndInDir } from "./path";

export const catalogjsHref = "https://pkgs.catalogjs.com/";
export const workingHref = "https://working/";

export interface Resolver {
  resolveAsBuilderNode(
    specifier: string,
    source: URL
  ): Promise<BuilderNode<{ resolution: URL; lockEntries: LockEntries }>>;
  resolve(specifier: string, source: URL): Promise<URL>;
}

interface PkgInfo {
  pkgName: string;
  pkgURL?: URL;
  registry: string | undefined;
  version: string | undefined;
  hash: string | undefined;
  modulePath: string | undefined;
}

function getExtension(url: URL): string | undefined {
  let { href } = url;
  let basename = href.split("/").pop()!;
  if (!basename.includes(".")) {
    return;
  }
  return basename.split(".").pop()!;
}

function resolveFileExtension(url: URL, useCJSInterop: boolean): URL {
  let { href } = url;
  let extension = getExtension(url);
  if (!extension || extension === "json") {
    href = `${href}.js`; // TODO what about .ts?
  }
  if (useCJSInterop) {
    href = href.replace(/\.js$/, ".cjs.js");
  }
  return new URL(href);
}

export abstract class AbstractResolver implements Resolver {
  constructor(protected fs: FileSystem) {}

  abstract resolveAsBuilderNode(
    specifier: string,
    source: URL
  ): Promise<BuilderNode<{ resolution: URL; lockEntries: LockEntries }>>;

  async resolve(specifier: string, source: URL): Promise<URL> {
    if (specifier.startsWith("http://")) {
      let url = new URL(specifier);
      if (url.hostname === "localhost") {
        return url;
      } else {
        throw new Error(
          `package specifier URL does not use SSL and is susceptible to man-in-the-middle-attacks: ${specifier} in module ${source}`
        );
      }
    }

    if (specifier.startsWith("https://")) {
      return new URL(specifier);
    }

    let url: URL | undefined;
    let useCJSInterop = specifier.endsWith("$cjs$");
    if (useCJSInterop) {
      specifier = specifier.replace(/\$cjs\$$/, "");
    }
    let pkgInfo = pkgInfoFromSpecifier(specifier);
    let pkgImport = pkgInfo?.pkgName && !pkgInfo.modulePath;
    useCJSInterop = useCJSInterop && !pkgImport;

    if (!pkgInfo) {
      // resolution is local to the source
      url = new URL(specifier, source);
    }

    if (!url) {
      throw new Error(
        `Cannot resolve '${specifier}' from module ${source.href}`
      );
    }

    if (url.href.endsWith("/")) {
      url = new URL("index.js", url);
    }

    if (!getExtension(url)) {
      let candidateURL = new URL("index.js", makeURLEndInDir(url));
      if (await this.fileExists(candidateURL)) {
        url = candidateURL;
      }
    }

    url = resolveFileExtension(url, useCJSInterop);
    return url;
  }

  private async fileExists(url: URL): Promise<boolean> {
    let fd: FileDescriptor | undefined;
    try {
      fd = await this.fs.openFile(url);
      return true;
    } catch (err) {
      if (err.code !== "NOT_FOUND") {
        throw err;
      }
      return false;
    } finally {
      if (fd) {
        await fd.close();
      }
    }
  }
}

export class CoreResolver extends AbstractResolver {
  // TODO let's move the logic that we have to build projects from File Node
  // URLs that match the project root input folder (currently in the Builder's
  // InternalFileNode) into here--this is a more natural place for
  // that.
  async resolveAsBuilderNode(specifier: string, source: URL) {
    let resolution = await this.resolve(specifier, source);
    return new ConstantNode({ resolution, lockEntries: {} });
  }
}

export function pkgInfoFromSpecifier(specifier: string): PkgInfo | undefined {
  specifier = specifier.replace(/\$cjs\$$/, "");
  if (specifier.startsWith("https://")) {
    throw new Error(`not implemented`);
  }
  if (specifier.startsWith(".") || specifier.startsWith("./")) {
    return undefined;
  }

  let specifierParts = specifier.split("/");
  let pkgName = specifierParts.shift()!;
  if (pkgName.startsWith("@") && specifierParts.length > 0) {
    pkgName = `${pkgName}/${specifierParts.shift()}`;
  }
  let modulePath =
    specifierParts.length > 0 ? specifierParts.join("/") : undefined;
  return {
    pkgName,
    modulePath,
    version: undefined,
    hash: undefined,
    registry: undefined,
  };
}

const externalRegistries = ["npm"];
export function pkgInfoFromCatalogJsURL(
  url: URL
): Required<PkgInfo> | undefined {
  if (
    !url.href.startsWith(catalogjsHref) &&
    !url.href.startsWith(workingHref)
  ) {
    return;
  }

  let pkgName: string;
  let version: string;
  let hash: string;
  let modulePath: string | undefined;
  let path = url.href.replace(catalogjsHref, "").replace(workingHref, "");
  let parts = path.split("/");
  let registryOrScopedName = parts.shift()!;
  let registry: string;
  let isExternalRegistry = externalRegistries.includes(registryOrScopedName);
  if (!isExternalRegistry) {
    registry = "catalogjs";
  } else {
    registry = registryOrScopedName;
  }
  let scopedName = isExternalRegistry ? parts.shift()! : registryOrScopedName;
  pkgName = scopedName.startsWith("@")
    ? `${scopedName}/${parts.shift()}`
    : scopedName;
  version = parts.shift()!;
  hash = parts.shift()!;
  if (parts[0] === "__build_src") {
    parts.shift();
  }
  modulePath = parts.length > 0 ? parts.join("/") : undefined;
  let pkgURL = new URL(
    `${catalogjsHref}${isExternalRegistry ? "npm/" : ""}${pkgName}`
  );
  return {
    registry,
    pkgName,
    pkgURL,
    version,
    hash,
    modulePath,
  };
}
