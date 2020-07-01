import {
  BuilderNode,
  Value,
  AllNode,
  NextNode,
  ConstantNode,
  annotationEnd,
  annotationStart,
} from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { combineModules } from "../combine-modules";
import { File } from "@babel/types";
import { NamespaceMarker, describeModule } from "../describe-module";
import {
  EntrypointsJSONNode,
  Entrypoint,
  JSEntrypoint,
  HTMLEntrypoint,
} from "./entrypoint";
import flatten from "lodash/flatten";
import { JSParseNode } from "./js";
import { encodeModuleDescription } from "../description-encoder";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: [URL, URL][]) {}

  deps() {
    return {
      entrypoints: new AllNode(
        this.projectRoots.map(
          ([inputRoot, outputRoot]) =>
            new EntrypointsJSONNode(inputRoot, outputRoot)
        )
      ),
      resolutions: new ModuleResolutionsNode(this.projectRoots),
    };
  }

  async run({
    resolutions,
    entrypoints,
  }: {
    resolutions: ModuleResolution[];
    entrypoints: Entrypoint[];
  }): Promise<Value<BundleAssignment[]>> {
    let assignments = new Map<string, BundleAssignment>();
    let jsEntrypointHrefs = (flatten(entrypoints).filter(
      (e) => !(e instanceof HTMLEntrypoint)
    ) as JSEntrypoint[]).map((e) => e.url.href);
    for (let [index, module] of resolutions.entries()) {
      // place the bundles in the first project's output
      let root = this.projectRoots[0][1];
      let bundleURL: URL;
      if (jsEntrypointHrefs.includes(module.url.href)) {
        bundleURL = new URL(`.${module.url.pathname}`, root);
      } else {
        bundleURL = new URL(`./dist/${index}.js`, root);
      }
      assignments.set(module.url.href, {
        bundleURL,
        module,
        exposedNames: new Map(),
      });
    }
    expandAssignments(assignments, [...assignments.values()]);

    // For lib builds, the exports of the JS entrypoint become the exports of
    // the resulting bundle
    for (let jsEntrypointHref of jsEntrypointHrefs) {
      let assignment = assignments.get(jsEntrypointHref);
      if (!assignment) {
        throw new Error(
          `bug: can't find bundle assignment for js entrypoint ${jsEntrypointHref}`
        );
      }
      for (let exportedName of assignment.module.desc.exports.keys()) {
        ensureExposed(exportedName, assignment);
      }
    }

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

  async run(): Promise<NextNode<string>> {
    return {
      node: new BundleSerializerNode(
        combineModules(this.bundle, this.assignments).code
      ),
    };
  }
}

export class BundleSerializerNode {
  cacheKey = this;

  constructor(private unannotatedSrc: string) {}

  deps() {
    return {
      parsed: new JSParseNode(new ConstantNode(this.unannotatedSrc)),
    };
  }

  async run({ parsed }: { parsed: File }): Promise<Value<string>> {
    let desc = describeModule(parsed);
    let value = [
      this.unannotatedSrc,
      annotationStart,
      encodeModuleDescription(desc),
      annotationEnd,
    ].join("");
    return { value };
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
