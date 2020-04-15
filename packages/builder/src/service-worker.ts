import { parse } from "@babel/core";
import { FileDaemonClient } from "./file-daemon-client";
import { contentType, lookup } from "mime-types";
import { File, FileSystem, join } from "./filesystem";

import { tarTest } from "./tar-test";

const utf8 = new TextDecoder("utf-8");
const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const webroot = "/webroot";
const client = new FileDaemonClient(
  "http://localhost:4200",
  "ws://localhost:3000",
  fs,
  webroot
);

console.log("service worker evaluated");

worker.addEventListener("install", () => {
  console.log(`installing`);

  // force moving on to activation even if another service worker had control
  worker.skipWaiting();
});

worker.addEventListener("activate", () => {
  console.log(`activate`);

  // takes over when there is *no* existing service worker
  worker.clients.claim();
});

worker.addEventListener("fetch", (event: FetchEvent) => {
  let url = new URL(event.request.url);
  if (url.origin !== worker.origin) {
    console.log(`ignore ${event.request.url} based on origin`);
    event.respondWith(fetch(event.request));
    return;
  }

  if (url.pathname === "/tartest") {
    event.respondWith(tarTest());
    return;
  }

  event.respondWith(
    (async () => {
      await client.ready;
      let url = new URL(event.request.url);

      let path = url.pathname;
      path = join(webroot, path);
      let file: File;
      try {
        if (await fs.isDirectory(path || "/")) {
          path = `${path}/index.html`;
        }
        file = fs.open(path) as File;
      } catch (err) {
        // TODO let's add some codes on the errors that we throw like node does (e.g. NOENT)
        if (err.message.includes("does not exist")) {
          return new Response("Not found", { status: 404 });
        }
        throw err;
      }
      if (path.split(".").pop() === "js") {
        return bundled(file);
      } else {
        let response = new Response(await file.data);
        setContentHeaders(response, path, file);
        return response;
      }
    })()
  );
});

function setContentHeaders(response: Response, path: string, file: File): void {
  let mime = lookup(path) || "application/octet-stream";
  response.headers.set(
    "content-type",
    contentType(mime) as Exclude<string, false>
  );
  response.headers.set("content-length", String(file.stat.size));
}

async function bundled(file: File): Promise<Response> {
  let js = utf8.decode(await file.data);
  let result = await parse(js, {});
  console.log(result);

  let response = new Response(js);
  response.headers.set("content-type", "application/javascript");
  response.headers.set("content-length", String(js.length));

  return response;
}
