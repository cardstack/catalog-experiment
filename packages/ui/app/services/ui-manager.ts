import Service from "@ember/service";
import { Event } from "builder-worker/src/event";
import {
  Ready,
  Show,
  Hide,
  Home,
  eventGroup as group,
} from "builder-worker/src/ui-manager";

export default class UIManagerService extends Service {
  constructor(...args: any[]) {
    super(...args);

    let readyEvent: Event<Ready> = {
      group,
      args: {
        type: "ready",
        width: 700,
      },
    };
    window.parent.postMessage(readyEvent, "*");
  }

  // TODO eliminate the need to call show and hide, and rather just monitor the
  // iframe dimensions and inform the parent when the dimensions change.
  show() {
    let showEvent: Event<Show> = {
      group,
      args: { type: "show" },
    };
    window.parent.postMessage(showEvent, "*");
  }

  hide() {
    let hideEvent: Event<Hide> = { group, args: { type: "hide" } };
    window.parent.postMessage(hideEvent, "*");
  }

  home() {
    let homeEvent: Event<Home> = { group, args: { type: "home" } };
    window.parent.postMessage(homeEvent, "*");
  }
}
