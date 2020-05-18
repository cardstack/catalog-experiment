import Application from "@ember/application";
import Resolver from "ember-resolver";
import config from "./config/environment";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

// Note that I removed the loadInitializers dep from this project. It was
// failing TS type check due to its need to load types for @ember/engines. We
// have no initializers, so hopefully this is ok.

//loadInitializers(App, config.modulePrefix);
