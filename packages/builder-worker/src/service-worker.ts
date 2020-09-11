import {
  FileDaemonClientVolume,
  defaultWebsocketURL,
  FileDaemonClientDriver,
} from "../../file-daemon-client/src/index";
import { FileSystem } from "./filesystem";
import { addEventListener } from "./event-bus";
import { log, error } from "./logger";
import { handleFile } from "./request-handlers/file-request-handler";
import { handleClientRegister } from "./request-handlers/client-register-handler";
import { handleLogLevel } from "./request-handlers/log-level-handler";
import { handleBuilderRestart } from "./request-handlers/builder-restart-handler";
import { ClientEventHandler } from "./client-event-handler";
import { Handler } from "./request-handlers/request-handler";
import { HttpFileSystemDriver } from "./filesystem-drivers/http-driver";
import { BuildManager } from "./build-manager";
import { handleListing } from "./request-handlers/project-listing-handler";
import { handleSetProjects } from "./request-handlers/set-projects-handler";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const uiURL = new URL("http://localhost:4300/catalogjs/ui/");

let websocketURL: URL;
let isDisabled = false;
let volume: FileDaemonClientVolume | undefined;
let eventHandler: ClientEventHandler;
let originURL = new URL(worker.origin);
let buildManager: BuildManager;
let activated: () => void;
let activating: Promise<void>;

console.log(`service worker evaluated`);

worker.addEventListener("install", () => {
  activating = new Promise<void>((res) => (activated = res));
  eventHandler = new ClientEventHandler();
  addEventListener(eventHandler.handleEvent.bind(eventHandler));

  log(`installing service worker`);
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
    // TODO need to mount recipes...
    fs.mount(new URL(`/catalogjs/ui/`, originURL), uiDriver),
    fs.mount(new URL("https://local-disk/"), clientDriver),
  ]);
  // TODO refactor how we handle client volumes events shuch that we don't need
  // to get a handle on the "Volume" instance. Consider writing a file for the
  // connected and sync events in a special folder that we can monitor.
  volume = clientVolume as FileDaemonClientVolume;

  buildManager = new BuildManager(fs);
  await fs.displayListing(log);
  activated();
}

worker.addEventListener("fetch", (event: FetchEvent) => {
  let url = new URL(event.request.url);
  if (isDisabled || url.pathname === `/catalogjs/alive`) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    (async () => {
      try {
        await activating;
        if (!volume) {
          throw new Error(`bug: the FileDaemonClientVolume is unavailable`);
        }
        await buildManager.isIdle();

        let stack: Handler[] = [
          handleClientRegister(eventHandler, volume),
          handleListing(fs, buildManager),
          handleSetProjects(buildManager),
          handleBuilderRestart(buildManager),
          handleLogLevel(),
          handleFile(fs, buildManager),
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
