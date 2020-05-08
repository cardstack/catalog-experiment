import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import UIManagerService from "../services/ui-manager";

export default class CloseButton extends Component {
  @service uiManager!: UIManagerService;

  @action
  close() {
    this.uiManager.hide();
  }
}
