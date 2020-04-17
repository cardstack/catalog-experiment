import { parse } from "@babel/core";
import { FileDaemonClient, origin } from "./file-daemon-client";
import { contentType, lookup } from "mime-types";
import { FileDescriptor, FileSystem, FileSystemError } from "./filesystem";
import { join } from "./path";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const webroot = "/webroot";
const websocketURL = "ws://localhost:3000";
const client = new FileDaemonClient(origin, websocketURL, fs, webroot);
let isDisabled = false;

console.log("service worker evaluated");

(async () => {
  await checkForAliveness();
})();

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
  if (url.origin !== worker.origin || isDisabled) {
    if (isDisabled) {
      console.log(`service worker is disabled, ignoring ${event.request.url}`);
    } else {
      console.log(`ignore ${event.request.url} based on origin`);
    }
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    (async () => {
      await client.ready;
      let url = new URL(event.request.url);

      let path = url.pathname;
      path = join(webroot, path);
      let file = await openFile(fs, path);
      if (file instanceof Response) {
        return file;
      }
      if (file.stat.type === "directory") {
        path = join(path, "index.html");
        file = await openFile(fs, path);
        if (file instanceof Response) {
          return file;
        }
      }
      if (path.split(".").pop() === "js") {
        return bundled(path, file);
      } else {
        let response = new Response(file.getReadbleStream());
        setContentHeaders(response, path, file);
        return response;
      }
    })()
  );
});

async function openFile(
  fs: FileSystem,
  path: string
): Promise<FileDescriptor | Response> {
  try {
    return await fs.open(new URL(path, origin));
  } catch (err) {
    if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}

function setContentHeaders(
  response: Response,
  path: string,
  file: FileDescriptor
): void {
  let mime = lookup(path) || "application/octet-stream";
  response.headers.set(
    "content-type",
    contentType(mime) as Exclude<string, false>
  );
  response.headers.set("content-length", String(file.stat.size));
}

async function bundled(path: string, file: FileDescriptor): Promise<Response> {
  let js = await file.readText();
  if (!js) {
    return new Response(`'${path}' is an empty file`, { status: 500 });
  }
  let result = await parse(js, {});
  console.log(result);

  let response = new Response(js);
  response.headers.set("content-type", "application/javascript");
  response.headers.set("content-length", String(js.length));

  return response;
}

async function checkForAliveness() {
  while (true) {
    console.log("checking for file daemon aliveness");
    let status;
    try {
      status = (await fetch(`${origin}/__alive__`)).status;
    } catch (err) {
      console.log(
        `Encountered error performing aliveness check (server is probably not running):`,
        err
      );
    }
    if (status === 404) {
      console.error(
        "some other server is running instead of the file daemon, unregistering this service worker."
      );
      isDisabled = true;
      await worker.registration.unregister();
      break;
    } else {
      await new Promise((res) => setTimeout(() => res(), 10 * 1000));
    }
  }
}
