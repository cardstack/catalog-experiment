import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import UIManagerService from "./ui-manager";
//@ts-ignore
import { task, timeout } from "ember-concurrency";
import { assertNever } from "shared/util";
import {
  FilesChangedEvent,
  isFileDaemonEvent,
  FileDaemonClientEvent,
} from "builder-worker/src/filesystem-drivers/file-daemon-client-driver";

export default class FileDaemonClientService extends Service {
  @service uiManager!: UIManagerService;
  @tracked connected = false;
  @tracked isSyncing = false;
  @tracked syncedFiles: string[] = [];
  @tracked lastChange?: FilesChangedEvent;

  startListening() {
    navigator.serviceWorker.addEventListener("message", (event) => {
      let { data } = event;
      if (isFileDaemonEvent(data)) {
        this.handleEvent.perform(data.args);
      }
    });
  }

  handleEvent = task(function* (
    this: FileDaemonClientService,
    event: FileDaemonClientEvent
  ) {
    switch (event.type) {
      case "connected":
        if (!this.connected) {
          this.uiManager.show();
        }
        this.connected = true;
        break;
      case "disconnected":
        if (this.connected) {
          this.uiManager.show();
        }
        this.connected = false;
        break;
      case "sync-started":
        this.isSyncing = true;
        this.uiManager.show();
        break;
      case "sync-finished":
        this.isSyncing = false;
        this.syncedFiles = event.files;
        this.uiManager.show();
        yield timeout(10000);
        this.syncedFiles = [];
        break;
      case "files-changed":
        this.lastChange = event;
        this.uiManager.show();
        yield timeout(10000);
        this.lastChange = undefined;
        break;
      default:
        assertNever(event);
    }
  }).drop();
}
