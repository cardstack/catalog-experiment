import WebSocket from "ws";
import Watcher from "./watcher";

export default class FileWatcherServer {
  watcher: Watcher;
  constructor(private port: number, directory: string) {
    this.watcher = new Watcher(directory);
  }
  async start() {
    const wss = new WebSocket.Server({ port: this.port });
    console.log(`Websocket server listening on port: ${this.port}`);
    wss.on("connection", (ws) => {
      console.log("socket connected!");
      this.watcher.add(ws);

      ws.on("close", () => this.watcher.remove(ws));
      ws.on("error", () => this.watcher.remove(ws));
    });
  }
}
