import {
  FileDaemonClient,
  defaultOrigin,
  defaultWebsocketURL,
} from "./file-daemon-client";
import { FileSystem } from "./filesystem";
import { handleTestRequest } from "./test-request-handler";
import { handleBuildRequest } from "./build-request-handler";
import { Handler } from "./request-handler";
import { Builder } from "./builder";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const ourBackendEndpoint = "__alive__";
const webroot: string = "/";

let origin: string;
let websocketURL: string;
let fileDaemonURL: string;
let isDisabled = false;
let finishedBuild: Promise<void>;
let client: FileDaemonClient | undefined;

console.log(`service worker evaluated`);

worker.addEventListener("install", () => {
  console.log(`installing`);
  let workerURL = new URL(worker.location.toString());
  origin = workerURL.searchParams.get("origin") || defaultOrigin;
  websocketURL =
    workerURL.searchParams.get("websocketURL") || defaultWebsocketURL;
  fileDaemonURL = workerURL.searchParams.get("fileDaemonURL") || defaultOrigin;

  // force moving on to activation even if another service worker had control
  worker.skipWaiting();
});

worker.addEventListener("activate", () => {
  console.log(
    `service worker activated using builder origin: ${origin}, file daemon URL: ${fileDaemonURL}, websocket URL: ${websocketURL}`
  );

  // takes over when there is *no* existing service worker
  worker.clients.claim();

  // when testing these 2 values are usually different, and in that case we
  // don't want a file daemon client
  if (origin === fileDaemonURL) {
    client = new FileDaemonClient(fileDaemonURL, websocketURL, fs, webroot);

    // TODO watch for file changes and build when fs changes
    let builder = Builder.forProject(fs, origin);
    finishedBuild = (async () => {
      await client.ready;
      await builder.build();
      console.log(`completed build, file system:`);
      await fs.displayListing();
    })();
  }
  (async () => {
    await checkForOurBackend();
  })();
});

worker.addEventListener("fetch", (event: FetchEvent) => {
  let url = new URL(event.request.url);

  if (isDisabled || url.pathname === `/${ourBackendEndpoint}`) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    (async () => {
      if (client) {
        // wait for at least the first build so that there is an index.html
        // to render for the app.
        await finishedBuild;
      }

      let stack: Handler[] = [handleTestRequest, handleBuildRequest];
      let response: Response | undefined;
      let context = { fs, webroot, origin };
      for (let handler of stack) {
        response = await handler(event.request, context);
        if (response) {
          return response;
        }
      }

      return new Response("Not Found", { status: 404 });
    })()
  );
});

// Check to make sure that our backend is _really_ ours. Otherwise unregister
// this service worker so it doesnt get in the way of non catalogjs web apps.
async function checkForOurBackend() {
  while (true) {
    let status;
    try {
      status = (await fetch(`${worker.origin}/${ourBackendEndpoint}`)).status;
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
