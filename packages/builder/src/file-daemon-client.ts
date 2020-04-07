import { WatchInfo } from "../../file-daemon/interfaces";
import { FileSystem } from "./filesystem";

interface FullSync {
  tempDir: string;
}

export class FileDaemonClient {
  // keeping track of this for future tests so we don't leak async
  fullSyncPromise?: Promise<void>;

  private socket: WebSocket | undefined;
  private socketClosed: Promise<void> | undefined;
  private backoffInterval = 0;
  private runningFullSync: FullSync | undefined;

  private queue: WatchInfo[] = [];
  private resolveQueuePromise: undefined | (() => void);

  constructor(
    private fileServerURL: string,
    private websocketServerURL: string,
    private fs: FileSystem
  ) {
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
        console.log(`handled unexpected error in FileDaemonClient`, err);
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

      this.fullSyncPromise = this.startFullSync().catch((err) => {
        console.error(`Error encountered running full sync`, err);
        throw err;
      });
    };
    this.socket = socket;
    this.socketClosed = socketClosed;
    this.runningFullSync = undefined;
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
    let res = await fetch(`${this.fileServerURL}/`, {
      headers: {
        accept: "application/x-tar",
      },
    });
    let tarStream = res.body;
    // TODO pass the tar stream into the FileSystem instance, where we can
    // decode the tar stream to create the resulting filesystem
  }

  private handleInfo(watchInfo: WatchInfo) {
    console.log("handleMessage: Received file change notification", watchInfo);

    // TODO update file system for changed files
  }
}
