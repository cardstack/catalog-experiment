import { BaseFileEntry } from "@catalogjs/tarstream";

// interfaces we want to share with the client
export type WatchInfo = {
  files: FileInfo[];
};

export interface FileHeader extends BaseFileEntry {
  size: number;
}

export interface FileInfo {
  name: string;
  etag: string | null; // null means deleted
  //header?: FileHeader; // deleted files have no header
}
