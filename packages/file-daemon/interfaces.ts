// interfaces we want to share with the client

export interface WatchInfo {
  files: FileInfo[];
};

export interface FileInfo {
  name: string;
  etag: string | null; // null means deleted
}