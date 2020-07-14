import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import ProjectService from "../services/project";

export default class Dashboard extends Component {
  @service project!: ProjectService;

  startSelectedProject() {
    this.project.start.perform(new URL("http://local-disk/test-app/"));
  }
}
