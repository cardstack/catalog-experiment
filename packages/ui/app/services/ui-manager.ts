import Service from "@ember/service";

interface Ready {
  type: "ready";
  width: number;
}

interface Show {
  type: "show";
}

interface Hide {
  type: "hide";
}

export type UIManagerCommands = Ready | Show | Hide;

export default class UIManagerService extends Service {
  constructor(...args: any[]) {
    super(...args);

    let ready: Ready = {
      type: "ready",
      width: 300,
    };
    window.parent.postMessage(ready, "*");

    setTimeout(() => this.show(), 3000);
  }

  show() {
    let show: Show = { type: "show" };
    window.parent.postMessage(show, "*");
  }

  hide() {
    let hide: Hide = { type: "hide" };
    window.parent.postMessage(hide, "*");
  }
}
