// Typescript doesn't really deal with multiple contexts (main thread vs worker)
// in one project. Most of this project is worker context, but this file is main
// thread context.

import { assertNever } from "shared/util";

let uiWidth: number;

if (!navigator.serviceWorker.controller) {
  // first load
  navigator.serviceWorker.register("/service-worker.js", {
    scope: "/",
  });
  console.log("Waiting for service worker");
  navigator.serviceWorker.ready.then(() => {
    window.location.reload();
  });
} else {
  // Render the CatalogJS UI and respond to window positioning requests
  let iframe = document.createElement("iframe");
  iframe.setAttribute("src", `${window.origin}/catalogjs-ui/`);
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
  document.body.append(iframe);
  window.addEventListener("message", handleUICommand, false);
}

function handleUICommand(event: MessageEvent) {
  if (event.origin !== window.origin) {
    return;
  }
  console.log("received command from UI", event.data);
  let command = event.data;
  if (!isUIManagerCommand(command)) {
    return;
  }
  let iframe = document.getElementById("catalogjs-ui");
  if (!iframe) {
    throw new Error("bug: cannot find the catalogjs ui iframe");
  }

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
    default:
      assertNever(command);
  }
}

// TODO this should all be imported from the ui package
interface BaseUIManagerCommand {
  kind: "ui-manager";
}

interface Ready extends BaseUIManagerCommand {
  type: "ready";
  width: number;
}

interface Show extends BaseUIManagerCommand {
  type: "show";
}

interface Hide extends BaseUIManagerCommand {
  type: "hide";
}

type UIManagerCommand = Ready | Show | Hide;
function isUIManagerCommand(data: any): data is UIManagerCommand {
  return "kind" in data && data.kind === "ui-manager";
}
