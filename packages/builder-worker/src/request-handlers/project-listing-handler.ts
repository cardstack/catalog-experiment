import { Handler } from "./request-handler";
import { FileSystem } from "../filesystem";
import { BuildManager } from "../build-manager";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export function handleListing(fs: FileSystem, buildManager: BuildManager) {
  return (async ({ request }) => {
    let requestURL = new URL(request.url);
    if (requestURL.origin !== worker.origin) {
      return;
    }
    if (
      requestURL.pathname.startsWith("/projects") &&
      request.method === "GET"
    ) {
      let availableProjects = (
        await fs.list(new URL("https://local-disk/"), true)
      )
        .filter((entry) => entry.url.href.endsWith("entrypoints.json"))
        .map((entry) =>
          entry.url.href.slice(0, -1 * "entrypoints.json".length)
        );
      let activeProjects = buildManager.projects() ?? [];
      let response = {
        activeProjects,
        availableProjects,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return undefined;
  }) as Handler;
}
