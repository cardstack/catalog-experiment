import { FileSystem } from "../filesystem";
import {
  FileDaemonClient,
  Event as FileDaemonClientEvent,
} from "../file-daemon-client";
import { ClientEventHandler } from "../client-event-handler";
import { LogMessage } from "../logger";
import { ReloadEvent } from "../client-reload";
import { BuildManager } from "../BuildManager";

export type Handler = (
  request: Request,
  context: Context
) => Promise<Response | undefined>;

export interface Context {
  fs: FileSystem;
  fileDaemonClient: FileDaemonClient;
  fileDaemonEventHandler: ClientEventHandler<FileDaemonClientEvent>;
  logEventHandler: ClientEventHandler<LogMessage[]>;
  reloadEventHandler: ClientEventHandler<ReloadEvent>;
  buildManager: BuildManager;
  event: FetchEvent;
}
