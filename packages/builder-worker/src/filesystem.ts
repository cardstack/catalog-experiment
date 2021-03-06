import { dispatchEvent as _dispatchEvent } from "./event-bus";
import { splitURL, baseName, dirName, ROOT } from "./path";
import columnify from "columnify";
import moment from "moment";
import {
  FileSystemDriver,
  Volume,
  FileDescriptor,
  DirectoryDescriptor,
  Stat,
} from "./filesystem-drivers/filesystem-driver";
import { MemoryDriver } from "./filesystem-drivers/memory-driver";

export class FileSystem {
  private root: DirectoryDescriptor;
  // the key for the volumes map is actually the inode (aka "serial number") of
  // the underlying directory
  private volumes: Map<string, Volume> = new Map();

  constructor() {
    let volume = new MemoryDriver().mountVolumeSync(ROOT);
    this.root = volume.root;
    this.volumes.set(this.volumeKey(this.root), volume);
  }

  private volumeKey(dir: DirectoryDescriptor) {
    return `${dir.volume.root.url.href}#${dir.inode}`;
  }

  async mount(url: URL, driver: FileSystemDriver): Promise<Volume> {
    if (url.href.slice(-1) !== "/") {
      throw new FileSystemError(
        "IS_NOT_A_DIRECTORY",
        `'${url}' is not a directory (it's a file and we were expecting it to be a directory)`
      );
    }
    let dir: DirectoryDescriptor | undefined;
    let volume: Volume;
    try {
      dir = await this.openDirectory(url, true);
      volume = await driver.mountVolume(url);
      this.volumes.set(this.volumeKey(dir), volume);
    } finally {
      if (dir) {
        await dir.close();
      }
    }

    return volume;
  }

  async unmount(url: URL): Promise<void> {
    for (let [key, volume] of this.volumes) {
      if (volume.root.url.href === url.href) {
        if (url.href === ROOT.href) {
          throw new Error("Cannot unmount the root volume");
        }
        await this.volumes.get(key)!.willUnmount();
        this.volumes.delete(key);
        await this.remove(url);
        break;
      }
    }
  }

  async move(sourceURL: URL, destURL: URL): Promise<void> {
    let source = await this.open(sourceURL);
    let name = baseName(destURL);
    let destParentDirName = dirName(destURL);
    let destParent = destParentDirName
      ? await this.openDirectory(new URL(destParentDirName), true)
      : this.root;
    if (source.type === "file") {
      let sourceName = baseName(sourceURL);
      let sourceParentDir = dirName(sourceURL);
      let sourceParent = await this.openDirectory(
        sourceParentDir ? new URL(sourceParentDir) : ROOT
      );
      await destParent.add(name, source, sourceParent, sourceName);
      if (sourceParent.inode !== destParent.inode) {
        await sourceParent.close();
      }
    } else {
      await destParent.add(name, source);
    }
    await this.remove(sourceURL, false);
    await source.close();
    await destParent.close();
  }

  async copy(sourceURL: URL, destURL: URL, exclude?: string): Promise<void> {
    if (sourceURL.href === destURL.href) {
      return; // nothing to do
    }
    if (exclude && new RegExp(exclude).test(sourceURL.href)) {
      return;
    }
    let source = await this.open(sourceURL);

    if (source.type === "file") {
      let clone = await this.openFile(destURL, true);
      await clone.write(await source.getReadableStream());
      await clone.close();
    } else {
      await (await this.open(destURL, true)).close();
    }
    if (source.type === "directory") {
      for (let childName of [...(await source.children())]) {
        await this.copy(
          new URL(childName, sourceURL),
          new URL(childName, destURL),
          exclude
        );
      }
    }
    await source.close();
  }

  async remove(url: URL, autoClose = true): Promise<void> {
    await this._remove(url, autoClose);
  }

  private async _remove(url: URL, autoClose: boolean): Promise<void> {
    let name = baseName(url);
    let dir = dirName(url);
    if (!dir) {
      // should we have a special event for clearing the entire file system?
      // this only happens in tests...
      await this.root.remove(name);
    } else {
      let sourceDir: DirectoryDescriptor;
      try {
        sourceDir = await this.openDirectory(new URL(dir));
      } catch (err) {
        if (err.code !== "NOT_FOUND") {
          throw err;
        }
        return; // just ignore files that don't exist
      }
      await sourceDir.remove(name);
      if (autoClose) {
        await sourceDir.close();
      }
      dispatchEvent({
        href: url.href,
        type: "remove",
      });
    }
  }

  async list(url: URL, recurse = false): Promise<ListingEntry[]> {
    return await this._list(url, recurse);
  }

  async listAllOrigins(recurse = false): Promise<ListingEntry[]> {
    return await this._list(ROOT, recurse);
  }

  private async _list(
    url: URL,
    recurse = false,
    startingURL?: URL
  ): Promise<ListingEntry[]> {
    if (!startingURL) {
      startingURL = url;
    }
    let resource: DirectoryDescriptor | FileDescriptor | undefined;
    try {
      resource = await this.open(url);
    } finally {
      if (resource) {
        await resource.close();
      }
    }
    if (resource.type === "file") {
      return [{ url: resource.url, stat: await resource.stat() }];
    }

    let volumeRoot = this.volumes.get(this.volumeKey(resource))?.root;
    if (volumeRoot) {
      if (volumeRoot.type === "directory") {
        resource = volumeRoot;
      } else {
        return [{ url: volumeRoot.url, stat: await volumeRoot.stat() }];
      }
    }

    let results: ListingEntry[] = [];
    if (startingURL.href === url.href && url.href !== ROOT.href) {
      results.push({
        url,
        stat: await resource.stat(),
      });
    }
    for (let name of [...(await resource.children())].sort()) {
      if (await resource.hasFile(name)) {
        let d: FileDescriptor | undefined;
        let stat: Stat;
        try {
          d = await resource.getFile(name);
          stat = await d!.stat();
        } finally {
          if (d) {
            await d.close();
          }
        }
        results.push({
          stat,
          url: new URL(name, url),
        });
      } else if (await resource.hasDirectory(name)) {
        let d: DirectoryDescriptor | undefined;
        let stat: Stat;
        try {
          d = await resource.getDirectory(name);
          stat = await d!.stat();
        } finally {
          if (d) {
            await d.close();
          }
        }
        results.push({
          stat,
          url: new URL(name, url),
        });
        if (recurse) {
          results.push(
            ...(await this._list(new URL(name, url), true, startingURL))
          );
        }
      }
    }
    return results;
  }

  async openFile(url: URL): Promise<FileDescriptor>;
  async openFile(url: URL, create: Options["create"]): Promise<FileDescriptor>;
  async openFile(
    url: URL,
    create?: Options["create"]
  ): Promise<FileDescriptor> {
    return (await this.open(url, create)) as FileDescriptor;
  }

  async openDirectory(url: URL): Promise<DirectoryDescriptor>;
  async openDirectory(
    url: URL,
    create: Options["create"]
  ): Promise<DirectoryDescriptor>;
  async openDirectory(
    url: URL,
    create?: Options["create"]
  ): Promise<DirectoryDescriptor> {
    return (await this.open(url, create)) as DirectoryDescriptor;
  }

  async open(
    url: URL,
    create: Options["create"]
  ): Promise<DirectoryDescriptor | FileDescriptor>;
  async open(url: URL): Promise<DirectoryDescriptor | FileDescriptor>;
  async open(
    url: URL,
    create?: Options["create"]
  ): Promise<FileDescriptor | DirectoryDescriptor> {
    return await this._open(splitURL(url), { create });
  }

  private async _open(
    pathSegments: string[],
    opts: Options = {},
    parent?: DirectoryDescriptor,
    initialHref?: string
  ): Promise<FileDescriptor | DirectoryDescriptor> {
    if (!initialHref) {
      initialHref = pathSegments.join("");
    }
    let name = pathSegments.shift()!;
    let isDir = name.slice(-1) === "/";

    parent = parent || this.root;
    let descriptor: FileDescriptor | DirectoryDescriptor;

    if (name === ROOT.href && pathSegments.length === 0) {
      return this.root;
    }

    let volume = this.volumes.get(this.volumeKey(parent));
    if (volume) {
      // we have crossed a volume boundary, use the driver for this path and
      // the parent should be the root of the volume
      if (volume.root.type === "directory") {
        parent = volume.root;
      } else {
        // TODO I think we need a finally to close this descriptor...
        parent = await volume.createDirectory(parent, "");
      }
    } else {
      // we are still within the volume that we were within on the previous
      // pass, just use the driver associated with the parent
      volume = parent.volume;
    }

    if (
      pathSegments.length > 0 &&
      !(await parent.hasDirectory(name)) &&
      opts.create
    ) {
      // create interior directories and descend
      descriptor = await volume.createDirectory(parent, name);
      dispatchEvent({
        href: descriptor.url.href,
        type: "create",
      });
      await descriptor.close(); // close this descriptor since we are just using it for traversal and not actually returning it
      return await this._open(pathSegments, opts, descriptor, initialHref);
    } else if (pathSegments.length > 0 && (await parent.hasDirectory(name))) {
      // descend into existing directory
      descriptor = (await parent.getDirectory(name))!;
      await descriptor.close(); // close this descriptor since we are just using it for traversal and not actually returning it
      return await this._open(pathSegments, opts, descriptor, initialHref);
    } else if (
      pathSegments.length === 0 &&
      !isDir &&
      !(await parent.hasFile(name))
    ) {
      if (opts.create) {
        descriptor = await volume.createFile(parent, name);
        dispatchEvent({
          href: descriptor.url.href,
          type: "create",
        });
        return descriptor;
      } else {
        notFound(initialHref);
      }
    } else if (
      pathSegments.length === 0 &&
      !isDir &&
      (await parent.hasFile(name))
    ) {
      // the leaf is a file that exists
      return (await parent.getFile(name))!;
    } else if (
      pathSegments.length === 0 &&
      isDir &&
      !(await parent.hasDirectory(name))
    ) {
      // the leaf is a directory that does not currently exist
      if (opts.create) {
        descriptor = await volume.createDirectory(parent, name);
        dispatchEvent({
          href: descriptor.url.href,
          type: "create",
        });
        return descriptor;
      } else {
        notFound(initialHref);
      }
    } else if (
      pathSegments.length === 0 &&
      isDir &&
      (await parent.hasDirectory(name))
    ) {
      // the leaf is a directory that exists
      let descriptor = (await parent.getDirectory(name))!;
      let overMounted = this.volumes.get(this.volumeKey(descriptor));
      if (overMounted) {
        return overMounted.root;
      }
      return descriptor;
    } else {
      notFound(initialHref);
    }
    throw new Error("bug: should never get here");
  }

  async displayListing(logFn: (l: string) => void): Promise<void> {
    let listing = (await this.listAllOrigins(true)).map(({ url, stat }) => ({
      type: stat.type,
      size: stat.type === "directory" ? "-" : stat.size,
      modified:
        stat.type === "directory"
          ? "-"
          : moment(stat.mtime).format("MMM D YYYY HH:mm"),
      etag: stat.etag ?? "-",
      url,
    }));
    logFn(columnify(listing));
  }
}

type ErrorCodes =
  | "NOT_FOUND"
  | "IS_NOT_A_FILE"
  | "IS_NOT_A_DIRECTORY"
  | "ALREADY_EXISTS";
export class FileSystemError extends Error {
  constructor(public readonly code: ErrorCodes, message?: string) {
    super(message ?? code);
  }
}

export interface ListingEntry {
  url: URL;
  stat: Stat;
}

interface Options {
  create?: true;
}
interface BaseEvent {
  href: string; // this will eventually go over a postMessage boundary so we've downgraded the URL to a string
}

export interface CreateEvent extends BaseEvent {
  type: "create";
}
export interface RemoveEvent extends BaseEvent {
  type: "remove";
}
export interface WriteEvent extends BaseEvent {
  type: "write";
}

export function isFileEvent(event: any): event is Event {
  return (
    typeof event === "object" &&
    typeof event.filesystem === "object" &&
    typeof event.filesystem.href === "string" &&
    typeof event.filesystem.type === "string"
  );
}

export type FSEvent = CreateEvent | RemoveEvent | WriteEvent;

export type EventListener = (event: FSEvent) => void;

function notFound(href: string) {
  throw new FileSystemError("NOT_FOUND", `'${href}' does not exist`);
}

function dispatchEvent(event: FSEvent) {
  _dispatchEvent({ filesystem: event });
}

declare module "./event" {
  interface Event {
    filesystem?: FSEvent;
  }
}
