import { Handler, Context } from "./request-handler";
import { isURL } from "./path";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
let testOrigins: string[] = [];

export interface Scenario {
  [fileURL: string]: string;
}

export const handleTestRequest: Handler = async function (
  req: Request,
  context: Context
) {
  let requestUrl = new URL(req.url);
  let path = requestUrl.pathname;
  let { fs } = context;

  if (testOrigins.includes(requestUrl.origin)) {
    context.handleOrigin = true;
    return;
  }

  if (
    path === "/setup-fs" &&
    req.method === "POST" &&
    requestUrl.origin === worker.origin
  ) {
    let origin = requestUrl.searchParams.get("origin");
    if (!origin) {
      throw new Error(
        `An origin query parameter must be specified for the test scenario setup`
      );
    } else {
      testOrigins.push(origin);
    }
    await fs.removeAll();
    let scenario: Scenario = (await req.json()) || {};
    for (let [path, text] of Object.entries(scenario)) {
      let file = isURL(path)
        ? await fs.open(new URL(path), "file")
        : await fs.open(new URL(path, origin), "file");
      file.write(text);
    }
    return new Response("OK", { status: 200 });
  } else if (
    path === "/teardown-fs" &&
    req.method === "POST" &&
    requestUrl.origin === worker.origin
  ) {
    await fs.removeAll();
    testOrigins = [];
    return new Response("OK", { status: 200 });
  } else if (context.testMode && requestUrl.origin === worker.origin) {
    return new Response((await fetch(req)).body);
  }
};
