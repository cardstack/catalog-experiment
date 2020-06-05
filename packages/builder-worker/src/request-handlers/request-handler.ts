import { FileSystem, Event as FSEvent } from "../filesystem";
import { FileDaemonClientVolume } from "../filesystem-drivers/file-daemon-client-driver";
import { ClientEventHandler } from "../client-event-handler";
import { LogMessage } from "../logger";
import { ReloadEvent } from "../client-reload";
import { BuildManager } from "../build-manager";

export type Handler = (
  request: Request,
  context: Context
) => Promise<Response | undefined>;

export interface Context {
  fs: FileSystem;
  fileDaemonVolume: FileDaemonClientVolume;
  fsEventHandler: ClientEventHandler<FSEvent>;
  logEventHandler: ClientEventHandler<LogMessage[]>;
  reloadEventHandler: ClientEventHandler<ReloadEvent>;
  buildManager: BuildManager;
  event: FetchEvent;
}
