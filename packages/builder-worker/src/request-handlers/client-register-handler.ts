import { Handler } from "./request-handler";
import { Logger } from "../logger";
import { FileDaemonClientVolume } from "../../../file-daemon-client/src/index";
import { ClientEventHandler } from "../client-event-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

// TODO eliminate the need to pass in the FileDaemonClientVolume into this
// handler by using the filesystem's files to signal daemon client events.

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
        await eventHandler.sendEvent(clientId, {
          fileDaemonClient: {
            href: worker.origin,
            type: "connected",
          },
        });
      } else {
        await eventHandler.sendEvent(clientId, {
          fileDaemonClient: {
            href: worker.origin,
            type: "disconnected",
          },
        });
      }

      await eventHandler.sendEvent(clientId, {
        logger: Logger.messages(),
      });
      return new Response("client registered", { status: 200 });
    } else if (requestURL.pathname.startsWith("/unregister-client")) {
      eventHandler.removeClient(clientId);
      return new Response("client unregistered", { status: 200 });
    }
    return;
  }) as Handler;
}
