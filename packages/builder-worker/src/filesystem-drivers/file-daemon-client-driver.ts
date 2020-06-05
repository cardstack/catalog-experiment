import { FileSystem, FileSystemError } from "../filesystem";
import {
  FileSystemDriver,
  FileDescriptor,
  DefaultVolume,
  DefaultFileDescriptor,
  DefaultDirectoryDescriptor,
} from "./filesystem-driver";
import { log, error } from "../logger";
import { REGTYPE } from "tarstream/constants";
//@ts-ignore
import { UnTar } from "tarstream";
import { WatchInfo, FileInfo } from "../../../file-daemon/interfaces";

export const defaultOrigin = "http://localhost:4200";
export const defaultWebsocketURL = "ws://localhost:3000";
export const entrypointsPath = "/entrypoints.json";

export const eventCategory = "file-daemon-client";

export class FileDaemonClientDirectoryDescriptor extends DefaultDirectoryDescriptor {}

export class FileDaemonClientFileDescriptor extends DefaultFileDescriptor {}

export class FileDaemonClientDriver implements FileSystemDriver {
  constructor(private fileServerURL: URL, private websocketServerURL: URL) {}

  async mountVolume(
    fs: FileSystem,
    id: string,
    url: URL,
    dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    let volume = new FileDaemonClientVolume(
      this.fileServerURL,
      this.websocketServerURL,
      fs,
      id,
      url,
      dispatchEvent
    );

    await volume.ready;

    return volume;
  }
}

export class FileDaemonClientVolume extends DefaultVolume {
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

  constructor(
    private fileServerURL: URL,
    private websocketServerURL: URL,
    private fs: FileSystem,
    id: string,
    private mountURL: URL,
    dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    super(id, mountURL, dispatchEvent);

    this.ready = new Promise((res) => (this.doneSyncing = res));
    this.running = this.run();
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

  private tryConnect() {
    log(`attempting to connect`);

    let socket = new WebSocket(this.websocketServerURL.href);
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
      this.dispatchEvent(eventCategory, this.mountURL, "disconnected");
    };
    socket.onopen = (event) => {
      log(`websocket open: ${JSON.stringify(event)}`);
      this.dispatchEvent(eventCategory, this.mountURL, "connected");
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
    this.dispatchEvent(eventCategory, this.mountURL, "sync-started");
    let stream = (
      await fetch(`${this.fileServerURL}/`, {
        headers: {
          accept: "application/x-tar",
        },
      })
    ).body as ReadableStream;

    let fs = this.fs;
    let temp = await fs.tempURL();
    let files: string[] = [];
    let untar = new UnTar(stream, {
      async file(entry) {
        if (entry.type === REGTYPE) {
          let file = (await fs.open(
            new URL(entry.name, temp),
            true
          )) as FileDescriptor;
          await file.write(entry.stream());
          file.close();
          files.push(entry.name);
        }
      },
    });
    await untar.done;
    await fs.move(temp, this.mountURL);
    await fs.remove(temp);
    log("completed full sync");
    this.dispatchEvent(eventCategory, this.mountURL, "sync-finished", {
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

    this.dispatchEvent(eventCategory, this.mountURL, "sync-finished", {
      removed,
      modified,
    });

    await this.fs.displayListing();
  }

  private async updateFile(path: string): Promise<URL> {
    let res = await fetch(`${this.fileServerURL}${path}`);
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
            new URL(name, this.fileServerURL)
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
