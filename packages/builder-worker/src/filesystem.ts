import bind from "bind-decorator";
import { splitURL, baseName, dirName, ROOT } from "./path";
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
    let volume = new DefaultDriver().mountVolumeSync(
      undefined,
      ROOT,
      this.dispatchEvent
    );
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

  async mount(url: URL, driver: FileSystemDriver): Promise<Volume> {
    if (url.href.slice(-1) !== "/") {
      throw new FileSystemError(
        "IS_NOT_A_DIRECTORY",
        `'${url}' is not a directory (it's a file and we were expecting it to be a directory)`
      );
    }
    let dir = await this.open(url, true);
    let volume = await driver.mountVolume(
      this,
      dir.inode,
      url,
      this.dispatchEvent
    );
    this.volumes.set(volume.id, volume);
    dir.close();

    return volume;
  }

  async unmount(volumeId: string): Promise<void> {
    if (volumeId === this.root.inode) {
      throw new Error("Cannot unmount the root volume");
    }
    let volume = this.volumes.get(volumeId);
    if (volume) {
      let url = volume.root.url;
      this.volumes.delete(volumeId);
      await this.remove(url);
    }
  }

  async move(sourceURL: URL, destURL: URL): Promise<void> {
    let source = await this.open(sourceURL);
    let name = baseName(destURL);
    let destParentDirName = dirName(destURL);
    let destParent = (destParentDirName
      ? await this.open(new URL(destParentDirName), true)
      : this.root) as DirectoryDescriptor;
    if (source.type === "file") {
      let sourceName = baseName(sourceURL);
      let sourceParentDir = dirName(sourceURL);
      let sourceParent = (await this.open(
        sourceParentDir ? new URL(sourceParentDir) : ROOT
      )) as DirectoryDescriptor;
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
      let clone = (await this.open(destURL, true)) as FileDescriptor;
      await clone.write(await source.getReadbleStream());
      clone.close();
    } else {
      (await this.open(destURL, true)).close();
    }
    if (source.type === "directory") {
      for (let childName of [...(await source.children())]) {
        await this.copy(
          new URL(childName, sourceURL),
          new URL(childName, destURL)
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
        sourceDir = (await this.open(new URL(dir))) as DirectoryDescriptor;
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
      this.dispatchEvent(url, "remove");
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
      if (await resource.hasFile(name)) {
        results.push({
          url: new URL(name, url),
          stat: await (await resource.getFile(name))!.stat(),
        });
      } else if (await resource.hasDirectory(name)) {
        results.push({
          url: new URL(name, url),
          stat: await (await resource.getDirectory(name))!.stat(),
        });
        if (recurse) {
          results.push(
            ...(await this._list(new URL(name, url), true, startingURL))
          );
        }
      }
    }
    resource.close();
    return results;
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
    let volume: Volume;

    if (name === ROOT.href && pathSegments.length === 0) {
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
      pathSegments.length > 0 &&
      !(await parent.hasDirectory(name)) &&
      opts.create
    ) {
      // create interior directories and descend
      descriptor = await volume.createDirectory(parent, name);
      this.dispatchEvent(descriptor.url, "create");
      return await this._open(pathSegments, opts, descriptor, initialHref);
    } else if (pathSegments.length > 0 && (await parent.hasDirectory(name))) {
      // descend into existing directory
      descriptor = (await parent.getDirectory(name))!;
      return await this._open(pathSegments, opts, descriptor, initialHref);
    } else if (
      pathSegments.length === 0 &&
      !isDir &&
      !(await parent.hasFile(name))
    ) {
      if (opts.create) {
        descriptor = await volume.createFile(parent, name);
        this.dispatchEvent(descriptor.url, "create");
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
        this.dispatchEvent(descriptor.url, "create");
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
      if (this.volumes.has(descriptor.inode)) {
        return this.volumes.get(descriptor.inode)!.root;
      }
      return descriptor;
    } else {
      notFound(initialHref);
    }
    throw new Error("bug: should never get here");
  }

  async tempURL(): Promise<URL> {
    let tempURL: URL;
    let tempOrigin = "https://tmp";
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
  create?: true;
}
export interface Event {
  kind: "filesystem-event";
  url: URL;
  type: EventType;
}
export type EventListener = (event: Event) => void;
export type EventType = "create" | "write" | "remove";

function notFound(href: string) {
  throw new FileSystemError("NOT_FOUND", `'${href}' does not exist`);
}
