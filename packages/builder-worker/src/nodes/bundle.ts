import {
  BuilderNode,
  Value,
  ConstantNode,
  annotationEnd,
  annotationStart,
  NodeOutput,
} from "./common";
import {
  ModuleResolutionsNode,
  ModuleResolution,
  isCyclicModuleResolution,
  Resolution,
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
import { LockEntries } from "./lock-file";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    private resolver: Resolver,
    private lockEntries: LockEntries
  ) {
    this.cacheKey = `bundle-assignments:input=${projectInput.href},output=${projectOutput.href}`;
  }

  async deps() {
    return {
      entrypoints: new EntrypointsJSONNode(
        this.projectInput,
        this.projectOutput
      ),
      resolutions: new ModuleResolutionsNode(
        this.projectInput,
        this.projectOutput,
        this.resolver,
        this.lockEntries
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
          entrypointModuleURL: module.url,
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
        let {
          bundleURL,
          entrypointModuleURL,
        } = consumer.internalAssignment.assignment;
        let internalAssignment = {
          assignment: {
            bundleURL,
            module,
            exposedNames: new Map(),
            entrypointModuleURL,
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
        entrypointModuleURL: module.url,
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
    private resolver: Resolver,
    private lockEntries: LockEntries,
    // parsing the bundle in order to perform bundle annotation can be a very
    // expensive operation. when it seems clear that the bundle is not being
    // consumed by JS (because it is consumed by an HTML entrypoint) then we
    // will skip parsing the bundle.
    private skipBundleAnnotation: boolean
  ) {
    this.cacheKey = `bundle-node:url=${this.bundle.href},inputRoot=${this.inputRoot.href},outputRoot=${this.outputRoot.href}`;
  }

  async deps() {
    return {
      bundleAssignments: new BundleAssignmentsNode(
        this.inputRoot,
        this.outputRoot,
        this.resolver,
        this.lockEntries
      ),
    };
  }

  async run({
    bundleAssignments,
  }: {
    bundleAssignments: BundleAssignment[];
  }): Promise<NodeOutput<string>> {
    let { code } = combineModules(this.bundle, bundleAssignments);
    if (this.skipBundleAnnotation) {
      return { value: code };
    }

    return {
      node: new BundleSerializerNode(code),
    };
  }
}

export class BundleSerializerNode implements BuilderNode {
  cacheKey = this;

  constructor(private unannotatedSrc: string) {}

  async deps() {
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

  // the bundle's entrypoint module
  entrypointModuleURL: URL;

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

function invertDependencies(
  resolutions: Resolution[],
  consumersOf: Consumers = new Map(),
  leaves: Set<ModuleResolution> = new Set()
): {
  consumersOf: Consumers;
  leaves: Set<ModuleResolution>;
} {
  for (let resolution of resolutions) {
    if (!isCyclicModuleResolution(resolution)) {
      if (resolution.resolvedImportsWithCyclicGroups.length > 0) {
        invertDependencies(resolution.resolvedImports, consumersOf, leaves);
        // since we are handling this on the exit of the recursion, all your deps
        // will have entries in the identity map
        for (let [
          index,
          dep,
        ] of resolution.resolvedImportsWithCyclicGroups.entries()) {
          if (Array.isArray(dep)) {
            let cycle = [...dep];
            let consumer = resolution;
            while (cycle.length > 0) {
              let consumed = cycle.shift()!;
              let consumedIndex = consumer.resolvedImports.findIndex(
                (m) => m.url.href === consumed.url.href
              );
              let isDynamic = consumer.desc.imports[consumedIndex].isDynamic;
              setConsumersOf(consumed.url, consumer, isDynamic, consumersOf);
              if (cycle.length === 0) {
                leaves.add(consumed);
              }
              consumer = consumed;
            }
          } else {
            let isDynamic = resolution.desc.imports[index].isDynamic;
            setConsumersOf(dep.url, resolution, isDynamic, consumersOf);
          }
        }
      } else {
        leaves.add(resolution);
      }
    }
  }
  return { consumersOf, leaves };
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
