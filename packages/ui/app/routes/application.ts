import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import FileDaemonClientService from "ui/services/file-daemon-client";
import UIManagerService from "ui/services/ui-manager";
import LoggerService from "ui/services/logger";

export default class ApplicationRoute extends Route {
  @service uiManager!: UIManagerService;
  @service logger!: LoggerService;
  @service fileDaemonClient!: FileDaemonClientService;

  async beforeModel() {
    await Promise.all([
      this.logger.register.last.finally(),
      this.fileDaemonClient.register.last.finally(),
    ]);
  }
}
