import Service from "@ember/service";

import { Event as FileDaemonEvent } from "../../../builder/src/file-daemon-client";

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

export type UIManagerCommand = Ready | Show | Hide;

interface FileDaemonClientEvent {
  kind: "file-daemon-client-event";
  clientEvent: FileDaemonEvent;
}

export default class UIManagerService extends Service {
  constructor(...args: any[]) {
    super(...args);

    let ready: Ready = {
      kind: "ui-manager",
      type: "ready",
      width: 300,
    };
    window.parent.postMessage(ready, "*");
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (!isFileDaemonClientEvent(event.data)) {
        return;
      }
      console.log(
        `UI app received File Daemon Client Event: ${JSON.stringify(
          event.data.clientEvent,
          null,
          2
        )}`
      );
    });

    (async () => {
      await fetch("/register-client");
    })();

    setTimeout(() => this.show(), 1000);
  }

  show() {
    let show: Show = { kind: "ui-manager", type: "show" };
    window.parent.postMessage(show, "*");
  }

  hide() {
    let hide: Hide = { kind: "ui-manager", type: "hide" };
    window.parent.postMessage(hide, "*");
  }
}

function isFileDaemonClientEvent(data: any): data is FileDaemonClientEvent {
  return "kind" in data && data.kind === "file-daemon-client-event";
}
