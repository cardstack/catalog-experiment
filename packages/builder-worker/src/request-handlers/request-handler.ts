import { FileSystem } from "../filesystem";
import { FileDaemonEventHandler } from "../file-daemon-event-handler";
import { FileDaemonClient } from "../file-daemon-client";

export type Handler = (
  request: Request,
  context: Context
) => Promise<Response | undefined>;

export interface Context {
  fs: FileSystem;
  fileDaemonClient: FileDaemonClient;
  fileDaemonEventHandler: FileDaemonEventHandler;
  event: FetchEvent;
  projects: [URL, URL][]; // [input, output][]
}
