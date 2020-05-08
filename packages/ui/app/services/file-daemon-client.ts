import Service from "@ember/service";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import UIManagerService from "./ui-manager";
import {
  Event as FileDaemonEvent,
  FilesChangedEvent,
} from "../../../builder-worker/src/file-daemon-client";
import { assertNever } from "shared/util";

export default class FileDaemonClientService extends Service {
  @service uiManager!: UIManagerService;
  @tracked connected = false;
  @tracked isSyncing = false;
  @tracked syncedFiles: string[] = [];
  @tracked lastChange?: FilesChangedEvent;

  resetLastChange?: any;
  resetSyncedFiles?: any;

  constructor(...args: any[]) {
    super(...args);

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (!isFileDaemonClientEvent(event.data)) {
        return;
      }
      let clientEvent = event.data.clientEvent;
      this.handleEvent(clientEvent);
    });
    (async () => {
      await fetch("/register-client");
    })();
  }

  handleEvent(event: FileDaemonEvent) {
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
        clearTimeout(this.resetSyncedFiles);
        this.syncedFiles = event.files;
        this.uiManager.show();
        this.resetSyncedFiles = setTimeout(() => {
          this.syncedFiles = [];
        }, 10000);
        break;
      case "files-changed":
        clearTimeout(this.resetLastChange);
        this.lastChange = event;
        this.uiManager.show();
        this.resetLastChange = setTimeout(() => {
          this.lastChange = undefined;
        }, 10000);
        break;
      default:
        assertNever(event);
    }
  }
}

interface FileDaemonClientEvent {
  kind: "file-daemon-client-event";
  clientEvent: FileDaemonEvent;
}

function isFileDaemonClientEvent(data: any): data is FileDaemonClientEvent {
  return "kind" in data && data.kind === "file-daemon-client-event";
}
