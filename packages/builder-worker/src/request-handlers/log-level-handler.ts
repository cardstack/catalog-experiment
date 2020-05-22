import { Logger, LogLevel } from "../logger";
import { Handler } from "./request-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleLogLevelRequest: Handler = async function (
  req
): Promise<Response | undefined> {
  let requestURL = new URL(req.url);
  if (requestURL.origin !== worker.origin) {
    return;
  }
  if (!requestURL.pathname.startsWith("/log-level")) {
    return;
  }

  let level = requestURL.pathname.split("/")!.pop() as LogLevel;
  Logger.setLogLevel(level);
  return new Response("log-level updated", { status: 200 });
};
