import { Handler } from "./request-handler";
const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleBuilderRestartRequest: Handler = async function (
  req,
  context
): Promise<Response | undefined> {
  let requestURL = new URL(req.url);
  if (requestURL.origin !== worker.origin) {
    return;
  }
  if (!requestURL.pathname.startsWith("/restart-builder")) {
    return;
  }

  let { buildManager } = context;
  await buildManager.reload();

  return new Response("restarted builder", { status: 200 });
};
