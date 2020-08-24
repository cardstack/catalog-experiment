import { FileSystem } from "./filesystem";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";
import { EntrypointsJSON } from "./nodes/entrypoint";

// TODO move this to a better place
export interface LockFile {
  [pkgName: string]: string;
}

function resolveFileExtension(url: URL, useCJSInterop: boolean): URL {
  let { href } = url;
  let basename = href.split("/").pop()!;
  if (!basename.includes(".")) {
    href = `${href}.js`; // TODO what about .ts?
  }
  if (useCJSInterop) {
    href = href.replace(/\.js$/, ".cjs.js");
  }
  return new URL(href);
}

export class Resolver {
  constructor(private fs: FileSystem) {}

  async resolve(specifier: string, source: URL): Promise<URL> {
    if (specifier.startsWith("http://")) {
      throw new Error(
        `package specifier URL does not use SSL and is susceptible to man-in-the-middle-attacks: ${specifier} in module ${source}`
      );
    }

    if (specifier.startsWith("https://")) {
      return new URL(specifier);
    }

    let url: URL;
    let useCJSInterop = specifier.endsWith("$cjs$");
    if (useCJSInterop) {
      specifier = specifier.replace(/\$cjs\$$/, "");
    }
    if (specifier.startsWith(".") || specifier.startsWith("./")) {
      // resolution is local to the source
      url = new URL(specifier, source);
    } else {
      // resolution is in a different package from the source
      url = await this.resolveFromLockfile(specifier, source);
    }

    return resolveFileExtension(url, useCJSInterop);
  }

  private async findLockfile(url: URL): Promise<FileDescriptor> {
    let lastCandidate: URL | undefined;
    let candidateURL = new URL("./catalogjs.lock", url);
    while (lastCandidate?.href !== candidateURL.href) {
      lastCandidate = candidateURL;
      try {
        return await this.fs.openFile(candidateURL); // responsibility of caller to close this descriptor
      } catch (err) {
        if (err.code !== "NOT_FOUND") {
          throw err;
        }
        candidateURL = new URL("../catalogjs.lock", candidateURL);
      }
    }
    throw new Error(`Could not find 'catalogjs.lock' when resolving ${url}`);
  }

  private async resolveFromLockfile(
    specifier: string,
    source: URL
  ): Promise<URL> {
    let lockFileDescriptor: FileDescriptor;
    let lockfile: LockFile;
    try {
      lockFileDescriptor = await this.findLockfile(source);
      lockfile = JSON.parse(await lockFileDescriptor.readText());
    } finally {
      await lockFileDescriptor!.close();
    }
    let specifierParts = specifier.split("/");
    let pkgName = specifierParts.shift()!;
    if (pkgName.startsWith("@") && specifierParts.length > 0) {
      pkgName = `${pkgName}/${specifierParts.shift()}`;
    }
    let pkgHref = lockfile[pkgName];
    if (!pkgHref) {
      throw new Error(
        `Could not find package name '${pkgName}' in lockfile ${lockFileDescriptor.url} when resolving ${source}`
      );
    }
    let modulePath =
      specifierParts.length > 0 ? specifierParts.join("/") : undefined;
    if (modulePath != null) {
      return new URL(modulePath, pkgHref);
    }

    let entrypointsDescriptor: FileDescriptor;
    let entrypointsJSON: EntrypointsJSON;
    try {
      entrypointsDescriptor = await this.fs.openFile(
        new URL("./entrypoints.json", lockFileDescriptor.url)
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
