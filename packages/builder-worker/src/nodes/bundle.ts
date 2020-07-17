import {
  BuilderNode,
  Value,
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
import { JSParseNode } from "./js";
import { encodeModuleDescription } from "../description-encoder";

interface Bundle {
  modules: Set<ModuleResolution>;
  staticallyImportedBy: Set<Bundle>;
  dynamicallyImportedBy: Set<Bundle>;
}

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey: string;

  constructor(private projectInput: URL, private projectOutput: URL) {
    this.cacheKey = `bundle-assignments:input=${projectInput.href},output=${projectOutput.href}`;
  }

  deps() {
    return {
      entrypoints: new EntrypointsJSONNode(
        this.projectInput,
        this.projectOutput
      ),
      resolutions: new ModuleResolutionsNode(
        this.projectInput,
        this.projectOutput
      ),
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
    let jsEntrypointHrefs = (entrypoints.filter(
      (e) => !(e instanceof HTMLEntrypoint)
    ) as JSEntrypoint[]).map((e) => e.url.href);
    for (let [index, module] of resolutions.entries()) {
      let root = this.projectOutput;
      let bundleURL: URL;
      if (jsEntrypointHrefs.includes(module.url.href)) {
        // merge the bundle's path into the root's folder structure if they
        // share a common root folder structure in the path part of the URL
        let commonRootParts = commonStart(
          module.url.pathname.split("/"),
          root.pathname.split("/")
        );
        let commonRoot = commonRootParts.join("/");
        bundleURL = new URL(
          `.${module.url.pathname.slice(commonRoot.length)}`,
          root
        );
      } else {
        bundleURL = new URL(`./dist/${index}.js`, root);
      }
      assignments.set(module.url.href, {
        bundleURL,
        module,
        exposedNames: new Map(),
      });
    }

    let { bundles, leaves } = makeBundles(resolutions);

    expandAssignments(assignments, [...assignments.values()]);

    // TODO dynamic modules should have this logic too...
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

export class BundleNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private bundle: URL,
    private inputRoot: URL,
    private outputRoot: URL
  ) {
    this.cacheKey = `bundle-node:url=${this.bundle.href},inputRoot=${this.inputRoot.href},outputRoot=${this.outputRoot.href}`;
  }

  deps() {
    return {
      bundleAssignments: new BundleAssignmentsNode(
        this.inputRoot,
        this.outputRoot
      ),
    };
  }

  async run({
    bundleAssignments,
  }: {
    bundleAssignments: BundleAssignment[];
  }): Promise<NextNode<string>> {
    return {
      node: new BundleSerializerNode(
        combineModules(this.bundle, bundleAssignments).code
      ),
    };
  }
}

export class BundleSerializerNode implements BuilderNode {
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

    for (let [index, dep] of assignment.module.resolvedImports.entries()) {
      let depAssignment = assignments.get(dep.url.href);
      if (!depAssignment) {
        depAssignment = {
          bundleURL: assignment.bundleURL,
          module: dep,
          exposedNames: new Map(),
        };
        assignments.set(dep.url.href, depAssignment);
        queue.push(depAssignment);
      }

      // All the exports of a module that is dynamically imported should be
      // exposed in its enclosing bundle. A dynamically imported module returns a
      // promise to an object whose keys are the module's named exports (and a
      // special property "default" for the default export). Statically
      // determining the exports that are used from a dynamcially imported module
      // is impossible--so we'll have to allow all the exports declared on a
      // module that is imported dynmically to remain.
      if (assignment.module.desc.imports[index].isDynamic) {
        for (let exportedName of depAssignment.module.desc.exports.keys()) {
          ensureExposed(exportedName, depAssignment);
        }
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

function commonStart(arr1: string[], arr2: string[]): string[] {
  let result: string[] = [];
  for (let i = 0; i < Math.min(arr1.length - 1, arr2.length - 1); i++) {
    if (arr1[i] === arr2[i]) {
      result.push(arr1[i]);
    } else {
      break;
    }
  }
  return result;
}

// This outputs an identity map of bundles, where the key of the map is the
// module href of the entrypoint to the bundle, as well as a set of leaf nodes
// (bundles that don't import other bundles). This starts out with a bundle for
// each module, we then need to optimize this stucture by aggregating modules
// within the various bundles based on the consumption pattern of the aggregated
// modules within each bundle.
function makeBundles(
  resolutions: ModuleResolution[],
  bundles: Map<string, Bundle> = new Map(),
  leaves: Set<Bundle> = new Set()
): { bundles: Map<string, Bundle>; leaves: Set<Bundle> } {
  for (let resolution of resolutions) {
    let bundle: Bundle = {
      modules: new Set<ModuleResolution>([resolution]),
      staticallyImportedBy: new Set(),
      dynamicallyImportedBy: new Set(),
    };
    bundles.set(resolution.url.href, bundle);
    if (resolution.resolvedImports.length > 0) {
      makeBundles(resolution.resolvedImports, bundles, leaves);

      // since we are handling this on the exit of the recursion, all your deps
      // will have entries in the identiy map
      for (let [index, dep] of resolution.resolvedImports.entries()) {
        let isDynamic = resolution.desc.imports[index].isDynamic;
        let depBundle = bundles.get(dep.url.href)!;
        if (isDynamic) {
          depBundle.dynamicallyImportedBy.add(bundle);
        } else {
          depBundle.staticallyImportedBy.add(bundle);
        }
      }
    } else {
      leaves.add(bundle);
    }
  }
  return { bundles, leaves };
}

function makeBundleURL(siblingBundleURL: URL, nonce: number) {
  let segments = siblingBundleURL.href.split("/");
  segments.pop();
  return new URL(`chunk${nonce++}.js`, `${segments.join("/")}/`);
}
