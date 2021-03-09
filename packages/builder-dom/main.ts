// Typescript doesn't really deal with multiple contexts (main thread vs worker)
// in one project. Most of this project is worker context, but this file is main
// thread context.

import { assertNever } from "@catalogjs/shared/util";
import { isUIManagerEvent } from "../builder-worker/src/ui-manager";
import { isReloadEvent } from "../builder-worker/src/client-reload";

let uiWidth: number;

function handleUICommand(event: MessageEvent) {
  if (event.origin !== window.origin) {
    return;
  }
  let { data } = event;
  if (isReloadEvent(data)) {
    window.location.reload();
    return;
  }

  if (isUIManagerEvent(data)) {
    let iframe = document.getElementById("catalogjs-ui");
    if (!iframe) {
      throw new Error("bug: cannot find the catalogjs ui iframe");
    }

    let { uiManager: command } = data;
    if (command) {
      switch (command.type) {
        case "ready":
          uiWidth = command.width;
          iframe.style.width = `${command.width}px`;
          iframe.style.right = `${-1 * command.width}px`;
          break;
        case "show":
          iframe.style.transform = `translate(${-1 * uiWidth}px, 0)`;
          break;
        case "hide":
          iframe.style.transform = `translate(0, 0)`;
          break;
        case "home":
          location.href = "/catalogjs/ui/";
          break;
        default:
          assertNever(command);
      }
    }
  }
}

// Note that the packages/ui ember app is responsible for the service worker
// initialization and activation. At this point the service worker has already
// been activated. The responsibility for this module is to render the ui's edge
// route in an iframe, add a build reload-page listener, and respond to window
// positioning requests.

if (navigator.serviceWorker.controller) {
  if (!document.getElementById("catalogjs-ui")) {
    window.addEventListener("message", handleUICommand, false);
    navigator.serviceWorker.addEventListener("message", handleUICommand);
    let iframe = document.createElement("iframe");
    iframe.setAttribute("src", `${window.origin}/catalogjs/ui/#/edge`);
    iframe.setAttribute("id", "catalogjs-ui");
    iframe.setAttribute(
      "style",
      `position: fixed;
     top: 0;
     bottom: 0;
     right: -100%;
     height: 100vh;
     border: none;
     transition: transform 300ms;
    `
    );
    if (!document.body) {
      document.body = document.createElement("body");
    }
    document.body.setAttribute("style", "overflow-x: hidden;");
    document.body.append(iframe);

    (async () => {
      await fetch("/register-client/reload");
    })();
  }
}
