import { WatchInfo, FileInfo } from "../../file-daemon/interfaces";
import { FileSystem, FileSystemError, FileDescriptor } from "./filesystem";
import { join, baseName, dirName } from "./path";
import { REGTYPE } from "tarstream/constants";
//@ts-ignore
import { UnTar } from "tarstream";

export const origin = "http://localhost:4200";
const entrypointsPath = "/.entrypoints.json";

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
      new URL(this.mountPath, origin)
    );
    await fs.remove(temp);
    console.log("completed full sync");
    this.doneSyncing();
  }

  // Only used for fullsync when we are writing in a temp origin
  private async renameEntrypoints(tempOrigin: URL) {
    let originalEntrypoints = await this.getEntrypoints(tempOrigin);
    if (!originalEntrypoints) {
      return;
    }

    for (let entrypoint of originalEntrypoints) {
      let sourceURL = new URL(entrypoint, tempOrigin);
      let destPath = join(
        dirName(sourceURL.pathname) || "/",
        `src-${baseName(sourceURL.pathname)}`
      );
      await this.fs.move(sourceURL, new URL(destPath, tempOrigin));
    }
    await this.setEntrypointsFile(originalEntrypoints, tempOrigin);
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

    let entrypoints: string[] | undefined;
    // make sure to first check and see if the entrypoint file itself is
    // changing, in which case we should deal with that first.
    if (updates.find((f) => f.name === entrypointsPath)) {
      let entrypoints = (await (
        await fetch(`${this.fileServerURL}${entrypointsPath}`)
      ).json()) as string[];
      entrypoints = await this.setEntrypointsFile(entrypoints);
      updates = updates.filter((f) => f.name !== entrypointsPath);
    }

    if (!entrypoints) {
      entrypoints = removals.find((f) => f.name === entrypointsPath)
        ? undefined
        : await this.getEntrypoints();
    }
    let originalEntrypoints = entrypoints
      ? entrypoints.map((path) =>
          join(dirName(path) || "/", baseName(path).replace(/^src-/, ""))
        )
      : [];

    for (let change of updates) {
      console.log(`updating ${change.name}`);
      let pathOverride: string | undefined;
      if (originalEntrypoints.includes(change.name)) {
        pathOverride = join(
          dirName(change.name) || "/",
          `src-${baseName(change.name)}`
        );
        console.log(`updating ${change.name} (writing to ${pathOverride})`);
      } else {
        console.log(`updating ${change.name}`);
      }
      await this.updateFile(change.name, change.etag!, pathOverride);
    }

    for (let { name } of removals) {
      console.log(`removing ${name}`);
      await this.fs.remove(new URL(this.mountedPath(name), origin));
    }

    console.log(`completed processing changes, file system:`);
    await this.fs.displayListing();
  }

  private async getEntrypoints(
    _origin = new URL(origin)
  ): Promise<string[] | undefined> {
    let entrypointsFile: FileDescriptor;
    try {
      entrypointsFile = await this.fs.open(new URL(entrypointsPath, _origin));
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        return; // in this case there is no build to perform
      }
      throw err;
    }

    return JSON.parse(await entrypointsFile.readText()) as string[];
  }

  private async setEntrypointsFile(
    originalEntrypoints: string[],
    _origin = new URL(origin)
  ): Promise<string[]> {
    let entrypoints = originalEntrypoints.map((path) =>
      join(dirName(path) || "/", `src-${baseName(path)}`)
    );
    let entrypointsFile = await this.fs.open(
      new URL(entrypointsPath, _origin),
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
      new URL(this.mountedPath(pathOverride ?? path), origin),
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
          currentFile = await this.fs.open(new URL(name, origin));
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
