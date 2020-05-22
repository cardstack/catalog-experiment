import { Handler } from "./request-handler";
import { Logger } from "../logger";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleClientRegister: Handler = async function (
  req,
  context
): Promise<Response | undefined> {
  let requestURL = new URL(req.url);
  const {
    event,
    fileDaemonEventHandler,
    fileDaemonClient,
    logEventHandler,
  } = context;
  // cross origin requests will not have a client
  if (!event.clientId || requestURL.origin !== worker.origin) {
    return;
  }

  if (requestURL.pathname.startsWith("/register-client/")) {
    let registrationType = requestURL.pathname.split("/").pop();
    switch (registrationType) {
      case "file-daemon-client":
        fileDaemonEventHandler.addClient(event.clientId);
        if (fileDaemonClient.connected) {
          await fileDaemonEventHandler.sendEvent(event.clientId, {
            type: "connected",
          });
        } else {
          await fileDaemonEventHandler.sendEvent(event.clientId, {
            type: "disconnected",
          });
        }
        return new Response("client registered", { status: 200 });
      case "log-messages":
        logEventHandler.addClient(event.clientId);
        await logEventHandler.sendEvent(event.clientId, Logger.messages());
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
        fileDaemonEventHandler.removeClient(event.clientId);
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
