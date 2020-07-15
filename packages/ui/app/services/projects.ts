import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
// @ts-ignore
import { task, timeout } from "ember-concurrency";

interface Projects {
  activeProjects: [string, string][];
  availableProjects: string[];
}

export default class ProjectsService extends Service {
  @tracked listing: Projects | undefined;
  initialize = task(function* (this: ProjectsService) {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      });
      yield this.waitForActivation.perform(yield navigator.serviceWorker.ready);
    }
    this.listing = yield (yield fetch("/projects")).json();
  });

  // EC waitForProperty() doesn't seem to work when checking the serviceWorker's
  // state, so doing it manually...
  waitForActivation = task(function* (registration: ServiceWorkerRegistration) {
    let state: string | undefined;
    while (state !== "activated") {
      yield timeout(100);
      state = registration.active?.state;
    }
  }).drop() as any;

  start = task(function* (this: ProjectsService, projects: [string, string][]) {
    yield this.initialize.lastPerformed;

    yield fetch("/projects", {
      method: "POST",
      body: JSON.stringify(projects),
    });

    // doing this instead of reloading as we shouldn't assume what the current
    // location is. This will load the selected projects.
    window.location.href = window.location.origin;
  }).restartable();
}
