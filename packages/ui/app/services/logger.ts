import Service, { inject as service } from "@ember/service";
import UIManagerService from "./ui-manager";
import { tracked } from "@glimmer/tracking";
// @ts-ignore
import { task } from "ember-concurrency";
import {
  LogMessage,
  isLogMessagesClientEvent,
  LogLevel,
} from "builder-worker/src/logger";

export default class LoggerService extends Service {
  @service uiManager!: UIManagerService;
  @tracked messages: LogMessage[] = [];
  @tracked logLevel: LogLevel = "debug";

  constructor(...args: any[]) {
    super(...args);

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (!isLogMessagesClientEvent(event.data)) {
        return;
      }
      let newMessages = event.data.clientEvent;
      this.messages = [...this.messages, ...newMessages];
    });
    this.register.perform();
  }

  register = task(function* (this: LoggerService) {
    yield fetch("/register-client/log-messages");
    yield fetch(`/log-level/${this.logLevel}`);
  });
}
