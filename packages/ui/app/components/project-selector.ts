import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import BuildService from "../services/build";
import { baseName } from "../helpers/base-name";
// @ts-ignore
import { task } from "ember-concurrency";

export default class ProjectSelectorComponent extends Component {
  defaultOrigin = location.origin;
  @service build!: BuildService;
  @tracked selectedProjects: [string, string][] = [];
  @tracked selectedStrategy: string = "maximum";

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.initialize.perform();
  }

  initialize = task(function* (this: ProjectSelectorComponent) {
    yield this.build.initialize.last;
    this.selectedProjects = [...this.activeProjects!];
  }) as any;

  get availableProjects() {
    return this.build.listing?.availableProjects;
  }
  get activeProjects() {
    return this.build.listing?.activeProjects;
  }

  startSelectedProject() {
    this.build.start.perform(this.selectedProjects, this.selectedStrategy);
  }

  @action
  initStrategy(el: HTMLElement) {
    let input = el.querySelector(
      `.assigner .${this.selectedStrategy}-assigner`
    ) as HTMLInputElement;
    input.checked = true;
  }

  @action
  setStrategy(strategy: string) {
    this.selectedStrategy = strategy;
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
