import WebSocket from "ws";
import sane, { Watcher } from "sane";
import { Stats } from "fs";
import { Project } from "./project";
import bind from "bind-decorator";
import { FileInfo } from "./interfaces";
import flatMap from "lodash/flatMap";

export default class FileWatcherServer {
  private sockets: Set<WebSocket> = new Set();
  private watchers: Watcher[] = [];
  private notificationQueue: FileInfo[] = [];
  // initializing this to a Promise.resolve so we don't hang if we try to flush
  // notifications and the server hasn't actually received any notifications
  // yet.
  private flushNotifications: Promise<void[]> = Promise.resolve([]);

  constructor(private port: number, projects: Project[]) {
    for (let project of projects) {
      let watcher = sane(project.dir);
      let handler = this.notify(project);
      watcher.on("add", handler);
      watcher.on("change", handler);
      watcher.on("delete", handler);
      this.watchers.push(watcher);
    }
  }

  async start() {
    const wss = new WebSocket.Server({ port: this.port });
    wss.on("connection", (ws) => {
      console.log("socket connected!");
      this.sockets.add(ws);

      ws.on("close", () => {
        console.log("socket closed");
        this.sockets.delete(ws);
      });
      ws.on("error", () => {
        this.sockets.delete(ws);
      });
    });
  }

  async close() {
    await this.flushNotifications;
    for (let watcher of this.watchers) {
      watcher.close();
    }
  }

  @bind
  private notify(project: Project) {
    return (path: string, _root: string, stat?: Stats) => {
      if (this.watchers.length === 0 || (stat && stat.isDirectory())) {
        return;
      }
      let paths = project
        .outputFiles(path)
        .map(
          ({ outputRelativePath }) =>
            `${project.localName}/${outputRelativePath}`
        );
      for (let outputPath of paths) {
        let fileHash = stat ? `${stat.size}_${stat.mtime.valueOf()}` : null;
        let info: FileInfo = {
          name: outputPath,
          etag: fileHash,
        };
        this.notificationQueue.push(info);
      }
      (async () => await this.drainNotificationQueue())();
    };
  }

  private async drainNotificationQueue(): Promise<void> {
    await this.flushNotifications;

    // use a new array so that any new notifications will be processed on the next turn
    let notifications = [...this.notificationQueue];
    this.notificationQueue = [];
    this.flushNotifications = Promise.all(
      flatMap(notifications, (info) =>
        [...this.sockets].map((socket) => socket.send(JSON.stringify(info)))
      )
    );
  }
}
