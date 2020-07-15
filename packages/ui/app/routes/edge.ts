import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import FileDaemonClientService from "ui/services/file-daemon-client";
import UIManagerService from "ui/services/ui-manager";
import LoggerService from "ui/services/logger";
import EventRegistrarService from "ui/services/event-registrar";

export default class CatalogJsUI extends Route {
  @service eventRegistrar!: EventRegistrarService;
  @service uiManager!: UIManagerService;
  @service logger!: LoggerService;
  @service fileDaemonClient!: FileDaemonClientService;

  async beforeModel() {
    this.fileDaemonClient.startListening();
    this.logger.startListening();

    // this will start the flow of events from the service worker
    await this.eventRegistrar.register.perform();

    // do all the rest of the async in parallel
    await Promise.all([this.logger.start.perform()]);
  }
}
