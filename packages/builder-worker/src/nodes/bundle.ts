import { BuilderNode, Value } from "./common";
import {
  ModuleResolutionsNode,
  ModuleResolution,
  isCyclicModuleResolution,
  Resolution,
} from "./resolution";
import { getExports, ModuleDescription } from "../describe-file";
import {
  ImportedDeclarationDescription,
  NamespaceMarker,
} from "../code-region";
import {
  EntrypointsJSONNode,
  Entrypoint,
  HTMLEntrypoint,
  Dependencies,
} from "./entrypoint";
import { makeURLEndInDir } from "../path";
import { Resolver } from "../resolver";
import { LockEntries } from "./lock-file";
import { CombineModulesNode } from "./combine-modules";
import { addDescriptionToSource } from "../description-encoder";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    private resolver: Resolver,
    private lockEntries: LockEntries,
    private testingOpts?: TestingOptions
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
  }): Promise<
    Value<{
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
    }>
  > {
    let assigner = new Assigner(
      this.projectInput,
      this.projectOutput,
      resolutions,
      entrypoints
    );
    let { assignments, resolutionsInDepOrder } = assigner;

    if (this.testingOpts?.exports) {
      for (let [outsideName, { file, name }] of Object.entries(
        this.testingOpts.exports
      )) {
        let fileURL = new URL(file, this.testingOpts.origin);
        let assignment = assignments.find(
          (a) => a.module.url.href === fileURL.href
        );
        if (!assignment) {
          throw new Error(
            `invalid test setup, you tried to set an export for the module ${fileURL.href}}, but there is no assignment for that module`
          );
        }
        assignment.exposedNames.set(name, outsideName);
      }
    }
    return {
      value: { assignments, resolutionsInDepOrder },
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
  private resolutions: ModuleResolution[];

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
    let { consumersOf, leaves, resolutionsInDepOrder } = invertDependencies(
      resolutions
    );
    this.consumersOf = consumersOf;
    this.resolutions = [...resolutionsInDepOrder];
    for (let leaf of leaves) {
      this.assignModule(leaf);
    }
  }

  get assignments(): BundleAssignment[] {
    return [...this.assignmentMap.values()].map((v) => v.assignment);
  }
  get resolutionsInDepOrder(): ModuleResolution[] {
    return [...this.resolutions];
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
        for (let [exportedName] of getExports(module)) {
          ensureExposed(exportedName, internalAssignment.assignment);
        }
      } else {
        for (let consumer of consumers) {
          let { declarations } = consumer.module.desc;
          let myIndex = consumer.module.resolvedImports.findIndex(
            (m) => m.url.href === module.url.href
          );
          for (let importDeclaration of [...declarations.values()]
            .filter(
              ({ declaration }) =>
                declaration.type === "import" &&
                declaration.importIndex === myIndex
            )
            .map(
              ({ declaration }) => declaration
            ) as ImportedDeclarationDescription[]) {
            let [exportedName] =
              [...getExports(consumer.module).entries()].find(
                ([, { desc: exportDesc }]) =>
                  exportDesc.name === importDeclaration.importedName
              ) ?? [];
            if (!exportedName) {
              throw new Error(
                `cannot find export of binding '${importDeclaration.importedName} in ${consumer.module.url.href}`
              );
            }
            ensureExposed(exportedName, internalAssignment.assignment);
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
          let { declarations } = externalConsumer.module.desc;
          for (let [name, { declaration }] of declarations.entries()) {
            if (
              declaration.type !== "import" ||
              externalConsumer.module.resolvedImports[declaration.importIndex]
                .url.href !== module.url.href
            ) {
              continue;
            }
            let [exportedName] =
              [...getExports(externalConsumer.module).entries()].find(
                ([, { desc: exportDesc }]) => exportDesc.name === name
              ) ?? [];
            if (!exportedName) {
              throw new Error(
                `cannot find export of binding '${name} in ${externalConsumer.module.url.href}`
              );
            }
            ensureExposed(exportedName, internalAssignment.assignment);
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
    for (let [exportedName] of getExports(module)) {
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
    private dependencies: Dependencies,
    private testingOpts?: TestingOptions
  ) {
    this.cacheKey = `bundle-node:url=${this.bundle.href},inputRoot=${
      this.inputRoot.href
    },outputRoot=${this.outputRoot.href},dependencies=${JSON.stringify(
      dependencies
    )}`;
  }

  async deps() {
    return {
      result: new CombineModulesNode(
        this.bundle,
        this.dependencies,
        this.lockEntries,
        new BundleAssignmentsNode(
          this.inputRoot,
          this.outputRoot,
          this.resolver,
          this.lockEntries,
          this.testingOpts
        )
      ),
    };
  }

  async run({
    result: { code, desc },
  }: {
    result: { code: string; desc: ModuleDescription };
  }): Promise<Value<string>> {
    let value = addDescriptionToSource(desc, code);
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
  exposedNames: Map<string, string>;
}

function ensureExposed(exported: string, assignment: BundleAssignment) {
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
  leaves: Set<ModuleResolution> = new Set(),
  resolutionsInDepOrder: Set<ModuleResolution> = new Set()
): {
  consumersOf: Consumers;
  leaves: Set<ModuleResolution>;
  resolutionsInDepOrder: Set<ModuleResolution>;
} {
  for (let resolution of resolutions) {
    if (!isCyclicModuleResolution(resolution)) {
      if (resolution.resolvedImportsWithCyclicGroups.length > 0) {
        invertDependencies(
          resolution.resolvedImports,
          consumersOf,
          leaves,
          resolutionsInDepOrder
        );
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
          resolutionsInDepOrder.add(resolution);
        }
      } else {
        leaves.add(resolution);
        resolutionsInDepOrder.add(resolution);
      }
    }
  }
  return { consumersOf, leaves, resolutionsInDepOrder };
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

export interface TestingOptions {
  origin: string;
  exports?: {
    [outsideName: string]: { file: string; name: string };
  };
}
