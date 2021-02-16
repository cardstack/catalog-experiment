import { BundleAssignment } from "../nodes/bundle";
import {
  ModuleResolution,
  isCyclicModuleResolution,
  Resolution,
} from "../nodes/resolution";
import { getExports } from "../describe-file";
import {
  ImportedDeclarationDescription,
  NamespaceMarker,
} from "../code-region";
import { Entrypoint, HTMLEntrypoint } from "../nodes/entrypoint";
import { setIntersection as intersection } from "../utils";
import { makeURLEndInDir } from "../path";
export interface Assigner {
  assignments: BundleAssignment[];
  resolutionsInDepOrder: ModuleResolution[];
}
export interface InternalAssignment {
  assignment: BundleAssignment;
  enclosingBundles: Set<string>;
}

type Consumers = Map<
  string,
  Set<{ isDynamic: boolean; module: ModuleResolution }>
>;

interface ConsumerAssignment {
  module: ModuleResolution;
  isDynamic: boolean;
  internalAssignment: InternalAssignment;
}

export abstract class AbstractAssigner implements Assigner {
  protected assignmentMap: Map<string, InternalAssignment> = new Map();
  protected entrypoints: Map<string, { url: URL; isLibrary: boolean }>;
  private internalBundleCount = 0;
  protected consumersOf: Consumers;
  private requestedEntrypointURLs: URL[] = [];
  private resolutions: ModuleResolution[];

  constructor(
    readonly type: BundleAssignment["assigner"],
    protected projectInput: URL,
    protected projectOutput: URL,
    resolutions: ModuleResolution[],
    entrypoints: Entrypoint[],
    private usesInternalBundleURLs: boolean,
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
    this.doAssignments(leaves);
  }

  get assignments(): BundleAssignment[] {
    return [...this.assignmentMap.values()].map((v) => v.assignment);
  }
  get resolutionsInDepOrder(): ModuleResolution[] {
    return [...this.resolutions];
  }

  protected abstract doAssignments(leaves: Set<ModuleResolution>): void;

  protected inputToOutput(href: string): URL {
    return new URL(
      href.replace(
        makeURLEndInDir(this.projectInput).href,
        makeURLEndInDir(this.projectOutput).href
      )
    );
  }

  protected assignConsumersOfModule(
    module: ModuleResolution,
    assignModule: (module: ModuleResolution) => InternalAssignment
  ): ConsumerAssignment[] {
    return [...(this.consumersOf.get(module.url.href) ?? [])].map(
      (consumer) => ({
        module: consumer.module,
        isDynamic: consumer.isDynamic,
        internalAssignment: assignModule(consumer.module),
      })
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
          let url: URL;
          if (this.usesInternalBundleURLs) {
            url =
              this.requestedEntrypointURLs.length > 0
                ? this.requestedEntrypointURLs.shift()!
                : this.internalBundleURL();
          } else {
            url = this.inputToOutput(script);
          }
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

  protected internalBundleURL(): URL {
    return new URL(
      `./dist/${this.internalBundleCount++}.js`,
      this.projectOutput
    );
  }
}

export class DefaultAssigner extends AbstractAssigner {
  constructor(
    projectInput: URL,
    projectOutput: URL,
    resolutions: ModuleResolution[],
    entrypoints: Entrypoint[],
    htmlJSEntrypointURLs?: URL[]
  ) {
    super(
      "default",
      projectInput,
      projectOutput,
      resolutions,
      entrypoints,
      true,
      htmlJSEntrypointURLs
    );
  }
  protected doAssignments(leaves: Set<ModuleResolution>): void {
    for (let leaf of leaves) {
      this.assignModule(leaf);
    }
  }

  private assignModule(module: ModuleResolution): InternalAssignment {
    let alreadyAssigned = this.assignmentMap.get(module.url.href);
    if (alreadyAssigned) {
      return alreadyAssigned;
    }

    // entrypoints can be consumed by other entrypoints, so it's important that
    // we assign consumers first, even if we are an entrypoint.
    let consumerAssignments = this.assignConsumersOfModule(
      module,
      this.assignModule.bind(this)
    );
    let entrypoint = this.entrypoints.get(module.url.href);
    if (entrypoint) {
      // base case: we are an entrypoint
      return internalAssignmentForEntrypoint(
        this.type,
        module,
        entrypoint,
        consumerAssignments,
        this.assignmentMap
      );
    }

    // trying each consumers to see if we can merge into it
    for (let consumerAssignment of consumerAssignments) {
      if (
        consumerAssignments.every(
          (otherConsumer) =>
            !otherConsumer.isDynamic &&
            otherConsumer.internalAssignment.enclosingBundles.has(
              consumerAssignment.internalAssignment.assignment.bundleURL.href
            )
        )
      ) {
        // we can merge with this consumer
        let {
          bundleURL,
          entrypointModuleURL,
        } = consumerAssignment.internalAssignment.assignment;
        let internalAssignment = {
          assignment: {
            assigner: this.type,
            bundleURL,
            module,
            exposedNames: new Map(),
            entrypointModuleURL,
          },
          enclosingBundles:
            consumerAssignment.internalAssignment.enclosingBundles,
        };
        this.assignmentMap.set(module.url.href, internalAssignment);

        // Expose the exports that are consumed by modules in different bundles.
        // Your consumers will have already been assigned to bundles, since the
        // assignment recursing into your consumers happened when you when to
        // get the 'consumers' above.
        for (let externalConsumer of consumerAssignments.filter(
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
              [...getExports(module).entries()].find(
                ([, { desc: exportDesc }]) => exportDesc.name === name
              ) ?? [];
            if (!exportedName) {
              throw new Error(
                `cannot find export of binding '${name}' in ${module.url.href}`
              );
            }
            ensureExposed(exportedName, internalAssignment.assignment);
          }
        }

        return consumerAssignment.internalAssignment;
      }
    }

    // we need to be our own bundle
    let bundleURL = this.internalBundleURL();
    let enclosingBundles = intersection(
      ...consumerAssignments.map((c) => c.internalAssignment.enclosingBundles)
    );
    enclosingBundles.add(bundleURL.href); // we are also enclosed by our own bundle
    let internalAssignment = {
      assignment: {
        assigner: this.type,
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
}

export function internalAssignmentForEntrypoint(
  type: BundleAssignment["assigner"],
  module: ModuleResolution,
  entrypoint: { url: URL; isLibrary: boolean },
  consumerAssignments: ConsumerAssignment[],
  assignmentMap: Map<string, InternalAssignment>
): InternalAssignment {
  let internalAssignment = {
    assignment: {
      assigner: type,
      bundleURL: entrypoint.url,
      module,
      exposedNames: new Map(),
      entrypointModuleURL: module.url,
    },
    enclosingBundles: new Set([entrypoint.url.href]),
  };
  assignmentMap.set(module.url.href, internalAssignment);
  if (entrypoint.isLibrary) {
    for (let [exportedName] of getExports(module)) {
      ensureExposed(exportedName, internalAssignment.assignment);
    }
  } else {
    for (let consumerAssignment of consumerAssignments) {
      let { declarations } = consumerAssignment.module.desc;
      let myIndex = consumerAssignment.module.resolvedImports.findIndex(
        (m) => m.url.href === module.url.href
      );
      for (let importDeclaration of [...declarations.values()]
        .filter(
          ({ declaration }) =>
            declaration.type === "import" && declaration.importIndex === myIndex
        )
        .map(
          ({ declaration }) => declaration
        ) as ImportedDeclarationDescription[]) {
        let [exportedName] =
          [...getExports(module).entries()].find(
            ([, { desc: exportDesc }]) =>
              exportDesc.name === importDeclaration.importedName
          ) ?? [];
        if (!exportedName) {
          throw new Error(
            `cannot find export of binding '${importDeclaration.importedName}' in ${module.url.href}`
          );
        }
        ensureExposed(exportedName, internalAssignment.assignment);
      }
    }
  }
  return internalAssignment;
}

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

export function ensureExposed(exported: string, assignment: BundleAssignment) {
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
