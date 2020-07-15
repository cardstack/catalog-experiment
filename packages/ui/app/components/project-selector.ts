import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import ProjectsService from "../services/projects";
import { baseName } from "../helpers/base-name";

export default class Dashboard extends Component {
  defaultOrigin = location.origin;
  @service projects!: ProjectsService;
  @tracked selectedProjects: [string, string][] = [];

  get availableProjects() {
    return this.projects.listing?.availableProjects;
  }
  get activeProjects() {
    return this.projects.listing?.activeProjects;
  }

  startSelectedProject() {
    this.projects.start.perform([
      [new URL("http://local-disk/test-app/"), new URL(location.origin)],
    ]);
  }

  @action
  toggleProject(projectInput: string) {
    if (hasInputURL(projectInput, this.selectedProjects)) {
      this.selectedProjects = this.selectedProjects.filter(
        ([input]) => input !== projectInput
      );
    } else {
      this.selectedProjects.push([
        projectInput,
        `${location.origin}/${baseName(projectInput)}/`,
      ]);
    }
  }

  @action
  setProjectOutput(projectInput: string, projectOutput: string) {
    let project = getProject(projectInput, this.selectedProjects);
    if (project) {
      project[1] = projectOutput;
      this.selectedProjects = this.selectedProjects; // eslint-disable-line no-self-assign
    }
  }
}

function getProject(
  projectInput: string,
  projectRoots: [string, string][]
): [string, string] | undefined {
  return projectRoots.find(([input]) => input === projectInput);
}

function hasInputURL(url: string, projectRoots: [string, string][]): boolean {
  return Boolean(getProject(url, projectRoots));
}
