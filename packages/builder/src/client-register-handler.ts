import { Handler } from "./request-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleClientRegister: Handler = async function (
  req,
  context
): Promise<Response | undefined> {
  let requestURL = new URL(req.url);
  const { event, fileDaemonEventHandler, fileDaemonClient } = context;
  // cross origin requests will not have a client
  if (!event.clientId || requestURL.origin !== worker.origin) {
    return;
  }

  if (requestURL.pathname === "/register-client") {
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
  } else if (requestURL.pathname === "/unregister-client") {
    fileDaemonEventHandler.removeClient(event.clientId);
    return new Response("client unregistered", { status: 200 });
  }
};
