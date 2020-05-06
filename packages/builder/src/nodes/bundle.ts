import { BuilderNode, Value } from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { combineModules } from "../combine-modules";
import { NamespaceMarker } from "../describe-module";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: URL[]) {}

  deps() {
    return { resolutions: new ModuleResolutionsNode(this.projectRoots) };
  }

  async run({
    resolutions,
  }: {
    resolutions: ModuleResolution[];
  }): Promise<Value<BundleAssignment[]>> {
    return {
      value: resolutions.map((module, index) => {
        let bundleURL = new URL(`/dist/${index}.js`, resolutions[0].url.origin);
        return {
          bundleURL,
          module,
          exposedNames: new Map(),
        };
      }),
    };
  }
}

export class BundleNode {
  cacheKey: BundleNode;
  constructor(private bundle: URL, private assignments: BundleAssignment[]) {
    this.cacheKey = this;
  }

  deps() {
    // right now BundleNode is entirely volatile and gets constructed with all
    // the info it needs, so it has no deps. But this means we aren't saving any
    // of its work in between rebuilds. We plan to make it cache better, which
    // justifies keeping BundleNode as a separate node.
    return null;
  }

  async run(): Promise<Value<string>> {
    return {
      value: combineModules(this.bundle, this.assignments),
    };
  }
}

export interface BundleAssignment {
  // which bundle are we in
  bundleURL: URL;

  // which module are we talking about
  module: ModuleResolution;

  // from name-as-originally exported to name-as-exposed-in-this-bundle, if any.
  // Not every export from every module will be publicly exposed by a bundle.
  exposedNames: Map<string | NamespaceMarker, string>;
}
