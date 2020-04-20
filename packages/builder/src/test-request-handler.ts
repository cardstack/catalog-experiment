import { Handler, Context } from "./request-handler";
import { isURL, baseName } from "./path";

export const testOrigin = "http://localhost:8080";
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
  let { fs } = context;
  if (
    (self as any).testMode &&
    requestUrl.origin === worker.origin &&
    // To prevent name collisions between actual JS files being served and JS
    // files in our testing scenarios that we want to build, use a `test-*.*` for
    // the name of the test JS files in the testing scenarios
    !/^test-/.test(baseName(path))
  ) {
    if (path === "/setup-fs" && req.method === "POST") {
      await fs.removeAll();
      let scenario: Scenario = (await req.json()) || {};
      for (let [path, text] of Object.entries(scenario)) {
        let file = isURL(path)
          ? await fs.open(new URL(path), "file")
          : await fs.open(new URL(path, testOrigin), "file");
        file.write(text);
      }
      return new Response("OK", { status: 200 });
    } else if (path === "/teardown-fs" && req.method === "POST") {
      await fs.removeAll();
      return new Response("OK", { status: 200 });
    } else {
      return new Response((await fetch(req)).body);
    }
  }
};
