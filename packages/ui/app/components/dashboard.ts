import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import FileDaemonClientService from "../services/file-daemon-client";
import LoggerService from "ui/services/logger";
import { action } from "@ember/object";
//@ts-ignore
import { task } from "ember-concurrency";
import UIManagerService from "ui/services/ui-manager";

export default class Dashboard extends Component {
  @service fileDaemonClient!: FileDaemonClientService;
  @service logger!: LoggerService;
  @service uiManager!: UIManagerService;

  restartBuilder = task(function* () {
    yield fetch(`/restart-builder`);
  }).drop();

  @action
  setScrollPosition() {
    let containerEl = document.querySelector(".log-container");
    if (containerEl) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }
  }

  @action
  restart() {
    this.restartBuilder.perform();
  }

  @action
  home() {
    this.uiManager.home();
  }
}
