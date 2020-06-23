import { BuilderNode, Value } from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { combineModules } from "../combine-modules";
import { NamespaceMarker } from "../describe-module";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: [URL, URL][]) {}

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
      // place the bundles in the first project's output, under dist.
      let bundleURL = new URL(`./dist/${index}.js`, this.projectRoots[0][1]);
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
      value: combineModules(this.bundle, this.assignments).code,
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

    for (let source of assignment.module.desc.names.values()) {
      if (source.type !== "import") {
        continue;
      }
      let depResolution = assignment.module.resolvedImports[source.importIndex];
      let depAssignment = assignments.get(depResolution.url.href);
      if (depAssignment) {
        // already assigned
        if (depAssignment.bundleURL.href !== assignment.bundleURL.href) {
          // already assigned to another bundle, so the name must be exposed
          ensureExposed(source.name, depAssignment);
        }
      } else {
        let a = {
          bundleURL: assignment.bundleURL,
          module: depResolution,
          exposedNames: new Map(),
        };
        assignments.set(a.module.url.href, a);
        queue.push(a);
      }
    }

    for (let dep of assignment.module.resolvedImports) {
      if (!assignments.get(dep.url.href)) {
        let a = {
          bundleURL: assignment.bundleURL,
          module: dep,
          exposedNames: new Map(),
        };
        assignments.set(dep.url.href, a);
        queue.push(a);
      }
    }
  }
}

function ensureExposed(
  exported: string | NamespaceMarker,
  assignment: BundleAssignment
) {
  if (!assignment.exposedNames.has(exported)) {
    assignment.exposedNames.set(
      exported,
      defaultName(exported, assignment.module)
    );
  }
}

function defaultName(
  exported: string | NamespaceMarker,
  module: ModuleResolution
): string {
  if (typeof exported === "string") {
    return exported;
  }
  let match = /([a-zA-Z]\w+)(?:\.[jt]s)?$/i.exec(module.url.href);
  if (match) {
    return match[1];
  }
  return "a";
}
