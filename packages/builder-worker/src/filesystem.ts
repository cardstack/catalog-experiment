import bind from "bind-decorator";
import { splitURL, baseName, dirName, ROOT, assertURLEndsInDir } from "./path";
import columnify from "columnify";
import moment from "moment";
import {
  FileSystemDriver,
  Volume,
  DefaultDriver,
  FileDescriptor,
  DirectoryDescriptor,
  Stat,
} from "./filesystem-drivers/filesystem-driver";
import { log } from "./logger";

export class FileSystem {
  private listeners: Map<string, EventListener[]> = new Map();
  private drainEvents?: Promise<void>;
  private eventQueue: {
    type: EventType;
    url: URL;
    listener: EventListener;
  }[] = [];
  private root: DirectoryDescriptor;
  // the key for the volumes map is actually the inode (aka "serial number") of
  // the underlying directory
  private volumes: Map<string, Volume> = new Map();

  constructor() {
    let volume = new DefaultDriver().mountVolumeSync(ROOT, this.dispatchEvent);
    this.root = volume.root;
    this.volumes.set(this.root.inode, volume);
  }

  addEventListener(origin: string, fn: EventListener) {
    let normalizedOrigin = new URL(origin).origin;
    if (this.listeners.has(normalizedOrigin)) {
      this.listeners.get(normalizedOrigin)!.push(fn);
    } else {
      this.listeners.set(normalizedOrigin, [fn]);
    }
  }

  removeEventListener(origin: string, fn: EventListener) {
    let normalizedOrigin = new URL(origin).origin;
    if (this.listeners.has(normalizedOrigin)) {
      this.listeners.set(normalizedOrigin, [
        ...this.listeners.get(normalizedOrigin)!.filter((l) => l !== fn),
      ]);
    }
  }

  removeAllEventListeners() {
    this.listeners = new Map();
  }

  async mount(url: URL, driver: FileSystemDriver): Promise<string> {
    let volume = await driver.mountVolume(url, this.dispatchEvent);
    let dir = await this._open(splitURL(url), {
      createMode: "directory",
      isNewMountPoint: true,
    });
    this.volumes.set(dir.inode, volume);
    dir.close();
    return dir.inode;
  }

  async unmount(volumeKey: string): Promise<void> {
    if (volumeKey === this.root.inode) {
      throw new Error("Cannot unmount the root volume");
    }
    let volume = this.volumes.get(volumeKey);
    if (volume) {
      let url = volume.root.url;
      this.volumes.delete(volumeKey);
      await this.remove(url);
    }
  }

  async move(sourceURL: URL, destURL: URL): Promise<void> {
    let source = await this.open(sourceURL);
    let destName = baseName(destURL);
    if (destName === "/") {
      destURL = new URL(dirName(destURL)!);
    }
    let name = baseName(destURL);
    let destParentDirName = dirName(destURL);
    let destParent = destParentDirName
      ? await this.openDir(new URL(destParentDirName), true)
      : this.root;
    if (source.type === "file") {
      let sourceName = baseName(sourceURL);
      let sourceParentDir = dirName(sourceURL);
      let sourceParent = await this.openDir(
        sourceParentDir ? new URL(sourceParentDir) : ROOT
      );
      await destParent.add(name, source, sourceParent, sourceName);
      if (sourceParent.inode !== destParent.inode) {
        sourceParent.close();
      }
    } else {
      await destParent.add(name, source);
    }
    await this.remove(sourceURL, false);
    source.close();
    destParent.close();
  }

  async copy(sourceURL: URL, destURL: URL): Promise<void> {
    if (sourceURL.href === destURL.href) {
      return; // nothing to do
    }
    let source = await this.open(sourceURL);

    if (source.type === "file") {
      let clone = await this.open(destURL, "file");
      await clone.write(await source.getReadbleStream());
      clone.close();
    } else {
      (await this.open(destURL, "directory")).close();
    }
    if (source.type === "directory") {
      for (let childName of [...(await source.children())]) {
        await this.copy(
          new URL(childName, assertURLEndsInDir(sourceURL)),
          new URL(childName, assertURLEndsInDir(destURL))
        );
      }
    }
    source.close();
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
        sourceDir = await this.openDir(new URL(dir));
      } catch (err) {
        if (err.code !== "NOT_FOUND") {
          throw err;
        }
        return; // just ignore files that dont exist
      }
      await sourceDir.remove(name);
      if (autoClose) {
        sourceDir.close();
      }
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
    let resource = await this.open(url);
    if (this.volumes.has(resource.inode)) {
      let volumeRoot = this.volumes.get(resource.inode)!.root;
      if (volumeRoot.type === "directory") {
        resource = volumeRoot;
      } else {
        resource.close();
        return [{ url: volumeRoot.url, stat: await volumeRoot.stat() }];
      }
    }
    if (!resource.volume.hasDirectoryAccess) {
      resource.close();
      return [];
    }
    if (resource.type === "file") {
      resource.close();
      return [{ url: resource.url, stat: await resource.stat() }];
    }

    let results: ListingEntry[] = [];
    if (startingURL.href === url.href && url.href !== ROOT.href) {
      results.push({
        url,
        stat: await resource.stat(),
      });
    }
    for (let name of [...(await resource.children())].sort()) {
      let item = (await resource.get(name))!;
      results.push({
        url: new URL(name, assertURLEndsInDir(url)),
        stat: await item.stat(),
      });
      if (item.type === "directory" && recurse) {
        results.push(
          ...(await this._list(
            new URL(name, assertURLEndsInDir(url)),
            true,
            startingURL
          ))
        );
      }
    }
    resource.close();
    return results;
  }

  async open(url: URL, createMode: "file"): Promise<FileDescriptor>;
  async open(url: URL, createMode: "directory"): Promise<DirectoryDescriptor>;
  async open(url: URL): Promise<DirectoryDescriptor | FileDescriptor>;
  async open(
    url: URL,
    createMode?: Options["createMode"]
  ): Promise<FileDescriptor | DirectoryDescriptor> {
    return await this._open(splitURL(url), { createMode });
  }

  private async openDir(
    url: URL,
    create = false
  ): Promise<DirectoryDescriptor> {
    if (url.href === ROOT.href) {
      return this.root;
    }

    let directory = await this._open(splitURL(url), {
      createMode: create ? "directory" : undefined,
      readMode: "directory",
    });
    if (directory.type === "file") {
      throw new FileSystemError(
        "IS_NOT_A_DIRECTORY",
        `'${url}' is not a directory (it's a file and we were expecting it to be a directory)`
      );
    }
    return directory;
  }

  private async _open(
    pathSegments: string[],
    opts: Options = {},
    parent?: DirectoryDescriptor,
    initialHref?: string
  ): Promise<FileDescriptor | DirectoryDescriptor> {
    if (!initialHref) {
      initialHref = pathSegments.join("/");
    }
    let name = pathSegments.shift()!;

    parent = parent || this.root;
    let descriptor: FileDescriptor | DirectoryDescriptor;
    let volume: Volume;

    if (name === ROOT.href.slice(0, -1) && pathSegments.length === 0) {
      return this.root;
    }

    if (this.volumes.has(parent.inode)) {
      // we have crossed a volume boundary, use the driver for this path and
      // the parent should be the root of the volume
      volume = this.volumes.get(parent.inode)!;
      if (volume.root.type === "directory") {
        parent = volume.root;
      } else {
        parent = await volume.createDirectory(parent, "");
      }
    } else {
      // we are still within the volume that we were within on the previous
      // pass, just use the driver associated with the parent
      volume = parent.volume;
    }

    if (
      // for volumes that dont have directory access, just consume the entire path
      // and only process leaf nodes
      (!volume.hasDirectoryAccess &&
        pathSegments.length > 0 &&
        !opts.isNewMountPoint) ||
      (volume.canCreateFiles && !(await parent.has(name)))
    ) {
      if (
        (!volume.hasDirectoryAccess && pathSegments.length > 0) ||
        (pathSegments.length && opts.createMode)
      ) {
        descriptor = await volume.createDirectory(parent, name);
        return await this._open(pathSegments, opts, descriptor, initialHref);
      } else if (volume.canCreateFiles && opts.createMode === "file") {
        descriptor = await volume.createFile(parent, name);
        return descriptor;
      } else if (volume.hasDirectoryAccess && opts.createMode === "directory") {
        descriptor = await volume.createDirectory(parent, name);
        return descriptor;
      } else {
        throw new FileSystemError(
          "NOT_FOUND",
          `'${initialHref}' does not exist`
        );
      }
    } else {
      if (opts.isNewMountPoint && !volume.hasDirectoryAccess) {
        descriptor = await volume.createDirectory(parent, name);
      } else {
        descriptor = (await parent.get(name))!;
      }

      // resource is a file
      if (
        descriptor.type === "file" &&
        pathSegments.length === 0 &&
        opts.createMode !== "directory"
      ) {
        return descriptor;
      } else if (
        descriptor.type === "file" &&
        pathSegments.length === 0 &&
        opts.createMode === "directory"
      ) {
        // we asked for a directory and got a file back
        throw new FileSystemError(
          "IS_NOT_A_DIRECTORY",
          `'${initialHref}' is not a directory (it's a file and we were expecting it to be a directory)`
        );
      } else if (descriptor.type === "file") {
        // there is unconsumed path left over...
        throw new FileSystemError(
          "NOT_FOUND",
          `'${initialHref}' does not exist`
        );
      }

      // resource is a directory
      if (pathSegments.length > 0) {
        return await this._open(pathSegments, opts, descriptor, initialHref);
      } else if (pathSegments.length === 0 && opts.createMode !== "file") {
        if (this.volumes.has(descriptor.inode)) {
          let childVolume = this.volumes.get(descriptor.inode)!;
          let root = childVolume.root;
          if (root.type === "file" && opts.readMode === "directory") {
            return await childVolume.createDirectory(parent, "");
          } else {
            return root;
          }
        }
        return descriptor;
      } else {
        // we asked for a file and got a directory back
        throw new FileSystemError(
          "IS_NOT_A_FILE",
          `'${initialHref}' is not a file (it's a directory and we were expecting it to be a file)`
        );
      }
    }
  }

  async tempURL(): Promise<URL> {
    let tempURL: URL;
    let tempOrigin = "http://tmp";
    while (true) {
      tempURL = new URL(
        `${tempOrigin}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`
      );

      try {
        (await this.open(tempURL)).close();
      } catch (err) {
        if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
          return tempURL;
        }
        throw err;
      }
    }
  }

  @bind
  private dispatchEvent(url: URL, type: EventType): void {
    if (url.href === ROOT.href) {
      return; // ignore this, it's an internal path (not an actual URL)
    }
    let listeners = this.listeners.get(url.origin);
    if (!listeners || listeners.length === 0) {
      return;
    }

    for (let listener of listeners) {
      this.eventQueue.push({
        type,
        url,
        listener,
      });
    }
    (async () => await this.drainEventQueue())();
  }

  private async drainEventQueue(): Promise<void> {
    await this.drainEvents;

    let eventsDrained: () => void;
    this.drainEvents = new Promise((res) => (eventsDrained = res));

    while (this.eventQueue.length > 0) {
      let event = this.eventQueue.shift();
      if (event) {
        let { url, type, listener } = event;
        let dispatched: () => void;
        let waitForDispatch = new Promise((res) => (dispatched = res));
        setTimeout(() => {
          listener({ url, type, kind: "filesystem-event" });
          dispatched();
        }, 0);
        await waitForDispatch;
      }
    }
    eventsDrained!();
  }

  eventsFlushed(): Promise<void> {
    return this.drainEvents ?? Promise.resolve();
  }

  async displayListing(): Promise<void> {
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
    log(columnify(listing));
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

interface ListingEntry {
  url: URL;
  stat: Stat;
}

interface Options {
  createMode?: "file" | "directory";
  readMode?: "file" | "directory";
  isNewMountPoint?: true;
}
export interface Event {
  kind: "filesystem-event";
  url: URL;
  type: EventType;
}
export type EventListener = (event: Event) => void;
export type EventType = "create" | "write" | "remove";
