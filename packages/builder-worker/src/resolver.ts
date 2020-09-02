import { FileSystem } from "./filesystem";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";
import { EntrypointsJSON } from "./nodes/entrypoint";
import { makeURLEndInDir } from "./path";

// TODO move this to a better place
export interface LockFile {
  [pkgName: string]: string;
}

interface PkgInfo {
  pkgName: string;
  modulePath: string | undefined;
}

function hasExtension(url: URL): boolean {
  let { href } = url;
  let basename = href.split("/").pop()!;
  return basename.includes(".");
}

function resolveFileExtension(url: URL, useCJSInterop: boolean): URL {
  let { href } = url;
  if (!hasExtension(url)) {
    href = `${href}.js`; // TODO what about .ts?
  }
  if (useCJSInterop) {
    href = href.replace(/\.js$/, ".cjs.js");
  }
  return new URL(href);
}

export class Resolver {
  private lockFileCache: Map<
    string,
    { lockfile: LockFile; url: URL }
  > = new Map();
  constructor(private fs: FileSystem) {}

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

    if (!hasExtension(url)) {
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
    if (this.lockFileCache.has(url.href)) {
      return this.lockFileCache.get(url.href)!;
    }
    let candidateURL = new URL("./catalogjs.lock", url);
    while (lastCandidate?.href !== candidateURL.href) {
      lastCandidate = candidateURL;
      let fd: FileDescriptor | undefined;
      try {
        fd = await this.fs.openFile(candidateURL);
        let lockfile = JSON.parse(await fd.readText());
        let result = { lockfile, url: fd.url };
        this.lockFileCache.set(url.href, result);
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

    let entrypointsDescriptor: FileDescriptor;
    let entrypointsJSON: EntrypointsJSON;
    try {
      entrypointsDescriptor = await this.fs.openFile(
        new URL("./entrypoints.json", lockfileURL)
      );
      entrypointsJSON = JSON.parse(await entrypointsDescriptor.readText());
    } finally {
      await entrypointsDescriptor!.close();
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
  return { pkgName, modulePath };
}
