import Service from "@ember/service";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import UIManagerService from "./ui-manager";
import {
  Event as FileDaemonEvent,
  FilesChangedEvent,
} from "../../../builder-worker/src/file-daemon-client";
//@ts-ignore
import { task, timeout } from "ember-concurrency";
import { assertNever } from "shared/util";

export default class FileDaemonClientService extends Service {
  @service uiManager!: UIManagerService;
  @tracked connected = false;
  @tracked isSyncing = false;
  @tracked syncedFiles: string[] = [];
  @tracked lastChange?: FilesChangedEvent;

  constructor(...args: any[]) {
    super(...args);

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (!isFileDaemonClientEvent(event.data)) {
        return;
      }
      let clientEvent = event.data.clientEvent;
      this.handleEvent.perform(clientEvent);
    });
    this.register.perform();
  }

  @task(function* () {
    yield fetch("/register-client");
  })
  register: any;

  @(task(function* (this: FileDaemonClientService, event: FileDaemonEvent) {
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
  }).drop())
  handleEvent: any;
}

interface FileDaemonClientEvent {
  kind: "file-daemon-client-event";
  clientEvent: FileDaemonEvent;
}

function isFileDaemonClientEvent(data: any): data is FileDaemonClientEvent {
  return "kind" in data && data.kind === "file-daemon-client-event";
}
