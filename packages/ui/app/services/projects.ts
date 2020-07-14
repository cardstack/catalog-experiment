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
    // there is a certain amount of time required for the service worker to
    // mount the filesystem, until then there is no guarantee that the service
    // worker is ready to start handling requests (the ability to register
    // ourselves to be able to recieve message from the service worker is also
    // bound up in this wait time). Just poll the service worker until we get a
    // non-404 response.
    let response: Response | undefined;
    while (!response || !response.ok) {
      response = yield fetch("/projects");
    }
    return yield response.json();
  }).drop() as any;

  start = task(function* (
    this: ProjectsService,
    projectRoots: [string, string][]
  ) {
    yield this.initialize.lastPerformed;

    // TODO tell the service worker which app to load...

    // doing this instead of reloading as we shouldn't assume what the current
    // location is. This will load the selected projects.
    window.location.href = window.location.origin;
  }).restartable();
}
