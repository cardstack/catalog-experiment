import { Handler, Context } from "./request-handler";
import { isURL } from "./path";
import { Builder } from "./builder";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export interface Scenario {
  [fileURL: string]: string;
}

export const handleTestRequest: Handler = async function (
  req: Request,
  context: Context
) {
  let requestUrl = new URL(req.url);
  let path = requestUrl.pathname;
  let { fs, origin } = context;
  if (
    path === "/setup-fs" &&
    req.method === "POST" &&
    requestUrl.origin === worker.origin
  ) {
    await fs.removeAll();
    let scenario: Scenario = (await req.json()) || {};
    for (let [path, text] of Object.entries(scenario)) {
      let file = isURL(path)
        ? await fs.open(new URL(path), "file")
        : await fs.open(new URL(path, origin), "file");
      file.write(text);
    }
    let builder = Builder.forProjects(fs, [origin]);
    await builder.build();
    return new Response("OK", { status: 200 });
  } else if (
    path === "/teardown-fs" &&
    req.method === "POST" &&
    requestUrl.origin === worker.origin
  ) {
    await fs.removeAll();
    return new Response("OK", { status: 200 });
  }
};
