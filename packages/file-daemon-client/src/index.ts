import { Event, dispatchEvent } from "../../builder-worker/src/event-bus";
import {
  eventGroup,
  eventCategory as fsEventCategory,
  FSEvent,
  BaseEvent as FSBaseEvent,
} from "../../builder-worker/src/filesystem";
import {
  FileSystemDriver,
  FileDescriptor,
  Volume,
  DirectoryDescriptor,
  readStream,
  makeStream,
  Stat,
} from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import { log, error } from "../../builder-worker/src/logger";
import { REGTYPE } from "tarstream/constants";
import { UnTar } from "tarstream";
import { FileInfo } from "../../file-daemon/interfaces";
import { makeURLEndInDir } from "../../builder-worker/src/path";

export const defaultOrigin = "http://localhost:4200";
export const defaultWebsocketURL = "ws://localhost:3000";
export const entrypointsPath = "/entrypoints.json";

export const eventCategory = "file-daemon-client";
const utf8 = new TextDecoder("utf8");
const textEncoder = new TextEncoder();

class DirCache {
  children: Map<string, DirCache | FileCache> = new Map();
  constructor(readonly path: string, readonly mtime = Date.now()) {}
}

class FileCache {
  constructor(
    readonly path: string,
    public data: Uint8Array = new Uint8Array(0),
    readonly mtime = Date.now()
  ) {}
}

function cacheInsert(start: DirCache, path: string, data: Uint8Array) {
  let cursor: DirCache = start;
  let dirs = path.split("/");
  let leaf = dirs.pop()!;
  for (let dir of dirs) {
    dir += "/"; // the FileSystem convention is that directories always have a trailing slash in their name
    let nextCursor = cursor.children.get(dir);
    if (!nextCursor) {
      nextCursor = new DirCache(`${cursor.path}${dir}`);
      cursor.children.set(dir, nextCursor);
    }
    if (nextCursor instanceof FileCache) {
      throw new Error(`bug: tried to create directory over existing file`);
    }
    cursor = nextCursor;
  }
  cursor.children.set(leaf, new FileCache(`${cursor.path}${leaf}`, data));
}

function cacheRemove(start: DirCache, path: string) {
  let cursor: DirCache = start;
  let dirs = path.split("/");
  let nameToDelete = dirs.pop()!;
  for (let dir of dirs) {
    dir += "/"; // the FileSystem convention is that directories always have a trailing slash in their name
    let nextCursor = cursor.children.get(dir);
    if (!nextCursor) {
      // the path to delete doesn't actually exist, nothing to do
      return;
    }
    if (nextCursor instanceof FileCache) {
      throw new Error(
        `bug: tried to traverse a directory that was actually a file`
      );
    }
    cursor = nextCursor;
  }
  cursor.children.delete(nameToDelete);
}

export class FileDaemonClientDriver implements FileSystemDriver {
  constructor(private fileServerURL: URL, private websocketServerURL: URL) {}

  async mountVolume(url: URL) {
    let volume = new FileDaemonClientVolume(
      this.fileServerURL,
      this.websocketServerURL,
      url
    );

    await volume.ready;

    return volume;
  }
}

export class FileDaemonClientVolume implements Volume {
  ready: Promise<void>;
  connected = false;

  private closeRequested = false;
  private socket: WebSocket | undefined;
  private socketClosed: Promise<void> | undefined;
  private backoffInterval = 0;
  private doneSyncing!: () => void;

  private queue: FileInfo[] = [];
  private resolveQueuePromise: undefined | (() => void);
  private running: Promise<void>;

  private rootCache: DirCache = new DirCache("/");

  constructor(private httpURL: URL, private wsURL: URL, private mountURL: URL) {
    this.ready = new Promise((res) => (this.doneSyncing = res));
    this.running = this.run();
  }

  get root(): DirectoryDescriptor {
    return new ClientDirectoryDescriptor(
      undefined,
      this.rootCache,
      "/",
      this.mountURL,
      this
    );
  }

  async createDirectory(
    parent: ClientDirectoryDescriptor,
    name: string
  ): Promise<DirectoryDescriptor> {
    let self = new DirCache(`${parent.inode}${name}`);
    parent.dir.children.set(name, self);
    return new ClientDirectoryDescriptor(
      parent.dir,
      self,
      name,
      new URL(name, parent.url),
      this
    );
  }

  async createFile(
    parent: ClientDirectoryDescriptor,
    name: string
  ): Promise<FileDescriptor> {
    return new ClientFileDescriptor(
      parent.dir,
      name,
      new FileCache(`${parent.dir.path}${name}`),
      new URL(name, parent.url),
      this
    );
  }

  async willUnmount() {
    this.closeRequested = true;
    if (this.socket) {
      this.socket.close();
    }
    await this.socketClosed;
    await this.ready;
    await this.running;
    this.socket = undefined;
    log("file daemon client performed user-requested close");
  }

  private async run() {
    while (true && !this.closeRequested) {
      try {
        this.tryConnect();

        while (true) {
          let message = await this.nextMessage();
          if ("info" in message) {
            await this.handleInfo(message.info);
          } else {
            break;
          }
        }

        if (!this.closeRequested) {
          await this.backoff();
        }
      } catch (err) {
        error(`handled unexpected error in FileDaemonClient`, err);
        if (this.socket) {
          this.socket.close();
          this.socket = undefined;
        }
        await this.backoff();
      }
    }
  }

  async postFile(buffer: Uint8Array, path: string) {
    let response = await fetch(
      new URL(`/catalogjs/files${path}`, this.httpURL).href,
      {
        method: "POST",
        body: buffer,
      }
    );
    if (response.status !== 200) {
      throw new Error(`unable to write ${path} to ${this.httpURL.href}`);
    }
  }

  async getFile(path: string): Promise<Uint8Array> {
    let response = await fetch(
      new URL(`/catalogjs/files${path}`, this.httpURL).href
    );

    return new Uint8Array(await response.arrayBuffer());
  }

  async deleteFile(path: string): Promise<void> {
    await fetch(new URL(`/catalogjs/files${path}`, this.httpURL).href, {
      method: "DELETE",
    });
  }

  private tryConnect() {
    log(`attempting to connect to web socket ${this.wsURL.href}`);

    let socket = new WebSocket(this.wsURL.href);
    let socketIsClosed: () => void;
    let socketClosed: Promise<void> = new Promise((r) => {
      socketIsClosed = r;
    });
    socket.onmessage = (event) => {
      let info = JSON.parse(event.data) as FileInfo;
      this.queue.push(info);
      if (this.resolveQueuePromise) {
        this.resolveQueuePromise();
      }
    };
    socket.onerror = (event) => {
      log(`websocket error`, (event as unknown) as Error);
    };
    socket.onclose = (event: CloseEvent) => {
      log(`websocket close: ${JSON.stringify(event)}`);
      socketIsClosed();
      this.connected = false;
      dispatchClientEvent({
        category: eventCategory,
        href: this.mountURL.href,
        type: "disconnected",
      });
    };
    socket.onopen = (event) => {
      log(`websocket open: ${JSON.stringify(event)}`);
      dispatchClientEvent({
        category: eventCategory,
        href: this.mountURL.href,
        type: "connected",
      });
      this.backoffInterval = 0;
      this.connected = true;

      this.startFullSync().catch((err) => {
        error(`Error encountered running full sync`, err);
        throw err;
      });
    };
    this.socket = socket;
    this.socketClosed = socketClosed;
  }

  private async nextMessage(): Promise<{ info: FileInfo } | { done: true }> {
    let info = this.queue.shift();
    if (info) {
      return { info };
    }
    let queuePromise: Promise<"queuePushed"> = new Promise((resolve) => {
      this.resolveQueuePromise = () => resolve("queuePushed");
    });
    let result = await Promise.race([this.socketClosed, queuePromise]);
    this.resolveQueuePromise = undefined;
    if (result === "queuePushed") {
      info = this.queue.shift();
      if (info) {
        return { info };
      } else {
        throw new Error(
          `bug in file-daemon-client, queuePushed but we have no message to handle`
        );
      }
    } else {
      return { done: true };
    }
  }

  private async backoff() {
    log(`using backoff delay ${this.backoffInterval}`);
    await new Promise((resolve) => setTimeout(resolve, this.backoffInterval));
    this.backoffInterval = Math.min(
      Math.max(this.backoffInterval, 100) * 2,
      10000
    );
  }

  private async startFullSync() {
    dispatchClientEvent({
      category: eventCategory,
      href: this.mountURL.href,
      type: "sync-started",
    });
    let stream = (await fetch(`${this.httpURL}catalogjs/files`))
      .body as ReadableStream;

    let files: string[] = [];
    let root = new DirCache("/");
    let untar = new UnTar(stream, {
      async file(entry) {
        if (entry.type === REGTYPE) {
          cacheInsert(root, entry.name, await readStream(entry.stream()));
          files.push(entry.name);
        }
      },
    });
    await untar.done;
    this.rootCache = root;
    log(`completed full sync of ${this.mountURL.href}`);
    dispatchClientEvent({
      category: eventCategory,
      href: this.mountURL.href,
      type: "sync-finished",
      files: files.map((f) => this.mountedPath(f).href),
    });
    this.doneSyncing();
  }

  private async handleInfo(info: FileInfo) {
    log(
      `handleMessage: Received file change notification ${JSON.stringify(info)}`
    );

    let isDelete = info.etag === null;

    // TODO make sure we guard against trying to insert/delete based off of a
    // notification of our own add/remove. Right now we are letting the server
    // stomp on top of the client. A simple way to coordinate this could be that
    // we don't actually modify the cache until we get the WS notification here.
    // That might mean that we need to hang on to the original add/remove
    // Promise's resolve and perform that resolve here after recieving the WS
    // notification so that we block until we hear back from the web socket
    // notification that the server has updated accordingly...
    if (isDelete) {
      cacheRemove(this.rootCache, info.name);
      dispatchEvent<FSEvent>(eventGroup, {
        category: fsEventCategory,
        href: new URL(info.name, this.mountURL).href, // this URL works because we have left the leading slash off the name in notification message
        type: "remove",
      });
    } else {
      let buffer = await this.getFile(`/${info.name}`);
      cacheInsert(this.rootCache, info.name, buffer);
      dispatchEvent<FSEvent>(eventGroup, {
        category: fsEventCategory,
        href: new URL(info.name, this.mountURL).href, // this URL works because we have left the leading slash off the name in notification message
        type: "write",
      });
    }
  }

  private mountedPath(path: string): URL {
    return new URL(path, this.mountURL);
  }
}

class ClientDirectoryDescriptor implements DirectoryDescriptor {
  type = "directory" as "directory";
  url: URL;

  constructor(
    public parent: DirCache | undefined,
    public dir: DirCache,
    public name: string,
    url: URL,
    public volume: FileDaemonClientVolume
  ) {
    this.url = makeURLEndInDir(url);
  }

  async stat(): Promise<Stat> {
    return {
      mtime: this.dir.mtime,
      etag: undefined,
      type: "directory",
    };
  }

  async close() {}

  get inode(): string {
    return this.dir.path;
  }

  async getDirectory(name: string): Promise<DirectoryDescriptor | undefined> {
    let entry = this.dir.children.get(name);
    if (entry instanceof DirCache) {
      return new ClientDirectoryDescriptor(
        this.dir,
        entry,
        name,
        new URL(name, this.url),
        this.volume
      );
    }
    return undefined;
  }

  async getFile(name: string): Promise<FileDescriptor | undefined> {
    let entry = this.dir.children.get(name);
    if (entry instanceof FileCache) {
      return new ClientFileDescriptor(
        this.dir,
        name,
        entry,
        new URL(name, this.url),
        this.volume
      );
    }
    return undefined;
  }

  async children(): Promise<string[]> {
    return [...this.dir.children.keys()];
  }

  async hasDirectory(name: string): Promise<boolean> {
    let entry = this.dir.children.get(name);
    return Boolean(entry && entry instanceof DirCache);
  }

  async hasFile(name: string): Promise<boolean> {
    let entry = this.dir.children.get(name);
    return Boolean(entry && entry instanceof FileCache);
  }
  async remove(name: string): Promise<void> {
    this.dir.children.delete(name);
    await this.volume.deleteFile(`${this.dir.path}${name}`);

    // we can wait for the server round trip the change notification, and
    // trigger the FS write event when we recieve the WS message instead of
    // triggering it here which is generally done in the other drivers.
  }

  async add(name: string, descriptor: ClientFileDescriptor): Promise<void>;
  async add(name: string, descriptor: ClientDirectoryDescriptor): Promise<void>;
  async add(
    name: string,
    descriptor: ClientFileDescriptor | ClientDirectoryDescriptor
  ): Promise<void> {
    if (descriptor.type === "directory") {
      this.dir.children.set(name, descriptor.dir);
    } else {
      this.dir.children.set(name, descriptor.fileCache);
    }
  }
}

class ClientFileDescriptor implements FileDescriptor {
  type = "file" as "file";

  constructor(
    public parent: DirCache,
    public name: string,
    public fileCache: FileCache,
    public url: URL,
    public volume: FileDaemonClientVolume
  ) {}

  async stat(): Promise<Stat> {
    return {
      etag: `${this.fileCache.data.length}_${this.fileCache.mtime}`,
      mtime: this.fileCache.mtime,
      size: this.fileCache.data.length,
      type: "file",
    };
  }

  async close() {}

  get inode(): string {
    return this.fileCache.path;
  }
  async write(data: ReadableStream | Uint8Array | string): Promise<void> {
    let buffer: Uint8Array;
    if (data instanceof ReadableStream) {
      buffer = await readStream(data);
    } else if (typeof data === "string") {
      buffer = textEncoder.encode(data);
    } else {
      buffer = data;
    }
    await this.volume.postFile(buffer, this.inode);
    this.fileCache.data = buffer;
    this.parent.children.set(this.name, this.fileCache);

    // we can wait for the server round trip the change notification, and
    // trigger the FS write event when we recieve the WS message instead of
    // triggering it here which is generally done in the other drivers.
  }
  async read(): Promise<Uint8Array> {
    return this.fileCache.data;
  }
  async readText(): Promise<string> {
    return utf8.decode(this.fileCache.data);
  }
  async getReadbleStream(): Promise<ReadableStream> {
    return makeStream(this.fileCache.data);
  }
}

function dispatchClientEvent(event: FileDaemonClientEvent) {
  dispatchEvent<FileDaemonClientEvent | FSEvent>(eventGroup, event);
}

export type FileDaemonClientEvent =
  | ConnectedEvent
  | DisconnectedEvent
  | SyncStartedEvent
  | SyncCompleteEvent;

interface BaseEvent extends FSBaseEvent {
  category: "file-daemon-client";
}

export interface ConnectedEvent extends BaseEvent {
  type: "connected";
}
export interface DisconnectedEvent extends BaseEvent {
  type: "disconnected";
}
export interface SyncStartedEvent extends BaseEvent {
  type: "sync-started";
}

interface SyncCompleteEvent extends BaseEvent {
  type: "sync-finished";
  files: string[];
}

export function isFileDaemonEvent(
  event: any
): event is Event<FileDaemonClientEvent> {
  return (
    typeof event === "object" &&
    "group" in event &&
    event.group === eventGroup &&
    "args" in event &&
    "category" in event.args &&
    event.args.category === eventCategory
  );
}
