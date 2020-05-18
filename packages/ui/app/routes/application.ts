import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import FileDaemonClientService from "ui/services/file-daemon-client";
import UIManagerService from "ui/services/ui-manager";

export default class ApplicationRoute extends Route {
  @service uiManager!: UIManagerService;
  @service fileDaemonClient!: FileDaemonClientService;

  async beforeModel() {
    await this.fileDaemonClient.register.last.finally();
  }
}
