import WebSocket from "ws";
import sane from "sane";

export default class FileWatcherServer {
  watchers: Watcher[];
  constructor(private port: number, directories: string[]) {
    this.watchers = directories.map((dir) => new Watcher(dir));
  }
  async start() {
    const wss = new WebSocket.Server({ port: this.port });
    console.log(`Websocket server listening on port: ${this.port}`);
    wss.on("connection", (ws) => {
      console.log("socket connected!");
      for (let watcher of this.watchers) {
        watcher.add(ws);
      }

      ws.on("close", () => {
        for (let watcher of this.watchers) {
          watcher.remove(ws);
        }
      });
      ws.on("error", () => {
        for (let watcher of this.watchers) {
          watcher.remove(ws);
        }
      });
    });
  }
}
