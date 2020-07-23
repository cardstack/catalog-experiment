import Service from "@ember/service";
import { Event } from "builder-worker/src/event";
import { UIManagerCommand } from "builder-worker/src/ui-manager";

export default class UIManagerService extends Service {
  constructor(...args: any[]) {
    super(...args);

    let readyEvent: Event = {
      uiManager: {
        type: "ready",
        width: 700,
      } as UIManagerCommand,
    };
    window.parent.postMessage(readyEvent, "*");
  }

  // TODO eliminate the need to call show and hide, and rather just monitor the
  // iframe dimensions and inform the parent when the dimensions change.
  show() {
    let showEvent: Event = {
      uiManager: { type: "show" },
    };
    window.parent.postMessage(showEvent, "*");
  }

  hide() {
    let hideEvent: Event = { uiManager: { type: "hide" } };
    window.parent.postMessage(hideEvent, "*");
  }

  home() {
    let homeEvent: Event = { uiManager: { type: "home" } };
    window.parent.postMessage(homeEvent, "*");
  }
}
