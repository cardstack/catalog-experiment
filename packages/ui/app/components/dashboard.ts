import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import FileDaemonClientService from "../services/file-daemon-client";

export default class Dashboard extends Component {
  @service fileDaemonClient!: FileDaemonClientService;
}
