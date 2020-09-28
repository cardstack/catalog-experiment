import { FileSystem } from "./filesystem";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";
import { EntrypointsJSON } from "./nodes/entrypoint";
import { makeURLEndInDir } from "./path";
import { getRecipe } from "./recipes";

// TODO move this to a better place
export interface LockFile {
  [pkgName: string]: string;
}

interface PkgInfo {
  pkgName: string;
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

export class Resolver {
  private lockFileLocationCache: Map<string, URL> = new Map();
  constructor(private fs: FileSystem, private recipesURL: URL) {}

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

    let { pkgName: sourcePkgName, version: sourcePkgVersion } =
      pkgInfoFromCatalogJsURL(source) ?? {};
    if (sourcePkgName && sourcePkgVersion) {
      let { resolutions } =
        (await getRecipe(
          sourcePkgName,
          sourcePkgVersion,
          this.fs,
          this.recipesURL
        )) ?? {};
      let href = resolutions?.[specifier];
      if (href) {
        return new URL(href);
      }
    }

    if (specifier.startsWith("https://")) {
      return new URL(specifier);
    }

    let url: URL;
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
    } else {
      // resolution is in a different package from the source
      url = await this.resolveFromLockfile(pkgInfo, source);
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

  private async findLockfile(
    url: URL
  ): Promise<{ lockfile: LockFile; url: URL }> {
    let lastCandidate: URL | undefined;
    let candidateURL: URL | undefined = this.lockFileLocationCache.get(
      url.href
    );
    if (!candidateURL) {
      candidateURL = new URL("./catalogjs.lock", url);
    }
    while (lastCandidate?.href !== candidateURL.href) {
      lastCandidate = candidateURL;
      let fd: FileDescriptor | undefined;
      try {
        fd = await this.fs.openFile(candidateURL);
        let lockfile = JSON.parse(await fd.readText());
        // Note that the lock file can change during the build as we discover
        // more dependencies, so we're not caching the actual contents of the
        // lock file since they are volatile.
        this.lockFileLocationCache.set(url.href, fd.url);
        let result = { lockfile, url: fd.url };
        return result;
      } catch (err) {
        if (err.code !== "NOT_FOUND") {
          throw err;
        }
        candidateURL = new URL("../catalogjs.lock", candidateURL);
      } finally {
        if (fd) {
          await fd.close();
        }
      }
    }
    throw new Error(`Could not find 'catalogjs.lock' when resolving ${url}`);
  }

  private async resolveFromLockfile(
    { pkgName, modulePath }: PkgInfo,
    source: URL
  ): Promise<URL> {
    let { lockfile, url: lockfileURL } = await this.findLockfile(source);
    let pkgHref = lockfile[pkgName];
    if (!pkgHref) {
      throw new Error(
        `Could not find package name '${pkgName}' in lockfile ${lockfileURL.href} when resolving ${source}`
      );
    }
    if (modulePath != null) {
      return new URL(modulePath, pkgHref);
    }

    let entrypointsDescriptor: FileDescriptor | undefined;
    let entrypointsJSON: EntrypointsJSON;
    try {
      entrypointsDescriptor = await this.fs.openFile(
        new URL("./entrypoints.json", pkgHref)
      );
      entrypointsJSON = JSON.parse(await entrypointsDescriptor.readText());
    } finally {
      if (entrypointsDescriptor) {
        await entrypointsDescriptor.close();
      }
    }

    // For now the standard is that we assume the first entry in entrypoints
    // JSON is the package entrypoint
    let entrypoint = entrypointsJSON.js?.[0];
    if (!entrypoint) {
      throw new Error(
        `Could not find a package entrypoint for the package '${pkgName}' in ${entrypointsDescriptor.url} when resolving ${source}`
      );
    }
    return new URL(entrypoint, pkgHref);
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
  return { pkgName, modulePath, version: undefined, hash: undefined };
}

export function pkgInfoFromCatalogJsURL(url: URL): PkgInfo | undefined {
  let catalogjsHref = "https://catalogjs.com/pkgs/";
  let workingHref = "https://working/";
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
  let path = url.href
    .replace(`${catalogjsHref}npm/`, "")
    .replace(catalogjsHref, "")
    .replace(workingHref, "");
  let parts = path.split("/");
  let scopedName = parts.shift()!;
  pkgName = scopedName.startsWith("@")
    ? `${scopedName}/${parts.shift()}`
    : scopedName;
  version = parts.shift()!;
  hash = parts.shift()!;
  if (parts[0] === "__build_src") {
    parts.shift();
  }
  modulePath = parts.length > 0 ? parts.join("/") : undefined;
  return {
    pkgName,
    version,
    hash,
    modulePath,
  };
}
