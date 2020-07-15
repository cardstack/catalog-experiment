import {
  FileDaemonClientVolume,
  defaultWebsocketURL,
  FileDaemonClientDriver,
} from "../../file-daemon-client/src/index";
import { FileSystem } from "./filesystem";
import { addEventListener } from "./event-bus";
import { log, error } from "./logger";
import { handleFileRequest } from "./request-handlers/file-request-handler";
import { handleClientRegister } from "./request-handlers/client-register-handler";
import { handleLogLevelRequest } from "./request-handlers/log-level-handler";
import { handleBuilderRestartRequest } from "./request-handlers/builder-restart-handler";
import { ClientEventHandler } from "./client-event-handler";
import { Handler } from "./request-handlers/request-handler";
import { HttpFileSystemDriver } from "./filesystem-drivers/http-driver";
import { BuildManager } from "./build-manager";
import { handleListingRequest } from "./request-handlers/project-listing-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const uiURL = new URL("http://localhost:4300/catalogjs/ui/");

let websocketURL: URL;
let isDisabled = false;
let volume: FileDaemonClientVolume | undefined;
let eventHandler: ClientEventHandler;
let originURL = new URL(worker.origin);

// TODO this should be set from the app
let projects: [URL, URL][] = [
  [
    new URL("https://local-disk/test-app/"),
    new URL(`${originURL.href}test-app/`),
  ],
  [
    new URL("https://local-disk/test-lib/"),
    new URL(`${originURL.href}test-lib/`),
  ],
];

let buildManager: BuildManager;
let activated: () => void;
let activating: Promise<void>;

console.log(`service worker evaluated`);

worker.addEventListener("install", () => {
  activating = new Promise<void>((res) => (activated = res));
  eventHandler = new ClientEventHandler();
  addEventListener(eventHandler.handleEvent.bind(eventHandler));

  log(`installing`);
  websocketURL = new URL(defaultWebsocketURL);

  // force moving on to activation even if another service worker had control
  worker.skipWaiting();
});

worker.addEventListener("activate", () => {
  log(
    `service worker activated for origin: ${worker.origin}, websocket URL: ${websocketURL}`
  );

  // takes over when there is *no* existing service worker
  worker.clients.claim();

  activate();
});

async function activate() {
  let uiDriver = new HttpFileSystemDriver(uiURL);
  let clientDriver = new FileDaemonClientDriver(originURL, websocketURL);
  let [, clientVolume] = await Promise.all([
    fs.mount(new URL(`/catalogjs/ui/`, originURL), uiDriver),
    fs.mount(new URL("https://local-disk/"), clientDriver),
  ]);
  // TODO refactor how we handle client volumes events shuch that we don't need
  // to get a handle on the "Volume" instance. Consider writing a file for the
  // connected and sync events in a special folder that we can monitor.
  volume = clientVolume as FileDaemonClientVolume;

  buildManager = new BuildManager(fs, projects);
  await buildManager.rebuilder.start();
  await buildManager.rebuilder.isIdle();
  await fs.displayListing();
  activated();
}

worker.addEventListener("fetch", (event: FetchEvent) => {
  let url = new URL(event.request.url);

  if (isDisabled || url.pathname === `/catalogjs/alive`) {
    event.respondWith(fetch(event.request));
    return;
  }

  // TODO we are getting 404's when we try to ask for the /projects too soon.
  // presumably we should be awaiting the file daemon client's mount before we
  // serve the /project. perhaps the 404 is happening because the service worker
  // hasn't spun up yet and the browser is trying to actually talk to the
  // outside world?

  event.respondWith(
    (async () => {
      try {
        await activating;
        if (!volume) {
          throw new Error(`bug: the FileDaemonClientVolume is unavailable`);
        }
        await buildManager.rebuilder.isIdle();

        let stack: Handler[] = [
          handleClientRegister(eventHandler, volume),
          handleListingRequest(fs, buildManager),
          handleBuilderRestartRequest(buildManager),
          handleLogLevelRequest(),
          handleFileRequest(fs, buildManager),
        ];
        let response: Response | undefined;
        for (let handler of stack) {
          response = await handler(event);
          if (response) {
            return response;
          }
        }
      } catch (err) {
        error(`An unhandled error occurred`, err);
      }
      return new Response("Not Found", { status: 404 });
    })()
  );
});

(async () => {
  checkForOurBackend();
})();

// Check to make sure that our backend is _really_ ours. Otherwise unregister
// this service worker so it doesnt get in the way of non catalogjs web apps.
async function checkForOurBackend() {
  while (true) {
    let status;
    try {
      status = (await fetch(`${worker.origin}/catalogjs/alive`)).status;
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
