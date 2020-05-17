import invert from "lodash/invert";
import difference from "lodash/difference";
import { WatchInfo, FileInfo } from "../../file-daemon/interfaces";
import { FileSystem, FileSystemError } from "./filesystem";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";
import { join, baseName, dirName } from "./path";
import { REGTYPE } from "tarstream/constants";
import { EntrypointsMapping } from "./nodes/html";
//@ts-ignore
import { UnTar } from "tarstream";

export const defaultOrigin = "http://localhost:4200";
export const defaultWebsocketURL = "ws://localhost:3000";
export const entrypointsPath = "/entrypoints.json";

export interface ConnectedEvent {
  type: "connected";
}
export interface DisconnectedEvent {
  type: "disconnected";
}
export interface SyncStartedEvent {
  type: "sync-started";
}
export interface SyncFinishedEvent {
  type: "sync-finished";
  files: string[];
}

export interface FilesChangedEvent {
  type: "files-changed";
  modified: string[];
  removed: string[];
}

export type Event =
  | ConnectedEvent
  | DisconnectedEvent
  | SyncStartedEvent
  | SyncFinishedEvent
  | FilesChangedEvent;
export type EventListener = (event: Event) => void;

export class FileDaemonClient {
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
  private listeners: Set<EventListener> = new Set();
  private drainEvents?: Promise<void>;
  private eventQueue: {
    event: Event;
    listener: EventListener;
  }[] = [];

  constructor(
    private fileServerURL: URL,
    private websocketServerURL: URL,
    private fs: FileSystem,
    private mountPath: string
  ) {
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
    console.log("file daemon client performed user-requested close");
  }

  addEventListener(fn: EventListener) {
    this.listeners.add(fn);
  }

  removeEventListener(fn: EventListener) {
    this.listeners.delete(fn);
  }

  removeAllEventListeners() {
    this.listeners.clear();
  }

  eventsFlushed(): Promise<void> {
    return this.drainEvents ?? Promise.resolve();
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
        console.error(`handled unexpected error in FileDaemonClient`, err);
        if (this.socket) {
          this.socket.close();
          this.socket = undefined;
        }
        await this.backoff();
      }
    }
  }

  private tryConnect() {
    console.log(`attempting to connect`);

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
      console.log(`websocket error`, event);
    };
    socket.onclose = (event: CloseEvent) => {
      console.log(`websocket close`, event);
      socketIsClosed();
      this.connected = false;
      this.dispatchEvent({ type: "disconnected" });
    };
    socket.onopen = (event) => {
      console.log(`websocket open`, event);
      this.dispatchEvent({ type: "connected" });
      this.backoffInterval = 0;
      this.connected = true;

      this.startFullSync().catch((err) => {
        console.error(`Error encountered running full sync`, err);
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
    console.log(`using backoff delay ${this.backoffInterval}`);
    await new Promise((resolve) => setTimeout(resolve, this.backoffInterval));
    this.backoffInterval = Math.min(
      Math.max(this.backoffInterval, 100) * 2,
      10000
    );
  }

  private async startFullSync() {
    this.dispatchEvent({ type: "sync-started" });
    let stream = (
      await fetch(`${this.fileServerURL}/`, {
        headers: {
          accept: "application/x-tar",
        },
      })
    ).body as ReadableStream;

    let mountedPath = this.mountedPath.bind(this);
    let fs = this.fs;
    let temp = await fs.tempURL();
    let files: string[] = [];
    let untar = new UnTar(stream, {
      async file(entry) {
        if (entry.type === REGTYPE) {
          let file = await fs.open(
            new URL(mountedPath(entry.name), temp),
            "file"
          );
          await file.write(entry.stream());
          file.close();
          files.push(entry.name);
        }
      },
    });
    await untar.done;
    await this.renameEntrypoints(temp);
    await fs.move(
      new URL(this.mountPath, temp),
      new URL(this.mountPath, this.fileServerURL)
    );
    await fs.remove(temp);
    console.log("completed full sync");
    this.dispatchEvent({
      type: "sync-finished",
      files: files.map(
        (f) => new URL(this.mountedPath(f), this.fileServerURL).href
      ),
    });
    this.doneSyncing();
  }

  // Only used for fullsync when we are writing in a temp origin
  private async renameEntrypoints(tempOrigin: URL) {
    let originalEntrypoints = await this.getEntrypointsAsDestPaths(tempOrigin);
    if (!originalEntrypoints) {
      return;
    }

    for (let entrypoint of originalEntrypoints) {
      let sourceURL = new URL(this.mountedPath(entrypoint), tempOrigin);
      let destPath = join(
        dirName(sourceURL.pathname) || "/",
        `src-${baseName(sourceURL.pathname)}`
      );
      await this.fs.move(sourceURL, new URL(destPath, tempOrigin));
    }
    await this.generateEntrypointsMappingFile(originalEntrypoints, tempOrigin);
  }

  private async handleInfo(watchInfo: WatchInfo) {
    console.log("handleMessage: Received file change notification", watchInfo);
    let changes = await this.pruneChanges(watchInfo.files);
    if (changes.length === 0) {
      console.log("no action for file update necessary");
      return;
    }
    let removals = changes.filter(({ etag }) => etag == null);
    let updates = changes.filter(({ etag }) => etag != null);

    let entrypointsMapping: EntrypointsMapping | undefined;
    let entrypointsChanged = false;
    let previousEntrypoints: EntrypointsMapping | undefined;
    let file: FileDescriptor | undefined;
    try {
      file = (await this.fs.open(
        new URL(entrypointsPath, this.fileServerURL)
      )) as FileDescriptor;
      previousEntrypoints = JSON.parse(
        await file.readText()
      ) as EntrypointsMapping;
    } catch (err) {
      if (err.code !== "NOT_FOUND") {
        throw err;
      }
    } finally {
      if (file) {
        file.close();
      }
    }

    let modified: string[] = [];
    // make sure to first check and see if the entrypoint file itself is
    // changing, in which case we should deal with that first.
    if (updates.find((f) => f.name === entrypointsPath)) {
      entrypointsChanged = true;
      modified.push(
        new URL(this.mountedPath(entrypointsPath), this.fileServerURL).href
      );
      let destEntrypoints = (await (
        await fetch(`${this.fileServerURL}${entrypointsPath}`)
      ).json()) as string[];
      entrypointsMapping = await this.generateEntrypointsMappingFile(
        destEntrypoints
      );
      updates = updates.filter((f) => f.name !== entrypointsPath);
    }

    if (!entrypointsMapping) {
      entrypointsMapping = removals.find((f) => f.name === entrypointsPath)
        ? {}
        : (await this.getEntrypointsAsMappings()) ?? {};
    }
    let invertedEntrypointsMapping = invert(entrypointsMapping);

    for (let change of updates) {
      let pathOverride: string | undefined;
      if (invertedEntrypointsMapping[change.name]) {
        pathOverride = invertedEntrypointsMapping[change.name];
        console.log(`updating ${change.name} (writing to ${pathOverride})`);
      } else {
        console.log(`updating ${change.name}`);
      }
      modified.push((await this.updateFile(change.name, pathOverride)).href);
    }

    if (entrypointsChanged) {
      for (let [destPath, sourcePath] of Object.entries(
        invertedEntrypointsMapping
      )) {
        console.log(`updating ${destPath} (writing to ${sourcePath})`);
        modified.push((await this.updateFile(destPath, sourcePath)).href);
      }
      for (let removedSrcPath of difference(
        Object.keys(previousEntrypoints || []),
        Object.keys(entrypointsMapping)
      )) {
        await this.fs.remove(new URL(removedSrcPath, this.fileServerURL));
        modified.push(
          (await this.updateFile(previousEntrypoints![removedSrcPath])).href
        );
        console.log(`updating ${previousEntrypoints![removedSrcPath]}`);
      }
    }

    let removed: string[] = [];
    for (let { name } of removals) {
      console.log(`removing ${name}`);
      let url = new URL(this.mountedPath(name), this.fileServerURL);
      await this.fs.remove(url);
      removed.push(url.href);
    }

    this.dispatchEvent({ type: "files-changed", removed, modified });

    console.log(`completed processing changes, file system:`);
    await this.fs.displayListing();
  }

  private async getEntrypointsAsMappings(
    thisOrigin = this.fileServerURL
  ): Promise<EntrypointsMapping | undefined> {
    let entrypoints = await this._getEntrypointsObject(thisOrigin);
    if (entrypoints) {
      return entrypoints as EntrypointsMapping;
    }
  }

  private async getEntrypointsAsDestPaths(
    thisOrigin = this.fileServerURL
  ): Promise<string[] | undefined> {
    let entrypoints = await this._getEntrypointsObject(thisOrigin);
    if (entrypoints) {
      return entrypoints as string[];
    }
  }

  private async _getEntrypointsObject(
    thisOrigin = this.fileServerURL
  ): Promise<EntrypointsMapping | string[] | undefined> {
    let entrypointsFile: FileDescriptor | undefined;
    try {
      entrypointsFile = (await this.fs.open(
        new URL(this.mountedPath(entrypointsPath), thisOrigin)
      )) as FileDescriptor;

      return JSON.parse(await entrypointsFile.readText()) as
        | string[]
        | EntrypointsMapping;
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        return; // in this case there is no build to perform
      }
      throw err;
    } finally {
      if (entrypointsFile) {
        entrypointsFile.close();
      }
    }
  }

  private async generateEntrypointsMappingFile(
    originalEntrypoints: string[],
    thisOrigin = this.fileServerURL
  ): Promise<EntrypointsMapping> {
    let entrypoints: { [srcFile: string]: string } = {};
    for (let destPath of originalEntrypoints) {
      let srcPath = join(dirName(destPath) || "/", `src-${baseName(destPath)}`);
      entrypoints[srcPath] = join(destPath);
    }
    let entrypointsFile = await this.fs.open(
      new URL(this.mountedPath(entrypointsPath), thisOrigin),
      "file"
    );
    await entrypointsFile.write(JSON.stringify(entrypoints));
    return entrypoints;
  }

  private async updateFile(path: string, pathOverride?: string): Promise<URL> {
    let res = await fetch(`${this.fileServerURL}${path}`);
    let stream = res.body as ReadableStream<Uint8Array>;
    if (!stream) {
      throw new Error(`Couldn't fetch ${path} from file server`);
    }
    let url = new URL(
      this.mountedPath(pathOverride ?? path),
      this.fileServerURL
    );
    let file = await this.fs.open(url, "file");
    await file.write(stream);
    file.close();
    return url;
  }

  private mountedPath(path: string): string {
    return join(this.mountPath, path);
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

  private dispatchEvent(event: Event): void {
    if (this.listeners.size === 0) {
      return;
    }

    for (let listener of this.listeners) {
      this.eventQueue.push({ event, listener });
    }
    (async () => await this.drainEventQueue())();
  }

  private async drainEventQueue(): Promise<void> {
    await this.drainEvents;

    let eventsDrained: () => void;
    this.drainEvents = new Promise((res) => (eventsDrained = res));

    while (this.eventQueue.length > 0) {
      let eventArgs = this.eventQueue.shift();
      if (eventArgs) {
        let { event, listener } = eventArgs;
        let dispatched: () => void;
        let waitForDispatch = new Promise((res) => (dispatched = res));
        setTimeout(() => {
          listener(event);
          dispatched();
        }, 0);
        await waitForDispatch;
      }
    }
    eventsDrained!();
  }
}
