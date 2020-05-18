import { FileDaemonClient, defaultWebsocketURL } from "./file-daemon-client";
import { FileSystem } from "./filesystem";
import { handleFileRequest } from "./request-handlers/file-request-handler";
import { handleClientRegister } from "./request-handlers/client-register-handler";
import { FileDaemonEventHandler } from "./file-daemon-event-handler";
import { Handler } from "./request-handlers/request-handler";
import { Builder } from "./builder";
import { HttpFileSystemDriver } from "./filesystem-drivers/http-driver";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const ourBackendEndpoint = "__alive__";
const webroot: string = "/";
const uiOrigin = "http://localhost:4300";

let websocketURL: URL;
let isDisabled = false;
let finishedBuild: Promise<void>;
let client: FileDaemonClient | undefined;
let eventHandler = new FileDaemonEventHandler();

console.log(`service worker evaluated`);

worker.addEventListener("install", () => {
  console.log(`installing`);
  websocketURL = new URL(defaultWebsocketURL);

  // force moving on to activation even if another service worker had control
  worker.skipWaiting();
});

worker.addEventListener("activate", () => {
  console.log(
    `service worker activated for origin: ${worker.origin}, websocket URL: ${websocketURL}`
  );

  let originURL = new URL(worker.origin);
  // takes over when there is *no* existing service worker
  worker.clients.claim();

  client = new FileDaemonClient(originURL, websocketURL, fs, webroot);
  client.addEventListener(eventHandler.handleEvent.bind(eventHandler));

  // TODO watch for file changes and build when fs changes
  let builder = Builder.forProjects(fs, [originURL]);
  finishedBuild = (async () => {
    await client.ready;
    await builder.build();

    // TODO it's unclear that we can use a different origin for our UI--within
    // the iframe, even if it is being served from the filesystem, the browser
    // might not permit cross-origin serviceworker access. Right now the file
    // daemon client is clobbering the UI mount, so we are mounting after the
    // sync--but this is not ideal... WE should revisit this after we have
    // implemented a some kind of "layering" strategy (akin to docker) in our
    // file system.
    let uiDriver = new HttpFileSystemDriver(
      new URL(`${uiOrigin}/catalogjs-ui/`)
    );
    await fs.mount(new URL(`/catalogjs-ui`, originURL), uiDriver);

    console.log(`completed build, file system:`);
    await fs.displayListing();
  })();

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

        let stack: Handler[] = [handleClientRegister, handleFileRequest];
        let response: Response | undefined;
        let context = {
          fs,
          webroot,
          event,
          fileDaemonClient: client,
          fileDaemonEventHandler: eventHandler,
        };
        for (let handler of stack) {
          response = await handler(event.request, context);
          if (response) {
            return response;
          }
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