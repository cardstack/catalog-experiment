import ApplicationInstance from "@ember/application/instance";

export function initialize(appInstance: ApplicationInstance) {
  appInstance.lookup("service:ui-manager");
}

export default {
  initialize,
};
