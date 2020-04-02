// interfaces we want to share with the client

export type WatchInfo =
  | {
      type: "full";
      lastMessage: boolean;
      files: FileInfo[];
    }
  | {
      type: "incremental";
      files: FileInfo[];
    };

export interface FileInfo {
  name: string;
  etag: string | null; // null means deleted
}
