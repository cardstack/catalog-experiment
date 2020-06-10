import { FileSystem } from "../filesystem";
import { Event } from "../event-bus";
import {
  FileDaemonClientVolume,
  FileDaemonClientEvent,
} from "../filesystem-drivers/file-daemon-client-driver";
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
  fsEventHandler: ClientEventHandler<Event<FileDaemonClientEvent>>;
  logEventHandler: ClientEventHandler<LogMessage[]>;
  reloadEventHandler: ClientEventHandler<ReloadEvent>;
  buildManager: BuildManager;
  event: FetchEvent;
}
