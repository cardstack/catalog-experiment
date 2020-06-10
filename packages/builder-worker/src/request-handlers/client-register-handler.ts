import { Handler } from "./request-handler";
import { Logger } from "../logger";
import { eventGroup as fsGroup } from "../filesystem";
import {
  FileDaemonClientEvent,
  eventCategory as fileDaemonClientEventCategory,
} from "../filesystem-drivers/file-daemon-client-driver";
import { LogMessage, eventGroup as logGroup } from "../logger";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleClientRegister: Handler = async function (
  req,
  context
): Promise<Response | undefined> {
  let requestURL = new URL(req.url);
  const { event, eventHandler, fileDaemonVolume } = context;
  // cross origin requests will not have a client
  if (!event.clientId || requestURL.origin !== worker.origin) {
    return;
  }

  if (requestURL.pathname.startsWith("/register-client")) {
    eventHandler.addClient(event.clientId);
    if (fileDaemonVolume.connected) {
      await eventHandler.sendEvent<FileDaemonClientEvent>(event.clientId, {
        group: fsGroup,
        args: {
          href: worker.origin,
          category: fileDaemonClientEventCategory,
          type: "connected",
        },
      });
    } else {
      await eventHandler.sendEvent<FileDaemonClientEvent>(event.clientId, {
        group: fsGroup,
        args: {
          href: worker.origin,
          category: fileDaemonClientEventCategory,
          type: "disconnected",
        },
      });
    }

    await eventHandler.sendEvent<LogMessage[]>(event.clientId, {
      group: logGroup,
      args: Logger.messages(),
    });
    return new Response("client registered", { status: 200 });
  } else if (requestURL.pathname.startsWith("/unregister-client")) {
    eventHandler.removeClient(event.clientId);
    return new Response("client unregistered", { status: 200 });
  }
  return;
};
