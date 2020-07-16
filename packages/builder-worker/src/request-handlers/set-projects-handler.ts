import { Handler } from "./request-handler";
import { BuildManager } from "../build-manager";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export function handleSetProjects(buildManager: BuildManager) {
  return (async ({ request }) => {
    let requestURL = new URL(request.url);
    if (requestURL.origin !== worker.origin) {
      return;
    }
    if (
      requestURL.pathname.startsWith("/projects") &&
      request.method === "POST"
    ) {
      let projects = await request.json();
      assertProjectLike(projects);
      buildManager.setProjects(
        projects.map(([input, output]) => [new URL(input), new URL(output)])
      );
      await buildManager.rebuilder!.build();
      let status = buildManager.rebuilder?.status;
      if (status && status.name === "failed") {
        return new Response(`build failed: ${status.exception}`, {
          status: 400,
        });
      } else if (status && status.name === "succeeded") {
        return new Response("build succeeded", { status: 200 });
      }
    }
    return undefined;
  }) as Handler;
}

function assertProjectLike(data: any): asserts data is [string, string][] {
  if (!Array.isArray(data)) {
    throw new Error(`projects must be an array`);
  }
  if (
    data.some(
      (p) =>
        !Array.isArray(p) ||
        p.some((u) => typeof u !== "string") ||
        p.length !== 2
    )
  ) {
    throw new Error(
      `each project in the projects array must be a string array with 2 items`
    );
  }
}
