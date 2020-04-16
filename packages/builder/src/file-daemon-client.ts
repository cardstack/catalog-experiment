import { WatchInfo, FileInfo } from "../../file-daemon/interfaces";
import {
  FileSystem,
  join,
  FileSystemError,
  FileDescriptor,
} from "./filesystem";
import columnify from "columnify";
import { REGTYPE } from "tarstream/constants";
import moment from "moment";
//@ts-ignore
import { UnTar } from "tarstream";

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
    console.log("starting full sync");
    let stream = (
      await fetch(`${this.fileServerURL}/`, {
        headers: {
          accept: "application/x-tar",
        },
      })
    ).body as ReadableStream;

    let mountedPath = this.mountedPath.bind(this);
    let fs = this.fs;
    let untar = new UnTar(stream, {
      async file(entry) {
        if (entry.type === REGTYPE) {
          let file = await fs.open(mountedPath(entry.name), "file");
          file.setEtag(`${entry.size}_${entry.modifyTime}`);
          await file.write(entry.stream());
        }
      },
    });
    await untar.done;
    this.doneSyncing();

    console.log(`syncing complete, file system:`);
    await this.displayListing();
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

    for (let change of updates) {
      console.log(`updating ${change.name}`);
      let stream = (await fetch(`${this.fileServerURL}${change.name}`))
        .body as ReadableStream<Uint8Array>;
      if (!stream) {
        throw new Error(`Couldn't fetch ${change.name} from file server`);
      }
      let file = await this.fs.open(this.mountedPath(change.name), "file");
      file.setEtag(change.etag!);
      await file.write(stream);
    }

    // removals are synchronous, so no need to wrap in a transaction
    for (let { name } of removals) {
      console.log(`removing ${name}`);
      await this.fs.remove(this.mountedPath(name));
    }

    console.log(`completed processing changes, file system:`);
    await this.displayListing();
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
          currentFile = await this.fs.open(name);
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

  private async displayListing(): Promise<void> {
    await this.ready;
    let listing = (await this.fs.list("/", true)).map(({ path, stat }) => ({
      type: stat.type,
      size: stat.type === "directory" ? "-" : stat.size,
      modified:
        stat.type === "directory"
          ? "-"
          : moment(stat.mtime! * 1000).format("MMM D YYYY HH:mm"),
      etag: stat.etag ?? "-",
      path,
    }));
    console.log(columnify(listing));
  }
}
