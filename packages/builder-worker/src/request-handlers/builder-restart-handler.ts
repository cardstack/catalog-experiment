import { Handler } from "./request-handler";
import { BuildManager } from "../build-manager";
const worker = (self as unknown) as ServiceWorkerGlobalScope;

export function handleBuilderRestart(buildManager: BuildManager) {
  return (async ({ request }) => {
    let requestURL = new URL(request.url);
    if (requestURL.origin !== worker.origin) {
      return;
    }
    if (!requestURL.pathname.startsWith("/restart-builder")) {
      return;
    }

    await buildManager.reload();

    return new Response("restarted builder", { status: 200 });
  }) as Handler;
}
