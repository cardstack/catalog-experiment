import {
  WebSocket
} from "https://deno.land/std/ws/mod.ts";
import { walkSync } from "https://deno.land/std/fs/mod.ts";

interface WatchInfo {
  modifiedFiles: string[];
  removedFiles: string[]
};
interface DirectoryMapEntry {
  hash: string;
  info: Deno.FileInfo
}
type DirectoryMap = Map<string, DirectoryMapEntry>;

const DIRECTORY_POLL = 500;

export default class Watcher {
  nextWatch?: number;
  watchers = new Map<WebSocket, boolean>();
  previousDirectoryMap = new Map<string, DirectoryMapEntry>();
  notifyPromise?: Promise<void>;
  constructor(private directory: string) { }

  async add(sock: WebSocket): Promise<void> {
    // tell the new watcher about all the files that exist if the file watching
    // is already underway
    if (this.nextWatch) {
      let info: WatchInfo = {
        modifiedFiles: [...this.buildDirectoryMap().keys()],
        removedFiles: []
      };
      await sock.send(JSON.stringify(info));
    }

    this.watchers.set(sock, true);
    if (!this.nextWatch) {
      this.watch();
      this.scheduleNextWatch();
    }
  }

  remove(sock: WebSocket) {
    this.watchers.delete(sock);
    if (this.watchers.size === 0) {
      clearTimeout(this.nextWatch);
      this.nextWatch = undefined;
    }
  }

  private async notify(info: WatchInfo) {
    await Promise.all([...this.watchers.keys()].map(sock => sock.send(JSON.stringify(info))));
  }

  private scheduleNextWatch() {
    this.nextWatch = setTimeout(() => {
      this.watch();
      this.scheduleNextWatch();
    }, DIRECTORY_POLL);
  }

  private watch() {
    if (this.watchers.size === 0) { return; }

    let current = this.buildDirectoryMap();
    let info = this.diffDirectories(this.previousDirectoryMap, current);
    let { modifiedFiles, removedFiles } = info;
    if (modifiedFiles.length) {
      console.log(`files modified: ${JSON.stringify(modifiedFiles, null, 2)}`);
    }
    if (removedFiles.length) {
      console.log(`files removed: ${JSON.stringify(removedFiles, null, 2)}`);
    }
    if (modifiedFiles.length || removedFiles.length) {
      this.notifyPromise = Promise.resolve(this.notifyPromise)
        .then(() => this.notify(info))
        .catch(e => {
          console.error(`Encountered error sending notification to socket`, e);
          throw e;
        });
    }

    this.previousDirectoryMap = current;
  }

  private diffDirectories(source: DirectoryMap, target: DirectoryMap): WatchInfo {
    let modifiedFiles: string[] = [];
    let targetFiles = [...target.keys()];
    let removedFiles = [...source.keys()].filter(i => !targetFiles.includes(i));
    for (let [file, { hash }] of target) {
      if (!source.has(file)) {
        modifiedFiles.push(file);
      } else if (source.get(file)!.hash !== hash) {
        modifiedFiles.push(file);
      }
    }

    return { modifiedFiles, removedFiles };
  }

  private buildDirectoryMap(): DirectoryMap {
    let directoryMap = new Map<string, DirectoryMapEntry>();
    for (let { filename, info } of walkSync(this.directory)) {
      if (!info.isFile()) { continue; }
      let relativeFile = filename.slice(this.directory.length + 1);
      let fileHash = `${info.size}_${info.modified || 0}`;
      directoryMap.set(relativeFile, { hash: fileHash, info });
    }
    return directoryMap;
  }
}