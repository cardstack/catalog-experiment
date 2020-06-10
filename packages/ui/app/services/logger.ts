import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
// @ts-ignore
import { task } from "ember-concurrency";
import {
  LogMessage,
  isLogMessagesEvent,
  LogLevel,
} from "builder-worker/src/logger";

export default class LoggerService extends Service {
  @tracked messages: LogMessage[] = [];
  @tracked logLevel: LogLevel = "debug";

  startListening() {
    navigator.serviceWorker.addEventListener("message", (event) => {
      let { data } = event;
      if (isLogMessagesEvent(data)) {
        let newMessages = data.args;
        this.messages = [...this.messages, ...newMessages];
      }
    });
  }

  start = task(function* (this: LoggerService) {
    yield fetch(`/log-level/${this.logLevel}`);
  });
}
