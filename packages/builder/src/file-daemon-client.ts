import invert from "lodash/invert";
import { WatchInfo, FileInfo } from "../../file-daemon/interfaces";
import { FileSystem, FileSystemError, FileDescriptor } from "./filesystem";
import { join, baseName, dirName } from "./path";
import { REGTYPE } from "tarstream/constants";
import { EntrypointsMapping } from "./builder";
//@ts-ignore
import { UnTar } from "tarstream";

export const defaultOrigin = "http://localhost:4200";
export const defaultWebsocketURL = "ws://localhost:3000";
const entrypointsPath = "/entrypoints.json";

export class FileDaemonClient {
  ready: Promise<void>;

  private socket: WebSocket | undefined;
  private socketClosed: Promise<void> | undefined;
  private backoffInterval = 0;
  private doneSyncing!: () => void;

  private queue: WatchInfo[] = [];
  private resolveQueuePromise: undefined | (() => void);

  constructor(
    private fileServerURL: string,
    private websocketServerURL: string,
    private fs: FileSystem,
    private mountPath: string
  ) {
    this.ready = new Promise((res) => (this.doneSyncing = res));
    this.run();
  }

  private async run() {
    while (true) {
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

        await this.backoff();
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
    let socket = new WebSocket(this.websocketServerURL);
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
    };
    socket.onopen = (event) => {
      console.log(`websocket open`, event);
      this.backoffInterval = 0;

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
    let untar = new UnTar(stream, {
      async file(entry) {
        if (entry.type === REGTYPE) {
          let file = await fs.open(
            new URL(mountedPath(entry.name), temp),
            "file"
          );
          file.setEtag(`${entry.size}_${entry.modifyTime}`);
          await file.write(entry.stream());
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
    // make sure to first check and see if the entrypoint file itself is
    // changing, in which case we should deal with that first.
    if (updates.find((f) => f.name === entrypointsPath)) {
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
      console.log(`updating ${change.name}`);
      let pathOverride: string | undefined;
      if (invertedEntrypointsMapping[change.name]) {
        pathOverride = invertedEntrypointsMapping[change.name];
        console.log(`updating ${change.name} (writing to ${pathOverride})`);
      } else {
        console.log(`updating ${change.name}`);
      }
      await this.updateFile(change.name, change.etag!, pathOverride);
    }

    for (let { name } of removals) {
      console.log(`removing ${name}`);
      await this.fs.remove(new URL(this.mountedPath(name), this.fileServerURL));
    }

    console.log(`completed processing changes, file system:`);
    await this.fs.displayListing();
  }

  private async getEntrypointsAsMappings(
    thisOrigin = new URL(this.fileServerURL)
  ): Promise<EntrypointsMapping | undefined> {
    let entrypoints = await this._getEntrypointsObject(thisOrigin);
    if (entrypoints) {
      return entrypoints as EntrypointsMapping;
    }
  }

  private async getEntrypointsAsDestPaths(
    thisOrigin = new URL(this.fileServerURL)
  ): Promise<string[] | undefined> {
    let entrypoints = await this._getEntrypointsObject(thisOrigin);
    if (entrypoints) {
      return entrypoints as string[];
    }
  }

  private async _getEntrypointsObject(
    thisOrigin = new URL(this.fileServerURL)
  ): Promise<EntrypointsMapping | string[] | undefined> {
    let entrypointsFile: FileDescriptor;
    try {
      entrypointsFile = await this.fs.open(
        new URL(this.mountedPath(entrypointsPath), thisOrigin)
      );
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        return; // in this case there is no build to perform
      }
      throw err;
    }

    return JSON.parse(await entrypointsFile.readText()) as
      | string[]
      | EntrypointsMapping;
  }

  private async generateEntrypointsMappingFile(
    originalEntrypoints: string[],
    thisOrigin = new URL(this.fileServerURL)
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
    entrypointsFile.setEtag(
      `${entrypointsFile.stat.size}_${entrypointsFile.stat.mtime}`
    );
    return entrypoints;
  }

  private async updateFile(path: string, etag: string, pathOverride?: string) {
    let stream = (await fetch(`${this.fileServerURL}${path}`))
      .body as ReadableStream<Uint8Array>;
    if (!stream) {
      throw new Error(`Couldn't fetch ${path} from file server`);
    }
    let file = await this.fs.open(
      new URL(this.mountedPath(pathOverride ?? path), this.fileServerURL),
      "file"
    );
    file.setEtag(etag);
    await file.write(stream);
  }

  private mountedPath(path: string): string {
    return join(this.mountPath, path);
  }

  private async pruneChanges(changes: FileInfo[]): Promise<FileInfo[]> {
    let changed = await Promise.all(
      changes.map(async (change) => {
        let { name, etag } = change;
        let currentFile: FileDescriptor;
        try {
          currentFile = await this.fs.open(new URL(name, this.fileServerURL));
        } catch (err) {
          if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
            return change;
          }
          throw err;
        }
        if (currentFile.stat.etag !== etag) {
          return change;
        }
        return false;
      })
    );
    return changed.filter(Boolean) as FileInfo[];
  }
}
