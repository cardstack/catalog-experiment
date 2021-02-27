import {
  FileDaemonClientVolume,
  defaultWebsocketURL,
  FileDaemonClientDriver,
} from "../../file-daemon-client/src/index";
import { FileSystem } from "./filesystem";
import { addEventListener, dispatchEvent } from "./event-bus";
import { debug, log, error, Logger } from "./logger";
import { handleFile } from "./request-handlers/file-request-handler";
import { handleClientRegister } from "./request-handlers/client-register-handler";
import { handleLogLevel } from "./request-handlers/log-level-handler";
import { handleBuilderRestart } from "./request-handlers/builder-restart-handler";
import { ClientEventHandler } from "./client-event-handler";
import { Handler } from "./request-handlers/request-handler";
import { HttpFileSystemDriver } from "./filesystem-drivers/http-driver";
import { BuildManager } from "./build-manager";
import { handleListing } from "./request-handlers/project-listing-handler";
import { handleBuild } from "./request-handlers/run-build-handler";
import { explainAsDot } from "./builder";
import { catalogjsHref } from "./resolver";
import { recipesURL } from "./recipes";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const fs = new FileSystem();
const originURL = new URL(worker.origin);
const uiURL = new URL("catalogjs/ui/", originURL);
const githubRecipesURL = new URL(
  "https://raw.githubusercontent.com/cardstack/catalog-experiment/master/packages/recipes/recipes/"
);
const registryURL = new URL(catalogjsHref);
const localRecipesURL = new URL("https://local-disk/recipes/");
const localRegistryURL = new URL(
  `${originURL.protocol}//${originURL.hostname}:${parseInt(originURL.port) + 1}`
);

let websocketURL: URL;
let isDisabled = false;
let volume: FileDaemonClientVolume | undefined;
let eventHandler: ClientEventHandler;
let buildManager: BuildManager;
let activated: () => void;
let activating: Promise<void>;

Logger.echoInConsole(true);
Logger.setLogLevel("info");
console.log(`service worker evaluated`);

worker.addEventListener("install", () => {
  activating = new Promise<void>((res) => (activated = res));
  eventHandler = new ClientEventHandler();
  addEventListener(eventHandler.handleEvent.bind(eventHandler));
  dispatchEvent({ uiManager: { type: "home" } });

  log(`Installing service worker`);
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
  let recipesDriver = new HttpFileSystemDriver(githubRecipesURL);
  let clientDriver = new FileDaemonClientDriver(originURL, websocketURL);
  let [, clientVolume] = await Promise.all([
    fs.mount(new URL(`/catalogjs/ui/`, originURL), uiDriver),
    fs.mount(new URL("https://local-disk/"), clientDriver),
    fs.mount(recipesURL, recipesDriver),
  ]);

  let useLocalRegistry: boolean;
  try {
    let response = await fetch(`${localRegistryURL.href}alive`);
    useLocalRegistry = response.ok;
  } catch (e) {
    useLocalRegistry = false;
  }

  if (useLocalRegistry) {
    let registryDriver = new HttpFileSystemDriver(localRegistryURL);
    await fs.mount(registryURL, registryDriver);
  } else {
    let registryDriver = new HttpFileSystemDriver(registryURL);
    await fs.mount(registryURL, registryDriver);
  }

  let useLocalRecipes = false;
  try {
    await fs.openDirectory(localRecipesURL);
    useLocalRecipes = true;
  } catch (e) {
    if (e.code !== "NOT_FOUND") {
      throw e;
    }
  }

  // TODO refactor how we handle client volumes events such that we don't need
  // to get a handle on the "Volume" instance. Consider writing a file for the
  // connected and sync events in a special folder that we can monitor.
  volume = clientVolume as FileDaemonClientVolume;

  // For now the recipes live at http://local-disk/recipes/ (which we have
  // included in our file daemon start script for the test-app). Eventually
  // we'll want to point to a CDN that is serving the recipes (and to optionally
  // point the recipes that you are actively developing - ?). Or maybe this URL
  // is something you can specify in the UI?
  buildManager = new BuildManager(
    fs,
    useLocalRecipes ? localRecipesURL : recipesURL,
    undefined,
    () => {
      if (Logger.getInstance().logLevel === "debug") {
        let dot = explainAsDot(buildManager.rebuilder!.explain());
        debug(dot);
      }
    }
  );
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
          handleBuild(buildManager),
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
// this service worker so it doesn't get in the way of non catalogjs web apps.
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
        "some other server is running instead of the file daemon, un-registering this service worker."
      );
      isDisabled = true;
      await worker.registration.unregister();
      break;
    } else {
      await new Promise<void>((res) => setTimeout(() => res(), 10 * 1000));
    }
  }
}
