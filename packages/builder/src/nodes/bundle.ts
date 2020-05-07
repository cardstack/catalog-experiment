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
    let assignments = new Map();
    for (let [index, module] of resolutions.entries()) {
      let bundleURL = new URL(`/dist/${index}.js`, resolutions[0].url.origin);
      assignments.set(module.url.href, {
        bundleURL,
        module,
        exposedNames: new Map(),
      });
    }
    expandAssignments(assignments, [...assignments.values()]);
    return {
      value: [...assignments.values()],
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

export function expandAssignments(
  assignments: Map<string, BundleAssignment>,
  queue: BundleAssignment[]
) {
  while (queue.length > 0) {
    let assignment = queue.shift()!;
    for (let dependency of Object.values(assignment.module.imports)) {
      if (!assignments.has(dependency.resolution.url.href)) {
        let a = {
          bundleURL: assignment.bundleURL,
          module: dependency.resolution,
          exposedNames: new Map(),
        };
        assignments.set(a.module.url.href, a);
        queue.push(a);
      }
    }
  }
}
