import { parse } from "@babel/core";
import { FileDaemonClient } from "./file-daemon-client";
import { contentType, lookup } from "mime-types";
import { File } from "./filesystem";

import { tarTest } from "./tar-test";

const utf8 = new TextDecoder("utf-8");
const worker = (self as unknown) as ServiceWorkerGlobalScope;
const client = new FileDaemonClient(
  "http://localhost:4200",
  "ws://localhost:3000"
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
      let url = new URL(event.request.url);
      let path = url.pathname === "/" ? "/index.html" : url.pathname;
      let file = (await client.fs).retrieve(path);
      if (file.name.split(".").pop() === "js") {
        return bundled(file);
      } else {
        let response = new Response(await file.data);
        setContentHeaders(response, file);
        return response;
      }
    })()
  );
});

function setContentHeaders(response: Response, file: File): void {
  let mime = lookup(file.name) || "application/octet-stream";
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
