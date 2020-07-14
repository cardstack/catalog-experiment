import Service from "@ember/service";
// @ts-ignore
import { task } from "ember-concurrency";

export default class ProjectService extends Service {
  constructor(...args: any[]) {
    super(...args);

    this.initialize.perform();
  }

  initialize = task(function* () {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      });
      yield navigator.serviceWorker.ready;
    }
  });

  start = task(function* (this: ProjectService, projectURL: URL) {
    yield this.initialize.lastPerformed;

    // TODO tell the service worker which app to load...

    // Render the edge UI and respond to window positioning requests
    window.location.reload();
  }).restartable();
}
