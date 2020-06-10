import { FileSystem } from "../filesystem";
import { FileDaemonClientVolume } from "../filesystem-drivers/file-daemon-client-driver";
import { ClientEventHandler } from "../client-event-handler";
import { BuildManager } from "../build-manager";

export type Handler = (
  request: Request,
  context: Context
) => Promise<Response | undefined>;

export interface Context {
  fs: FileSystem;
  fileDaemonVolume: FileDaemonClientVolume;
  eventHandler: ClientEventHandler;
  buildManager: BuildManager;
  event: FetchEvent;
}
