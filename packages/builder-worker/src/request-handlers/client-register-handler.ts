import { Handler } from "./request-handler";
import { Logger } from "../logger";
import { eventCategory as fileDaemonClientEventCategory } from "../filesystem-drivers/file-daemon-client-driver";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleClientRegister: Handler = async function (
  req,
  context
): Promise<Response | undefined> {
  let requestURL = new URL(req.url);
  const {
    event,
    fsEventHandler,
    fileDaemonVolume,
    logEventHandler,
    reloadEventHandler,
  } = context;
  // cross origin requests will not have a client
  if (!event.clientId || requestURL.origin !== worker.origin) {
    return;
  }

  if (requestURL.pathname.startsWith("/register-client/")) {
    let registrationType = requestURL.pathname.split("/").pop();
    switch (registrationType) {
      case "fs":
        fsEventHandler.addClient(event.clientId);
        if (fileDaemonVolume.connected) {
          await fsEventHandler.sendEvent(event.clientId, {
            href: worker.origin,
            category: fileDaemonClientEventCategory,
            type: "connected",
          });
        } else {
          await fsEventHandler.sendEvent(event.clientId, {
            href: worker.origin,
            category: fileDaemonClientEventCategory,
            type: "disconnected",
          });
        }
        return new Response("client registered", { status: 200 });
      case "log-messages":
        logEventHandler.addClient(event.clientId);
        await logEventHandler.sendEvent(event.clientId, Logger.messages());
        return new Response("client registered", { status: 200 });
      case "reload":
        reloadEventHandler.addClient(event.clientId);
        return new Response("client registered", { status: 200 });
      default:
        return new Response(
          `don't know how to register for ${registrationType}`,
          { status: 400 }
        );
    }
  } else if (requestURL.pathname.startsWith("/unregister-client")) {
    let unregistrationType = requestURL.pathname.split("/").pop();
    switch (unregistrationType) {
      case "file-daemon-client":
        fsEventHandler.removeClient(event.clientId);
        return new Response("client unregistered", { status: 200 });
      case "log-messages":
        logEventHandler.removeClient(event.clientId);
        return new Response("client unregistered", { status: 200 });
      default:
        return new Response(
          `don't know how to unregister for ${unregistrationType}`,
          { status: 400 }
        );
    }
  }
  return;
};
