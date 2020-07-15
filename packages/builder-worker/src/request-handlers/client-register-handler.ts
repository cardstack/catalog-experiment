import { Handler } from "./request-handler";
import { Logger } from "../logger";
import { eventGroup as fsGroup } from "../filesystem";
import {
  FileDaemonClientEvent,
  eventCategory as fileDaemonClientEventCategory,
  FileDaemonClientVolume,
} from "../../../file-daemon-client/src/index";
import { LogMessage, eventGroup as logGroup } from "../logger";
import { ClientEventHandler } from "../client-event-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export function handleClientRegister(
  eventHandler: ClientEventHandler,
  fileDaemonVolume: FileDaemonClientVolume
) {
  return (async ({ clientId, request }) => {
    let requestURL = new URL(request.url);
    // cross origin requests will not have a client
    if (!clientId || requestURL.origin !== worker.origin) {
      return;
    }

    if (requestURL.pathname.startsWith("/register-client")) {
      eventHandler.addClient(clientId);
      if (fileDaemonVolume.connected) {
        await eventHandler.sendEvent<FileDaemonClientEvent>(clientId, {
          group: fsGroup,
          args: {
            href: worker.origin,
            category: fileDaemonClientEventCategory,
            type: "connected",
          },
        });
      } else {
        await eventHandler.sendEvent<FileDaemonClientEvent>(clientId, {
          group: fsGroup,
          args: {
            href: worker.origin,
            category: fileDaemonClientEventCategory,
            type: "disconnected",
          },
        });
      }

      await eventHandler.sendEvent<LogMessage[]>(clientId, {
        group: logGroup,
        args: Logger.messages(),
      });
      return new Response("client registered", { status: 200 });
    } else if (requestURL.pathname.startsWith("/unregister-client")) {
      eventHandler.removeClient(clientId);
      return new Response("client unregistered", { status: 200 });
    }
    return;
  }) as Handler;
}
