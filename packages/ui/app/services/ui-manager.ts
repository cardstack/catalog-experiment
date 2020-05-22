import Service from "@ember/service";

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

export default class UIManagerService extends Service {
  constructor(...args: any[]) {
    super(...args);

    let ready: Ready = {
      kind: "ui-manager",
      type: "ready",
      width: 700,
    };
    window.parent.postMessage(ready, "*");
  }

  // TODO eliminate the need to call show and hide, and rather just monitor the
  // iframe dimensions and inform the parent when the dimensions change.
  show() {
    let show: Show = { kind: "ui-manager", type: "show" };
    window.parent.postMessage(show, "*");
  }

  hide() {
    let hide: Hide = { kind: "ui-manager", type: "hide" };
    window.parent.postMessage(hide, "*");
  }
}
