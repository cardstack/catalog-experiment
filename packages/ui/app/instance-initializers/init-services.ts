import ApplicationInstance from "@ember/application/instance";

export function initialize(appInstance: ApplicationInstance) {
  appInstance.lookup("service:ui-manager");
  appInstance.lookup("service:file-daemon-client");
}

export default {
  initialize,
};
