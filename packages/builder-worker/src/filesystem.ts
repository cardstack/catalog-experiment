import {
  join,
  splitPath,
  baseName,
  dirName,
  urlToPath,
  pathToURL,
} from "./path";
import columnify from "columnify";
import moment from "moment";
import { initial, isEqual } from "lodash";
import {
  FileSystemDriver,
  DefaultDriver,
  File,
  Directory,
  FileDescriptor,
  Stat,
} from "./filesystem-driver";

export { FileDescriptor };

export class FileSystem {
  private listeners: Map<string, EventListener[]> = new Map();
  private drainEvents?: Promise<void>;
  private eventQueue: {
    type: EventType;
    url: URL;
    listener: EventListener;
  }[] = [];

  private drivers: Map<string, FileSystemDriver> = new Map();

  constructor() {
    this.drivers.set("/", new DefaultDriver());
  }

  root(): Directory {
    return this.drivers.get("/")!.root;
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

  async mount(url: URL, driver: FileSystemDriver) {
    try {
      await this.open(url);
      throw new FileSystemError(
        "ALREADY_EXISTS",
        `Cannot mount volume at '${url.href}', this directory is already mounted.`
      );
    } catch (err) {
      if (err.code !== "NOT_FOUND") {
        throw err;
      }
    }
    this.drivers.set(urlToPath(url), driver);
    let parent = dirName(urlToPath(url)) ?? "/";
    // make sure that there is a directory we can mount our volume into
    await this._open(splitPath(parent), { createMode: "directory" });
    await driver.mounted;
  }

  // get the drivers that are mounted below the specified URL
  driversMountedIn(path: string): { url: URL; driver: FileSystemDriver }[];
  driversMountedIn(url: URL): { url: URL; driver: FileSystemDriver }[];
  driversMountedIn(
    urlOrPath: URL | string
  ): { url: URL; driver: FileSystemDriver }[] {
    let path;
    if (typeof urlOrPath === "string") {
      path = urlOrPath;
    } else {
      path = urlToPath(urlOrPath);
    }
    let parent = splitPath(path);
    return [...this.drivers]
      .filter(([path]) => isEqual(parent, initial(splitPath(path))))
      .map(([path, driver]) => ({ url: pathToURL(path), driver }));
  }

  async move(sourceURL: URL, destURL: URL): Promise<void> {
    let sourcePath = urlToPath(sourceURL);
    let destPath = urlToPath(destURL);
    let source = await this.openFileOrDir(sourcePath);
    let destParentDirName = dirName(destPath);
    let destParent = destParentDirName
      ? await this.openDir(destParentDirName, true)
      : this.root();
    let name = baseName(destPath);
    destParent.add(name, source);
    this.dispatchEvent(destURL, "create");
    await this.remove(sourceURL);
  }

  async copy(sourceURL: URL, destURL: URL): Promise<void> {
    if (sourceURL.href === destURL.href) {
      return; // nothing to do
    }
    let sourcePath = urlToPath(sourceURL);
    let destPath = urlToPath(destURL);
    let source = await this.openFileOrDir(sourcePath);
    let destParentDirName = dirName(destPath);
    let destParent = destParentDirName
      ? await this.openDir(destParentDirName, true)
      : this.root();
    let destDriver = destParent.driver;

    let name = baseName(destPath);
    if (source.type === "file") {
      source.clone(destDriver, destParent, name);
    } else {
      destDriver.createDirectory(destParent, name);
    }
    this.dispatchEvent(destURL, "create");
    if (source.type === "directory") {
      for (let childName of [...source.children()]) {
        await this.copy(
          pathToURL(join(sourcePath, childName)),
          pathToURL(destPath ? join(destPath, childName) : name)
        );
      }
    }
  }

  async remove(url: URL): Promise<void> {
    await this._remove(urlToPath(url));
  }

  private async _remove(path: string): Promise<void> {
    let name = baseName(path);
    let dir = dirName(path);
    if (!dir) {
      // should we have a special event for clearing the entire file system?
      // this only happens in tests...
      this.root().remove(name);
    } else {
      let sourceDir: Directory;
      try {
        sourceDir = await this.openDir(dir);
      } catch (err) {
        if (err.code !== "NOT_FOUND") {
          throw err;
        }
        return; // just ignore files that dont exist
      }
      sourceDir.remove(name);
      this.dispatchEvent(path, "remove");
    }
  }

  async list(url: URL, recurse = false): Promise<ListingEntry[]> {
    return await this._list(urlToPath(url), recurse);
  }

  async listAllOrigins(recurse = false): Promise<ListingEntry[]> {
    return await this._list("/", recurse);
  }

  private async _list(
    path: string,
    recurse = false,
    startingPath?: string
  ): Promise<ListingEntry[]> {
    if (!startingPath) {
      startingPath = path;
    }
    let directory = await this.openDir(path);
    let results: ListingEntry[] = [];
    if (startingPath === path && path !== "/") {
      results.push({
        url: pathToURL(path),
        stat: directory.stat(),
      });
    }
    for (let name of [...directory.children()].sort()) {
      let item = directory.get(name)!;
      results.push({
        url: pathToURL(join(path, name)),
        stat: item.stat(),
      });
      if (item.type === "directory" && recurse) {
        results.push(
          ...(await this._list(join(path, name), true, startingPath))
        );
      }
    }
    let childVolumes = this.driversMountedIn(path).map((i) => ({
      url: i.url,
      dir: i.driver.root,
    }));
    for (let { url, dir } of childVolumes) {
      results.push({
        url,
        stat: dir.stat(),
      });
      if (recurse) {
        results.push(...(await this._list(urlToPath(url), true, startingPath)));
      }
    }
    return results;
  }

  async open(
    url: URL,
    createMode?: Options["createMode"]
  ): Promise<FileDescriptor> {
    let path = urlToPath(url);
    return (await this._open(splitPath(path), { createMode })).getDescriptor(
      url,
      this.dispatchEvent.bind(this)
    );
  }

  private async openDir(path: string, create = false): Promise<Directory> {
    let directory = await this._open(splitPath(path), {
      createMode: create ? "directory" : undefined,
    });
    if (directory.type === "file") {
      throw new FileSystemError(
        "IS_NOT_A_DIRECTORY",
        `'${pathToURL(
          path
        )}' is not a directory (it's a file and we were expecting it to be a directory)`
      );
    }
    return directory;
  }

  private async openFileOrDir(path: string): Promise<File | Directory> {
    return await this._open(splitPath(path));
  }

  private async _open(
    pathSegments: string[],
    opts: Options = {},
    parent?: Directory,
    initialPath?: string
  ): Promise<File | Directory> {
    if (!initialPath) {
      initialPath = join(...pathSegments);
    }
    let name = pathSegments.shift()!;

    parent = parent || this.root();
    let resource: File | Directory;
    let initialPathSegments = splitPath(initialPath);
    let driverPath = join(
      ...initialPathSegments.slice(
        0,
        initialPathSegments.length - pathSegments.length
      )
    );
    let driver: FileSystemDriver;
    let volume: Directory | undefined;
    if (this.drivers.has(driverPath)) {
      // we have crossed a volume boundary, use the driver for this path and
      // the parent should be the root of the volume
      if (pathSegments.length === 0 && opts.createMode === "file") {
        throw new FileSystemError(
          "IS_NOT_A_DIRECTORY",
          `'${pathToURL(
            initialPath
          )}' is not a directory (it's a file and we were expecting it to be a directory)`
        );
      }
      driver = this.drivers.get(driverPath)!;
      volume = driver.root;
    } else {
      // we are still within the volume that we were within on the previous
      // pass, just use the driver associated with the parent
      driver = parent.driver;
    }

    if (!parent.has(name) && !volume) {
      if (pathSegments.length > 0 && opts.createMode) {
        resource = driver.createDirectory(parent, name);
        // dont fire events for the interior dirs--it's really a pain keeping
        // track of the interior dir path, and honestly the leaf node create
        // events are probably more important
        return await this._open(pathSegments, opts, resource, initialPath);
      } else if (opts.createMode === "file") {
        resource = driver.createFile(parent, name);
        this.dispatchEvent(initialPath, "create");
        return resource;
      } else if (opts.createMode === "directory") {
        resource = driver.createDirectory(parent, name);
        this.dispatchEvent(initialPath, "create");
        return resource;
      } else {
        throw new FileSystemError(
          "NOT_FOUND",
          `'${pathToURL(initialPath)}' does not exist`
        );
      }
    } else {
      resource = volume ?? parent.get(name)!;

      // resource is a file
      if (
        resource.type === "file" &&
        pathSegments.length === 0 &&
        opts.createMode !== "directory"
      ) {
        return resource;
      } else if (
        resource.type === "file" &&
        pathSegments.length === 0 &&
        opts.createMode === "directory"
      ) {
        // we asked for a directory and got a file back
        throw new FileSystemError(
          "IS_NOT_A_DIRECTORY",
          `'${pathToURL(
            initialPath
          )}' is not a directory (it's a file and we were expecting it to be a directory)`
        );
      } else if (resource.type === "file") {
        // there is unconsumed path left over...
        throw new FileSystemError(
          "NOT_FOUND",
          `'${pathToURL(initialPath)}' does not exist`
        );
      }

      // resource is a directory
      if (pathSegments.length > 0) {
        return await this._open(pathSegments, opts, resource, initialPath);
      } else if (pathSegments.length === 0 && opts.createMode !== "file") {
        return resource;
      } else {
        // we asked for a file and got a directory back
        throw new FileSystemError(
          "IS_NOT_A_FILE",
          `'${pathToURL(
            initialPath
          )}' is not a file (it's a directory and we were expecting it to be a file)`
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
        await this.open(tempURL);
      } catch (err) {
        if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
          return tempURL;
        }
        throw err;
      }
    }
  }

  private dispatchEvent(url: URL, type: EventType): void;
  private dispatchEvent(path: string, type: EventType): void;
  private dispatchEvent(urlOrPath: URL | string, type: EventType): void {
    let url: URL;
    if (typeof urlOrPath === "string") {
      if (urlOrPath === "/") {
        return; // ignore this, it's an internal path (not an actual URL)
      }

      url = pathToURL(urlOrPath);
    } else {
      url = urlOrPath;
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
          listener({ url, type });
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
    console.log(columnify(listing));
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
}
export interface Event {
  url: URL;
  type: EventType;
}
export type EventListener = (event: Event) => void;
export type EventType = "create" | "write" | "remove";
