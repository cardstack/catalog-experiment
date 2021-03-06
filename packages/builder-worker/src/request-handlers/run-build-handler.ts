import { Handler } from "./request-handler";
import { BuildManager } from "../build-manager";
import { BundleAssignment } from "../nodes/bundle";
import { NotStartedBuildStatus } from "../builder";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export function handleBuild(buildManager: BuildManager) {
  return (async ({ request }) => {
    let requestURL = new URL(request.url);
    if (requestURL.origin !== worker.origin) {
      return;
    }
    if (requestURL.pathname.startsWith("/build") && request.method === "POST") {
      let { projects, assigner } = await request.json();
      assertProjectLike(projects);
      assertAssigner(assigner);
      await buildManager.configure(
        projects.map(([input, output]) => [new URL(input), new URL(output)]),
        {
          bundle: { assigner },
        }
      );
      await buildManager.rebuilder!.build();
      let status = buildManager.rebuilder?.status;
      if (status && status.name === "failed") {
        return new Response(
          JSON.stringify({ ...status, exception: String(status.exception) }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (status && status.name === "succeeded") {
        return new Response("build succeeded", { status: 200 });
      }
    } else if (
      requestURL.pathname.startsWith("/build") &&
      request.method === "GET"
    ) {
      if (!buildManager.rebuilder) {
        return new Response(
          JSON.stringify({ name: "not started" } as NotStartedBuildStatus),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      await buildManager.isIdle();
      let status = buildManager.rebuilder?.status;
      let responseBuildStatus = JSON.stringify(
        status.name === "failed"
          ? { ...status, exception: String(status.exception) }
          : status
      );
      return new Response(responseBuildStatus, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
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

function assertAssigner(
  data: string
): asserts data is BundleAssignment["assigner"] {
  switch (data) {
    case "default":
    case "maximum":
    case "minimum":
      return;
    default:
      throw new Error(`'${data}' is not a valid bundle assigner`);
  }
}
