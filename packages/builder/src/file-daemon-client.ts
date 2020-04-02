import { WatchInfo } from "../../file-daemon/interfaces";
import { FileSystem } from "./filesystem";

export class FileDaemonClient {
  private socket: WebSocket | undefined;
  private socketClosed: Promise<void> | undefined;
  private backoffInterval = 0;

  constructor(private serverURL: string, private fs: FileSystem) {
    this.run();
  }

  private async run() {
    while (true) {
      try {
        this.tryConnect();
        await this.socketClosed;
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
    let socket = new WebSocket(this.serverURL);
    let socketIsClosed: () => void;
    let socketClosed: Promise<void> = new Promise(r => {
      socketIsClosed = r;
    });
    socket.onmessage = event => {
      this.handleMessage(event);
    };
    socket.onerror = event => {
      console.log(`websocket error`, event);
    };
    socket.onclose = (event: CloseEvent) => {
      console.log(`websocket close`, event);
      socketIsClosed();
    };
    socket.onopen = event => {
      console.log(`websocket open`, event);
      this.backoffInterval = 0;
    };
    this.socket = socket;
    this.socketClosed = socketClosed;
  }

  private async backoff() {
    console.log(`using backoff delay ${this.backoffInterval}`);
    await new Promise(resolve => setTimeout(resolve, this.backoffInterval));
    this.backoffInterval = Math.min(
      Math.max(this.backoffInterval, 100) * 2,
      10000
    );
  }

  private handleMessage(event: MessageEvent) {
    let watchInfo = JSON.parse(event.data) as WatchInfo;
    console.log("handleMessage: Received file change notification", watchInfo);
  }
}
