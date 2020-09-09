import {
  BuilderNode,
  Value,
  NextNode,
  ConstantNode,
  annotationEnd,
  annotationStart,
} from "./common";
import {
  ModuleResolutionsNode,
  ModuleResolution,
  CyclicModuleResolution,
  isCyclicModuleResolution,
} from "./resolution";
import { combineModules } from "../combine-modules";
import { File } from "@babel/types";
import {
  NamespaceMarker,
  describeFile,
  ImportedNameDescription,
  isModuleDescription,
} from "../describe-file";
import { EntrypointsJSONNode, Entrypoint, HTMLEntrypoint } from "./entrypoint";
import { JSParseNode } from "./js";
import { encodeModuleDescription } from "../description-encoder";
import { makeURLEndInDir } from "../path";
import { Resolver } from "../resolver";
import partition from "lodash/partition";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    private resolver: Resolver
  ) {
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
        this.projectOutput,
        this.resolver
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
    let { consumersOf, leaves, patchedConsumers } = invertDependencies(
      resolutions
    );
    // We accept that whoever first encounters a cyclic edge in our module
    // resolution determines the order that modules evaluate in. This means that
    // javascript that uses cyclic imports and is relying on a particular order
    // of evaluation based on a particular entrypoint may be evaluated in a
    // different order. However, reliance on order of evaluation with cyclic
    // imports is probably in poor form, as the order of evaluation can change
    // depending on the entrypoint used. To accommodate a single order of
    // evaluation for cyclic modules we sever cyclic edges and refashion a
    // new edge from the consumer of a cycle to the consumed dependencies of the
    // cyclic edge in the logic that follows.

    // we patch the consumers outside of the invert dependencies because we
    // don't have a handle on the resolution objects at the time we discover
    // that we need to set the consumersOf
    for (let [consumerHref, consumed] of patchedConsumers.create) {
      let resolution = findResolution(consumerHref, resolutions);
      for (let consumedHref of consumed) {
        // unsure about the isDynamic=false here...
        setConsumersOf(new URL(consumedHref), resolution, false, consumersOf);
      }
    }
    let removedModules: ModuleResolution[] = [];
    for (let [consumerHref, consumed] of patchedConsumers.remove) {
      for (let consumedHref of consumed) {
        let [updatedConsumers, removedConsumers] = partition(
          [...consumersOf.get(consumedHref)!],
          (r) => r.module.url.href !== consumerHref
        );
        consumersOf.set(consumedHref, new Set(updatedConsumers));
        removedModules = [
          ...removedModules,
          ...removedConsumers.map((c) => c.module),
        ];
      }
    }

    this.consumersOf = consumersOf;
    for (let leafHref of leaves) {
      this.assignModule(findResolution(leafHref, resolutions));
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

    // entrypoints can be consumed by other entrypoints, so it's important that
    // we assign consumers first, even if we are an entrypoint.
    let consumers = [...(this.consumersOf.get(module.url.href) ?? [])].map(
      (consumer) => ({
        module: consumer.module,
        isDynamic: consumer.isDynamic,
        internalAssignment: this.assignModule(consumer.module),
      })
    );

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
      } else {
        for (let consumer of consumers) {
          let myIndex = consumer.module.resolvedImports.findIndex(
            (m) => m.url.href === module.url.href
          );
          for (let nameDesc of [...consumer.module.desc.names.values()].filter(
            (desc) => desc.type === "import" && desc.importIndex === myIndex
          ) as ImportedNameDescription[]) {
            ensureExposed(nameDesc.name, internalAssignment.assignment);
          }
        }
      }
      return internalAssignment;
    }

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
        let bundleURL = consumer.internalAssignment.assignment.bundleURL;
        let internalAssignment = {
          assignment: {
            bundleURL,
            module,
            exposedNames: new Map(),
          },
          enclosingBundles: consumer.internalAssignment.enclosingBundles,
        };
        this.assignmentMap.set(module.url.href, internalAssignment);

        // Expose the exports that are consumed by modules in different bundles.
        // Your consumers will have already been assigned to bundles, since the
        // assignment recursing into your consumers happened when you when to
        // get the 'consumers' above.
        for (let externalConsumer of consumers.filter(
          (c) =>
            c.internalAssignment.assignment.bundleURL.href !== bundleURL.href
        )) {
          for (let nameDesc of externalConsumer.module.desc.names.values()) {
            if (
              nameDesc.type !== "import" ||
              externalConsumer.module.resolvedImports[nameDesc.importIndex].url
                .href !== module.url.href
            ) {
              continue;
            }
            ensureExposed(nameDesc.name, internalAssignment.assignment);
          }
        }

        return consumer.internalAssignment;
      }
    }

    // we need to be our own bundle
    let bundleURL = this.internalBundleURL();
    let enclosingBundles = intersection(
      consumers.map((c) => c.internalAssignment.enclosingBundles)
    );
    enclosingBundles.add(bundleURL.href); // we are also enclosed by our own bundle
    let internalAssignment = {
      assignment: {
        bundleURL,
        module,
        exposedNames: new Map(),
      },
      enclosingBundles,
    };
    this.assignmentMap.set(module.url.href, internalAssignment);
    for (let exportedName of module.desc.exports.keys()) {
      ensureExposed(exportedName, internalAssignment.assignment);
    }
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
    private outputRoot: URL,
    private resolver: Resolver
  ) {
    this.cacheKey = `bundle-node:url=${this.bundle.href},inputRoot=${this.inputRoot.href},outputRoot=${this.outputRoot.href}`;
  }

  deps() {
    return {
      bundleAssignments: new BundleAssignmentsNode(
        this.inputRoot,
        this.outputRoot,
        this.resolver
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
    let desc = describeFile(parsed);
    if (!isModuleDescription(desc)) {
      throw new Error(`Cannot encode description for CJS file`);
    }
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
  Set<{ isDynamic: boolean; module: ModuleResolution }> // note that a CyclicModuleResolution cannot be a consumer--its always a leaf node
>;

function invertDependencies(
  resolutions: (ModuleResolution | CyclicModuleResolution)[],
  consumersOf: Consumers = new Map(),
  leaves: Set<string> = new Set(), // module hrefs
  patchedConsumers: {
    create: Map<string, Set<string>>;
    remove: Map<string, Set<string>>;
  } = { create: new Map(), remove: new Map() } // consumer href => Set of consumed hrefs
): {
  consumersOf: Consumers;
  leaves: Set<string>;
  patchedConsumers: {
    create: Map<string, Set<string>>;
    remove: Map<string, Set<string>>;
  };
} {
  for (let resolution of resolutions) {
    if (isCyclicModuleResolution(resolution)) {
      // In the cyclic module resolution situation we are going to break the
      // cyclic edge, and refashion a new edge between the module that is
      // consuming the cycle and this module's dependencies
      let myConsumerHref =
        resolution.hrefStack[resolution.hrefStack.length - 1];

      let removeConsumers = patchedConsumers.remove.get(myConsumerHref);
      if (!removeConsumers) {
        removeConsumers = new Set();
        patchedConsumers.remove.set(myConsumerHref, removeConsumers);
      }
      removeConsumers.add(resolution.url.href);

      // this is the consumer of the entire cycle
      let consumerHref =
        resolution.hrefStack[
          resolution.hrefStack.findIndex(
            (href) => href === resolution.url.href
          ) - 1
        ];

      let createConsumers = patchedConsumers.create.get(consumerHref);
      if (!createConsumers) {
        createConsumers = new Set();
        patchedConsumers.create.set(consumerHref, createConsumers);
      }
      for (let consumedURL of resolution.imports) {
        createConsumers.add(consumedURL.href);
      }
      leaves.add(myConsumerHref);
    } else {
      if (resolution.resolvedImports.length > 0) {
        invertDependencies(
          resolution.resolvedImports,
          consumersOf,
          leaves,
          patchedConsumers
        );
        // since we are handling this on the exit of the recursion, all your deps
        // will have entries in the identity map
        for (let [index, dep] of resolution.resolvedImports.entries()) {
          let isDynamic = resolution.desc.imports[index].isDynamic;
          setConsumersOf(dep.url, resolution, isDynamic, consumersOf);
        }
      } else {
        leaves.add(resolution.url.href);
      }
    }
  }
  return { consumersOf, leaves, patchedConsumers };
}

function setConsumersOf(
  consumed: URL,
  consumer: ModuleResolution,
  isDynamic: boolean,
  consumersOf: Consumers
) {
  if (!consumersOf.has(consumed.href)) {
    consumersOf.set(consumed.href, new Set());
  }
  consumersOf.get(consumed.href)!.add({ isDynamic, module: consumer });
}

function findResolution(
  moduleHref: string,
  resolutions: (ModuleResolution | CyclicModuleResolution)[]
): ModuleResolution {
  let resolution = _findResolution(moduleHref, resolutions);
  if (!resolution) {
    throw new Error(
      `bug: could not find resolution ${moduleHref} in module resolution graph`
    );
  }
  return resolution;
}

function _findResolution(
  moduleHref: string,
  resolutions: (ModuleResolution | CyclicModuleResolution)[]
): ModuleResolution | undefined {
  let module = resolutions.find((m) => m.url.href === moduleHref);
  if (module && !isCyclicModuleResolution(module)) {
    return module;
  }
  for (let resolution of resolutions.filter(
    (r) => !isCyclicModuleResolution(r)
  ) as ModuleResolution[]) {
    let result = _findResolution(moduleHref, resolution.resolvedImports);
    if (result) {
      return result;
    }
  }
  return;
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
