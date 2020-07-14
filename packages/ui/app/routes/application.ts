import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import ProjectsService from "ui/services/projects";

export default class CatalogJsUI extends Route {
  @service projects!: ProjectsService;

  async beforeModel() {
    this.projects.initialize.perform();
  }
}
