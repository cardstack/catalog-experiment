import { FileSystem } from "./filesystem";

export type Handler = (
  request: Request,
  context: Context
) => Promise<Response | undefined>;

export interface Context {
  fs: FileSystem;
  webroot: string;
  originURL: URL;
}
