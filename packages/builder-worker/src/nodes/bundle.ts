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
import { EntrypointsJSONNode, Entrypoint, HTMLEntrypoint } from "./entrypoint";
import { JSParseNode } from "./js";
import { encodeModuleDescription } from "../description-encoder";
import { makeURLEndInDir } from "../path";

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
    let assigner = new Assigner(
      this.projectInput,
      this.projectOutput,
      resolutions,
      entrypoints
    );
    // for (let [index, module] of resolutions.entries()) {
    //   let root = this.projectOutput;
    //   let bundleURL: URL;
    //   if (jsEntrypointHrefs.includes(module.url.href)) {
    //     // merge the bundle's path into the root's folder structure if they
    //     // share a common root folder structure in the path part of the URL
    //     let commonRootParts = commonStart(
    //       module.url.pathname.split("/"),
    //       root.pathname.split("/")
    //     );
    //     let commonRoot = commonRootParts.join("/");
    //     bundleURL = new URL(
    //       `.${module.url.pathname.slice(commonRoot.length)}`,
    //       root
    //     );
    //   } else {
    //     bundleURL = new URL(`./dist/${index}.js`, root);
    //   }
    //   assignments.set(module.url.href, {
    //     bundleURL,
    //     module,
    //     exposedNames: new Map(),
    //   });
    // }

    //  expandAssignments(assignments, [...assignments.values()]);

    // TODO dynamic modules should have this logic too...
    // For lib builds, the exports of the JS entrypoint become the exports of
    // the resulting bundle
    // for (let jsEntrypointHref of jsEntrypointHrefs) {
    //   let assignment = assignments.get(jsEntrypointHref);
    //   if (!assignment) {
    //     throw new Error(
    //       `bug: can't find bundle assignment for js entrypoint ${jsEntrypointHref}`
    //     );
    //   }
    //   for (let exportedName of assignment.module.desc.exports.keys()) {
    //     ensureExposed(exportedName, assignment);
    //   }
    // }

    return {
      value: assigner.assignments,
    };
  }
}

interface InternalAssignment {
  assignment: BundleAssignment;
  enclosingBundles: Set<string>;
}

export class Assigner {
  private assignmentMap: Map<string, InternalAssignment> = new Map();
  private entrypoints: Map<string, { url: URL; isLibrary: boolean }>;
  private internalBundleCount = 0;
  private consumersOf: Consumers;
  private requestedEntrypointURLs: URL[] = [];

  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    resolutions: ModuleResolution[],
    entrypoints: Entrypoint[],
    htmlJSEntrypointURLs?: URL[]
  ) {
    if (htmlJSEntrypointURLs) {
      this.requestedEntrypointURLs = [...htmlJSEntrypointURLs];
    }
    this.entrypoints = this.mapEntrypoints(entrypoints);
    let { consumersOf, leaves } = invertDependencies(resolutions);
    this.consumersOf = consumersOf;
    for (let leaf of leaves) {
      this.assignModule(leaf);
    }
  }

  get assignments(): BundleAssignment[] {
    return [...this.assignmentMap.values()].map((v) => v.assignment);
  }

  private inputToOutput(href: string): URL {
    return new URL(
      href.replace(
        makeURLEndInDir(this.projectInput).href,
        makeURLEndInDir(this.projectOutput).href
      )
    );
  }

  private mapEntrypoints(
    entrypoints: Entrypoint[]
  ): Map<string, { url: URL; isLibrary: boolean }> {
    let jsEntrypoints: Map<
      string,
      { url: URL; isLibrary: boolean }
    > = new Map();
    for (let entrypoint of entrypoints) {
      if (entrypoint instanceof HTMLEntrypoint) {
        for (let script of entrypoint.jsEntrypoints.keys()) {
          let url =
            this.requestedEntrypointURLs.length > 0
              ? this.requestedEntrypointURLs.shift()!
              : this.internalBundleURL();
          jsEntrypoints.set(script, {
            url,
            isLibrary: false,
          });
        }
      } else {
        jsEntrypoints.set(entrypoint.url.href, {
          url: this.inputToOutput(entrypoint.url.href),
          isLibrary: true,
        });
      }
    }
    return jsEntrypoints;
  }

  private assignModule(module: ModuleResolution): InternalAssignment {
    let alreadyAssigned = this.assignmentMap.get(module.url.href);
    if (alreadyAssigned) {
      return alreadyAssigned;
    }

    let entrypoint = this.entrypoints.get(module.url.href);
    if (entrypoint) {
      // base case: we are an entrypoint
      let internalAssignment = {
        assignment: {
          bundleURL: entrypoint.url,
          module,
          exposedNames: new Map(),
        },
        enclosingBundles: new Set([entrypoint.url.href]),
      };
      this.assignmentMap.set(module.url.href, internalAssignment);
      if (entrypoint.isLibrary) {
        for (let exportedName of module.desc.exports.keys()) {
          ensureExposed(exportedName, internalAssignment.assignment);
        }
      }
      return internalAssignment;
    }

    let consumers = [...this.consumersOf.get(module.url.href)!].map(
      (consumer) => ({
        module: consumer.module,
        isDynamic: consumer.isDynamic,
        internalAssignment: this.assignModule(consumer.module),
      })
    );

    // trying each consumers to see if we can merge into it
    for (let consumer of consumers) {
      if (
        consumers.every(
          (otherConsumer) =>
            !otherConsumer.isDynamic &&
            otherConsumer.internalAssignment.enclosingBundles.has(
              consumer.internalAssignment.assignment.bundleURL.href
            )
        )
      ) {
        // we can merge with this consumer
        this.assignmentMap.set(module.url.href, {
          assignment: {
            bundleURL: consumer.internalAssignment.assignment.bundleURL,
            module,
            exposedNames: new Map(),
          },
          enclosingBundles: consumer.internalAssignment.enclosingBundles,
        });
        return consumer.internalAssignment;
      }
    }

    // we need to be our own bundle
    let internalAssignment = {
      assignment: {
        bundleURL: this.internalBundleURL(),
        module,
        exposedNames: new Map(),
      },
      enclosingBundles: intersection(
        consumers.map((c) => c.internalAssignment.enclosingBundles)
      ),
    };
    this.assignmentMap.set(module.url.href, internalAssignment);
    return internalAssignment;
  }

  private internalBundleURL(): URL {
    return new URL(
      `./dist/${this.internalBundleCount++}.js`,
      this.projectOutput
    );
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

type Consumers = Map<
  string,
  Set<{ isDynamic: boolean; module: ModuleResolution }>
>;

// This outputs an identity map of bundles, where the key of the map is the
// module href of the entrypoint to the bundle, as well as a set of leaf nodes
// (bundles that don't import other bundles). This starts out with a bundle for
// each module, we then need to optimize this stucture by aggregating modules
// within the various bundles based on the consumption pattern of the aggregated
// modules within each bundle.
function invertDependencies(
  resolutions: ModuleResolution[],
  consumersOf: Consumers = new Map(),
  leaves: Set<ModuleResolution> = new Set()
): {
  consumersOf: Consumers;
  leaves: Set<ModuleResolution>;
} {
  for (let resolution of resolutions) {
    consumersOf.set(resolution.url.href, new Set());
    if (resolution.resolvedImports.length > 0) {
      invertDependencies(resolution.resolvedImports, consumersOf, leaves);
      // since we are handling this on the exit of the recursion, all your deps
      // will have entries in the identiy map
      for (let [index, dep] of resolution.resolvedImports.entries()) {
        let isDynamic = resolution.desc.imports[index].isDynamic;
        consumersOf.get(dep.url.href)!.add({ isDynamic, module: resolution });
      }
    } else {
      leaves.add(resolution);
    }
  }
  return { consumersOf, leaves };
}

function intersection<T>(sets: Set<T>[]): Set<T> {
  let output: Set<T> = new Set();
  let [first, ...rest] = sets;
  for (let element of first) {
    if (rest.every((s) => s.has(element))) {
      output.add(element);
    }
  }
  return output;
}
