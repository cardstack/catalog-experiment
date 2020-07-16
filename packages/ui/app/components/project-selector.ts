import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import ProjectsService from "../services/projects";
import { baseName } from "../helpers/base-name";
// @ts-ignore
import { task } from "ember-concurrency";

export default class ProjectSelectorComponent extends Component {
  defaultOrigin = location.origin;
  @service projects!: ProjectsService;
  @tracked selectedProjects: [string, string][] = [];

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.initialize.perform();
  }

  initialize = task(function* (this: ProjectSelectorComponent) {
    yield this.projects.initialize.last;
    this.selectedProjects = [...this.activeProjects!];
  }) as any;

  get availableProjects() {
    return this.projects.listing?.availableProjects;
  }
  get activeProjects() {
    return this.projects.listing?.activeProjects;
  }

  startSelectedProject() {
    this.projects.start.perform(this.selectedProjects);
  }

  @action
  toggleProject(projectInput: string) {
    if (hasInputURL(projectInput, this.selectedProjects)) {
      this.selectedProjects = this.selectedProjects.filter(
        ([input]) => input !== projectInput
      );
    } else {
      let output: string;
      if (hasOutputURL(`${location.origin}/`, this.selectedProjects)) {
        output = `${location.origin}/${baseName(projectInput)}/`;
      } else {
        output = `${location.origin}/`;
      }
      this.selectedProjects = [
        ...this.selectedProjects,
        [projectInput, output],
      ];
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
function hasOutputURL(url: string, projectRoots: [string, string][]): boolean {
  return Boolean(projectRoots.find(([, output]) => output === url));
}