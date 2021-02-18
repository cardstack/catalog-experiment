import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import BuildService from "ui/services/build";

export default class CatalogJsUI extends Route {
  @service build!: BuildService;

  async beforeModel() {
    this.build.initialize.perform();
  }
}
