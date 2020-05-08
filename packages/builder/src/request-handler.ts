import { FileSystem } from "./filesystem";
import { FileDaemonEventHandler } from "./file-daemon-event-handler";

export type Handler = (
  request: Request,
  context: Context
) => Promise<Response | undefined>;

export interface Context {
  fs: FileSystem;
  fileDaemonEventHandler: FileDaemonEventHandler;
  event: FetchEvent;
  webroot: string;
}
