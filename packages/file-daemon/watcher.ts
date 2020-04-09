import WebSocket from "ws";
import walkSync from "walk-sync";
import { WatchInfo, FileInfo } from "./interfaces";

interface DirectoryMapEntry {
  hash: string;
  info: walkSync.Entry;
}
type DirectoryMap = Map<string, DirectoryMapEntry>;

const DIRECTORY_POLL = 500;

export default class Watcher {
  nextWatch?: NodeJS.Timeout;
  watchers = new Map<WebSocket, boolean>();
  previousDirectoryMap: DirectoryMap;
  notifyPromise?: Promise<void>;

  constructor(private directory: string) {
    this.previousDirectoryMap = this.buildDirectoryMap();
  }

  async add(sock: WebSocket): Promise<void> {
    this.watchers.set(sock, true);
    if (!this.nextWatch) {
      this.scheduleNextWatch();
    }
  }

  remove(sock: WebSocket) {
    this.watchers.delete(sock);
    if (this.watchers.size === 0 && this.nextWatch != null) {
      clearTimeout(this.nextWatch);
      this.nextWatch = undefined;
    }
  }

  private async notify(info: WatchInfo) {
    await Promise.all(
      [...this.watchers.keys()].map((sock) => sock.send(JSON.stringify(info)))
    );
  }

  private scheduleNextWatch() {
    this.nextWatch = setTimeout(() => {
      this.watch();
      this.scheduleNextWatch();
    }, DIRECTORY_POLL);
  }

  private watch() {
    if (this.watchers.size === 0) {
      return;
    }

    let current = this.buildDirectoryMap();
    let info = this.diffDirectories(this.previousDirectoryMap, current);
    if (info.files.length) {
      console.log(`files modified: ${JSON.stringify(info.files, null, 2)}`);
      this.notifyPromise = Promise.resolve(this.notifyPromise)
        .then(() => this.notify(info))
        .catch((e) => {
          console.error(`Encountered error sending notification to socket`, e);
          throw e;
        });
    }

    this.previousDirectoryMap = current;
  }

  private diffDirectories(
    source: DirectoryMap,
    target: DirectoryMap
  ): WatchInfo {
    let files: FileInfo[] = [...source.keys()]
      .filter((i) => !target.has(i))
      .map((name) => ({ name, etag: null }));
    for (let [file, { hash }] of target) {
      if (!source.has(file)) {
        files.push({ name: file, etag: hash });
      } else if (source.get(file)!.hash !== hash) {
        files.push({ name: file, etag: hash });
      }
    }
    return { files };
  }

  private buildDirectoryMap(): DirectoryMap {
    let directoryMap = new Map<string, DirectoryMapEntry>();
    for (let entry of walkSync.entries(this.directory)) {
      if (entry.isDirectory()) {
        continue;
      }
      let fileHash = `${entry.size}_${entry.mtime}`;
      directoryMap.set(entry.relativePath, { hash: fileHash, info: entry });
    }
    return directoryMap;
  }
}
