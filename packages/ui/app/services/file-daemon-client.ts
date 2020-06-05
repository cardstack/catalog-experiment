import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import UIManagerService from "./ui-manager";
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
      if (!isFileDaemonEvent(event.data)) {
        return;
      }
      let clientEvent = event.data.clientEvent;
      this.handleEvent.perform(clientEvent);
    });
    this.register.perform();
  }

  register = task(function* () {
    yield fetch("/register-client/fs");
  });

  handleEvent = task(function* (
    this: FileDaemonClientService,
    event: FileDaemonEvent["clientEvent"]
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
        this.syncedFiles = event.args.files;
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

// TODO need to rework these into the builder-worker
interface FileDaemonEvent {
  kind: "fs";
  clientEvent:
    | ConnectedEvent
    | DisconnectedEvent
    | SyncStartedEvent
    | SyncCompleteEvent
    | FilesChangedEvent;
}

interface BaseEvent {
  category: "file-daemon-client";
}

interface ConnectedEvent extends BaseEvent {
  type: "connected";
}
interface DisconnectedEvent extends BaseEvent {
  type: "disconnected";
}
interface SyncStartedEvent extends BaseEvent {
  type: "sync-started";
}

interface FilesChangedEvent extends BaseEvent {
  type: "files-changed";
  args: {
    modified: string[];
    removed: string[];
  };
}

interface SyncCompleteEvent extends BaseEvent {
  type: "sync-finished";
  args: {
    files: string[];
  };
}

function isFileDaemonEvent(data: any): data is FileDaemonEvent {
  return (
    "kind" in data &&
    "clientEvent" in data &&
    "category" in data.clientEvent &&
    data.kind === "fs" &&
    data.clientEvent.category === "file-daemon-client"
  );
}
