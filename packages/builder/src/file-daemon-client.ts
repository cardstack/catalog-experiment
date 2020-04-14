import { WatchInfo, FileInfo } from "../../file-daemon/interfaces";
import { FileSystem, splitPath, join } from "./filesystem";
import columnify from "columnify";
import { DIRTYPE } from "tarstream/constants";
import moment from "moment";
//@ts-ignore
import perms from "perms";

export class FileDaemonClient {
  fs: Promise<FileSystem>;

  private socket: WebSocket | undefined;
  private socketClosed: Promise<void> | undefined;
  private backoffInterval = 0;
  private doneSyncing!: (fs: FileSystem) => void;

  private queue: WatchInfo[] = [];
  private resolveQueuePromise: undefined | (() => void);

  constructor(
    private fileServerURL: string,
    private websocketServerURL: string
  ) {
    this.fs = new Promise((res) => (this.doneSyncing = res));
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
    let fs = new FileSystem(
      (
        await fetch(`${this.fileServerURL}/`, {
          headers: {
            accept: "application/x-tar",
          },
        })
      ).body as ReadableStream
    );
    await fs.ready;
    this.doneSyncing(fs);

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
    let replacementPath = await this.replacementPathForChanges(changes);

    let fs = await this.fs;
    await fs.transaction(async (root) => {
      for (let change of updates) {
        let absolutePath = change.name;
        console.log(`updating ${absolutePath}`);
        let stream = (await fetch(`${this.fileServerURL}${absolutePath}`))
          .body as ReadableStream<Uint8Array>;
        if (!stream) {
          throw new Error(`Couldn't fetch ${absolutePath} from file server`);
        }
        let relativePath = join(
          fs.baseName(replacementPath),
          absolutePath.slice(replacementPath.length + 1)
        );
        await fs.write(relativePath, change.header!, stream, root);
      }
    }, replacementPath);

    // removals are synchronous, so no need to wrap in a transaction
    for (let { name } of removals) {
      console.log(`removing ${name}`);
      fs.remove(name);
    }

    console.log(`completed processing changes, file system:`);
    await this.displayListing();
  }

  private async pruneChanges(changes: FileInfo[]): Promise<FileInfo[]> {
    let fs = await this.fs;
    return changes.filter(({ name, etag }) => {
      if (!fs.exists(name)) {
        return true;
      }
      let currentFile = fs.retrieve(name);
      return currentFile.stat.etag !== etag;
    });
  }

  // This is the path to replace in the filee system after the streaming has
  // completed--it is the deepest directory that currently exists in the
  // filesytem that a common ancestor of all the changed files.
  private async replacementPathForChanges(
    changes: FileInfo[]
  ): Promise<string> {
    let path = changes
      .map((i) => i.name)
      .reduce((changePath, filePath) => {
        if (changePath == null) {
          return filePath;
        }
        return findOverlap(filePath, changePath);
      });

    let fs = await this.fs;
    let segments = splitPath(path);
    let replacementPath!: string;
    for (let i = 0; i <= segments.length; i++) {
      replacementPath = join(...segments.slice(0, segments.length - i));
      if (fs.exists(replacementPath) && fs.isDirectory(replacementPath)) {
        break;
      }
    }

    return replacementPath;
  }

  private async displayListing(): Promise<void> {
    let fs = await this.fs;
    let listing = fs.list("/", true).map(({ path, stat }) => ({
      mode: `${stat.type === DIRTYPE ? "d" : "-"}${perms.toString(stat.mode)}`,
      size: stat.size,
      modified: moment(stat.modifyTime! * 1000).format("MMM D YYYY HH:mm"),
      etag: stat.etag,
      path,
    }));
    console.log(columnify(listing));
  }
}

function findOverlap(a: string, b: string): string {
  let longerString = a.length > b.length ? a : b;
  let shorterString = a.length > b.length ? b : a;
  if (shorterString.length === 0) {
    return "";
  }

  if (longerString.startsWith(shorterString)) {
    return shorterString;
  }

  return findOverlap(
    longerString,
    shorterString.substring(0, shorterString.length - 1)
  );
}
