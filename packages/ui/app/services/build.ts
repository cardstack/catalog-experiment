import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
// @ts-ignore
import { task, timeout } from "ember-concurrency";

interface Projects {
  activeProjects: [string, string][];
  availableProjects: string[];
}

export default class BuildService extends Service {
  @tracked listing: Projects | undefined;
  @tracked assigner: string = "maximum";
  initialize = task(function* (this: BuildService) {
    // we're using local storage here because we need to communicate this local
    // state across different ember app instances
    this.assigner = localStorage.getItem("assigner") ?? this.assigner;
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

  start = task(function* (
    this: BuildService,
    projects: [string, string][],
    assigner: string
  ) {
    localStorage.setItem("assigner", assigner);
    this.assigner = assigner;
    yield this.initialize.lastPerformed;

    let response = yield fetch("/build", {
      method: "POST",
      body: JSON.stringify({ projects, assigner }),
    });

    if (response.status !== 200) {
      alert("oh no");
      return;
    }

    // doing this instead of reloading as we shouldn't assume what the current
    // location is. This will load the selected projects.
    window.location.href = window.location.origin;
  }).restartable();
}
