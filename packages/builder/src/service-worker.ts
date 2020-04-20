import { FileDaemonClient, origin } from "./file-daemon-client";
import { FileSystem } from "./filesystem";
import { handleTestRequest, testOrigin } from "./test-request-handler";
import { handleBuildRequest } from "./build-request-handler";
import { Handler } from "./request-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const websocketURL = "ws://localhost:3000";
let webroot: string;
let isDisabled = false;

console.log("service worker evaluated");

interface Options {
  test?: true;
}

export function start(opts: Options = {}) {
  let client: FileDaemonClient | undefined;

  if (opts.test) {
    console.log("starting service worker in test mode");
    (self as any).testMode = true;
    webroot = "/";

    (async () => {
      await checkForOurBackend(testOrigin);
    })();
  } else {
    console.log("starting service worker in normal mode");
    webroot = "/webroot";
    client = new FileDaemonClient(origin, websocketURL, fs, webroot);

    (async () => {
      await checkForOurBackend(origin);
    })();
  }

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

    if (
      url.origin !== worker.origin ||
      isDisabled ||
      url.pathname === "/__alive__"
    ) {
      if (isDisabled) {
        console.log(
          `service worker is disabled, ignoring ${event.request.url}`
        );
      } else {
        console.log(`ignore ${event.request.url} based on origin`);
      }
      event.respondWith(fetch(event.request));
      return;
    }

    event.respondWith(
      (async () => {
        if (client) {
          await client.ready;
        }

        let stack: Handler[] = [handleTestRequest, handleBuildRequest];
        let response: Response | undefined;
        let context = { fs, webroot };
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
}

// Check to make sure that our backend is _really_ ours. Otherwise unregister
// this service worker so it doesnt get in the way of non catalogjs web apps.
async function checkForOurBackend(alivenessOrigin: string) {
  while (true) {
    let status;
    try {
      status = (await fetch(`${alivenessOrigin}/__alive__`)).status;
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
