import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import FileDaemonClientService from "../services/file-daemon-client";
import LoggerService from "ui/services/logger";
import { action } from "@ember/object";

export default class Dashboard extends Component {
  @service fileDaemonClient!: FileDaemonClientService;
  @service logger!: LoggerService;

  @action
  setScrollPosition() {
    let containerEl = document.querySelector(".log-container");
    if (containerEl) {
      containerEl.scrollTop = containerEl.scrollHeight;
    }
  }
}
