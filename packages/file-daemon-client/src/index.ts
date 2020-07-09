import {
  Event,
  dispatchEvent as _dispatchEvent,
} from "../../builder-worker/src/event-bus";
import {
  FileSystem,
  eventGroup,
  FileSystemError,
  Event as FSEvent,
  BaseEvent as FSBaseEvent,
} from "../../builder-worker/src/filesystem";
import {
  FileSystemDriver,
  FileDescriptor,
  Volume,
  DirectoryDescriptor,
  readStream,
} from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import {
  MemoryVolume,
  MemoryFileDescriptor,
  MemoryDirectoryDescriptor,
} from "../../builder-worker/src/filesystem-drivers/memory-driver";
import { log, error } from "../../builder-worker/src/logger";
import { REGTYPE } from "tarstream/constants";
import { UnTar } from "tarstream";
import { WatchInfo, FileInfo } from "../../file-daemon/interfaces";
import { map } from "lodash";
import { assertURLEndsInDir } from "../../builder-worker/src/path";

export const defaultOrigin = "http://localhost:4200";
export const defaultWebsocketURL = "ws://localhost:3000";
export const entrypointsPath = "/entrypoints.json";

export const eventCategory = "file-daemon-client";
const utf8 = new TextDecoder("utf8");
const textEncoder = new TextEncoder();

class DirCache {
  children: Map<string, DirCache | FileCache> = new Map();
  constructor(readonly path: string) {}
}

class FileCache {
  constructor(
    readonly path: string,
    public data: Uint8Array = new Uint8Array(0)
  ) {}
}

function cacheInsert(start: DirCache, path: string, data: Uint8Array) {
  let cursor: DirCache = start;
  let dirs = path.split("/");
  let leaf = dirs.pop()!;
  for (let dir of dirs) {
    let nextCursor = cursor.children.get(dir);
    if (!nextCursor) {
      nextCursor = new DirCache(`${cursor.path}/${dir}/`);
      cursor.children.set(dir, nextCursor);
    }
    if (nextCursor instanceof FileCache) {
      throw new Error(`bug: tried to create directory over existing file`);
    }
    cursor = nextCursor;
  }
  cursor.children.set(leaf, new FileCache(path, data));
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

  private queue: WatchInfo[] = [];
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
      "ROOT",
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

  async close() {
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

  private tryConnect() {
    log(`attempting to connect`);

    let socket = new WebSocket(this.wsURL.href);
    let socketIsClosed: () => void;
    let socketClosed: Promise<void> = new Promise((r) => {
      socketIsClosed = r;
    });
    socket.onmessage = (event) => {
      let watchInfo = JSON.parse(event.data) as WatchInfo;
      this.queue.push(watchInfo);
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
      dispatchEvent({
        category: eventCategory,
        href: this.mountURL.href,
        type: "disconnected",
      });
    };
    socket.onopen = (event) => {
      log(`websocket open: ${JSON.stringify(event)}`);
      dispatchEvent({
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

  private async nextMessage(): Promise<{ info: WatchInfo } | { done: true }> {
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
    dispatchEvent({
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
    log("completed full sync");
    dispatchEvent({
      category: eventCategory,
      href: this.mountURL.href,
      type: "sync-finished",
      files: files.map((f) => this.mountedPath(f).href),
    });
    this.doneSyncing();
  }

  private async handleInfo(watchInfo: WatchInfo) {
    log(
      `handleMessage: Received file change notification ${JSON.stringify(
        watchInfo
      )}`
    );
    let changes = await this.pruneChanges(watchInfo.files);
    if (changes.length === 0) {
      log("no action for file update necessary");
      return;
    }
    let removals = changes.filter(({ etag }) => etag == null);
    let updates = changes.filter(({ etag }) => etag != null);
    let modified: string[] = [];

    for (let change of updates) {
      log(`updating ${change.name}`);
      modified.push((await this.updateFile(change.name)).href);
    }

    let removed: string[] = [];
    for (let { name } of removals) {
      log(`removing ${name}`);
      let url = this.mountedPath(name);
      await this.fs.remove(url);
      removed.push(url.href);
    }

    dispatchEvent({
      category: eventCategory,
      href: this.mountURL.href,
      type: "files-changed",
      removed,
      modified,
    });

    await this.fs.displayListing();
  }

  private async updateFile(path: string): Promise<URL> {
    let res = await fetch(`${this.httpURL}${path}`);
    let stream = res.body as ReadableStream<Uint8Array>;
    if (!stream) {
      throw new Error(`Couldn't fetch ${path} from file server`);
    }
    let url = this.mountedPath(path);
    let file = (await this.fs.open(url, true)) as FileDescriptor;
    await file.write(stream);
    file.close();
    return url;
  }

  private mountedPath(path: string): URL {
    return new URL(path, this.mountURL);
  }

  private async pruneChanges(changes: FileInfo[]): Promise<FileInfo[]> {
    let changed = await Promise.all(
      changes.map(async (change) => {
        let { name, etag } = change;
        let currentFile: FileDescriptor | undefined;
        try {
          currentFile = (await this.fs.open(
            new URL(name, this.httpURL)
          )) as FileDescriptor;
          if ((await currentFile.stat()).etag !== etag) {
            return change;
          }
        } catch (err) {
          if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
            return change;
          }
          throw err;
        } finally {
          if (currentFile) {
            currentFile.close();
          }
        }
        return false;
      })
    );
    return changed.filter(Boolean) as FileInfo[];
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
    public volume: Volume
  ) {
    this.url = assertURLEndsInDir(url);
  }

  stat(): Promise<Stat> {}
  close(): void {}
  get inode(): string {
    return this.dir.path;
  }

  getDirectory(name: string): Promise<DirectoryDescriptor | undefined> {}

  getFile(name: string): Promise<FileDescriptor | undefined> {}
  children(): Promise<string[]> {}

  async hasDirectory(name: string): Promise<boolean> {}

  async hasFile(name: string): Promise<boolean> {
    let entry = this.dir.children.get(name);
    return Boolean(entry && entry instanceof FileCache);
  }
  remove(name: string): Promise<void> {}

  add(
    name: string,
    resource: FileDescriptor | DirectoryDescriptor
  ): Promise<void> {}
}

class ClientFileDescriptor implements FileDescriptor {
  type = "file" as "file";

  constructor(
    public parent: DirCache,
    public name: string,
    private fileCache: FileCache,
    public url: URL,
    public volume: FileDaemonClientVolume
  ) {}

  stat(): Promise<Stat> {}
  close(): void {}
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
  }
  read(): Promise<Uint8Array> {}
  readText(): Promise<string> {}
  getReadbleStream(): Promise<ReadableStream> {}
}

function dispatchEvent(event: FileDaemonClientEvent) {
  _dispatchEvent<FileDaemonClientEvent | FSEvent>(eventGroup, event);
}

export type FileDaemonClientEvent =
  | ConnectedEvent
  | DisconnectedEvent
  | SyncStartedEvent
  | SyncCompleteEvent
  | FilesChangedEvent;

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

export interface FilesChangedEvent extends BaseEvent {
  type: "files-changed";
  modified: string[];
  removed: string[];
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
