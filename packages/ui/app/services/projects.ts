import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
// @ts-ignore
import { task, race, timeout } from "ember-concurrency";

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
      yield navigator.serviceWorker.ready;
    }
    let projects = yield race([timeout(10000), this.getProjects.perform()]) as
      | Projects
      | undefined;
    if (!projects) {
      throw new Error(
        `timed-out while waiting for service worker to provide projects information`
      );
    }
    console.log("projects", projects);
    this.listing = projects;
  });

  getProjects = task(function* () {
    // looks like we are talking to the outside work and not the service worker
    // at startup (the initialize() task should be preventing that from
    // happening....) Adding a poll the service worker until we get a non-404
    // response for the time being.
    let response: Response | undefined;
    while (!response || !response.ok) {
      response = yield fetch("/projects");
    }
    return yield response.json();
  }).drop() as any;

  start = task(function* (
    this: ProjectsService,
    _projectRoots: [string, string][]
  ) {
    yield this.initialize.lastPerformed;

    // TODO tell the service worker which app to load...

    // doing this instead of reloading as we shouldn't assume what the current
    // location is. This will load the selected projects.
    window.location.href = window.location.origin;
  }).restartable();
}
