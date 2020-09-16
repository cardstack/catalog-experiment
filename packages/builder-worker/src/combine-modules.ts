import { BundleAssignment } from "./nodes/bundle";
import { ModuleResolution, CyclicModuleResolution } from "./nodes/resolution";
import {
  NamespaceMarker,
  isNamespaceMarker,
  ImportedNameDescription,
} from "./describe-file";
import { maybeRelativeURL } from "./path";
import { RegionEditor } from "./code-region";

// This is an inverted State.assignedImportedNames, where the key is the
// assigned name in the bundle and the value is the original moduleHref and
// exported name for the assignment.
export type ImportAssignments = Map<
  string,
  { moduleHref: string; name: string | NamespaceMarker }
>;

export function combineModules(
  bundle: URL,
  assignments: BundleAssignment[]
): { code: string; importAssignments: ImportAssignments } {
  let state: State = {
    bundle,
    assignedLocalNames: new Map(),
    usedNames: new Map(),
    assignedImportedNames: new Map(),
    sideEffectOnlyImports: new Set(),
    consumedBundles: new Set(),
    bindingDependsOn: new Map(),
    bundleDependsOn: new Set(),
    sideEffectsDependOn: new Set(),
    seenModules: new Set(),
  };
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );
  let rewriters: Map<string, ModuleRewriter> = new Map();

  for (let assignment of ownAssignments) {
    gatherModuleRewriters(rewriters, assignment.module, state, assignments);
  }

  // iterate through the bundle's bindings and identify bindings that are not
  // consumed:
  //   - binding is not exported by bundle or part of an exported binding's
  //     dependency graph
  //   - binding is not consumed directly by the bundle's own module scope or
  //     part of a consumed binding's dependency graph
  //   - binding is not consumed directly by a side-effectful declaration or
  //     part of a consumed side effectful binding dependency graph
  let { exports, reexports } = assignedExports(
    bundle,
    ownAssignments,
    assignments,
    state
  );
  let removedBindings = new Set<string>();
  let consumptionCache = new Map<string, Map<string, boolean>>();
  for (let bindingName of state.usedNames.keys()) {
    if (
      [
        ...new Set([
          ...exports.values(),
          ...state.bundleDependsOn,
          ...state.sideEffectsDependOn,
        ]),
      ].some(
        (retainedBinding) =>
          retainedBinding === bindingName ||
          isConsumedBy(
            retainedBinding,
            bindingName,
            state.bindingDependsOn,
            consumptionCache,
            bundle
          )
      )
    ) {
      continue;
    }

    removedBindings.add(bindingName);
    removeBinding(bindingName, rewriters, bundle, state, assignments);
  }

  let output = [];
  for (let rewriter of rewriters.values()) {
    let namespaces = makeLocalNamespaces(
      rewriter.module,
      bundle,
      assignments,
      state
    ).filter(({ bindingName }) => !removedBindings.has(bindingName));
    output.push(namespaces.map(({ code }) => code).join("\n"));

    let code = rewriter.serialize();
    output.push(code);
  }

  // at this point we removed all export statements because our modules can
  // directly consume each other's renamed bindings. Here we re-add exports for
  // the things that are specifically configured to be exposed outside the
  // bundle.
  if (exports.size > 0) {
    let exportDeclaration: string[] = [];
    exportDeclaration.push("export {");
    exportDeclaration.push(
      [...exports]
        .map(([outsideName, insideName]) =>
          outsideName === insideName
            ? outsideName
            : `${insideName} as ${outsideName}`
        )
        .join(", ")
    );
    exportDeclaration.push("};");
    output.push(exportDeclaration.join(" "));
  }

  // Add reexports of other bundles
  if (reexports.size > 0) {
    // cleanup the side effect only imports by removing reexported bundle URLs
    state.sideEffectOnlyImports = new Set(
      [...state.sideEffectOnlyImports].filter(
        (href) => ![...reexports.keys()].includes(href)
      )
    );

    let reexportDeclarations: string[] = [];
    for (let bundleHref of reexports.keys()) {
      let mapping = reexports.get(bundleHref);
      if (!mapping) {
        continue;
      }
      let reexportDeclaration: string[] = [];
      reexportDeclaration.push("export {");
      reexportDeclaration.push(
        [...mapping]
          .map(([exposedName, importedName]) =>
            exposedName === importedName
              ? exposedName
              : `${importedName} as ${exposedName}`
          )
          .join(", ")
      );
      reexportDeclaration.push("} from");
      reexportDeclaration.push(
        `"${maybeRelativeURL(new URL(bundleHref), bundle)}";`
      );
      reexportDeclarations.push(reexportDeclaration.join(" "));
    }
    output.unshift(reexportDeclarations.join("\n"));
  }

  // Add imports for this bundle in dep-first order
  let importDeclarations: string[] = [];
  let { namedImports, namespaceImports } = assignedImports(
    assignments,
    state,
    removedBindings
  );
  for (let bundleHref of state.consumedBundles) {
    let namedMapping = namedImports.get(bundleHref);
    let localNamespaceImport = namespaceImports.get(bundleHref);
    if (localNamespaceImport) {
      importDeclarations.push(
        `import * as ${localNamespaceImport} from "${maybeRelativeURL(
          new URL(bundleHref),
          bundle
        )}";`
      );
    }
    if (namedMapping && !localNamespaceImport) {
      let importDeclaration: string[] = [];
      importDeclaration.push("import {");
      importDeclaration.push(
        [...namedMapping]
          .map(([exportedName, localName]) =>
            exportedName === localName
              ? exportedName
              : `${exportedName} as ${localName}`
          )
          .join(", ")
      );
      importDeclaration.push("} from");
      importDeclaration.push(
        `"${maybeRelativeURL(new URL(bundleHref), bundle)}";`
      );
      importDeclarations.push(importDeclaration.join(" "));
    }
    // this is an optimization such that if there is a namespace mapping and a
    // named mapping from the same module, we can collapse the named mapping and
    // pluck the named mapping out of the namespace import's local binding
    if (namedMapping && localNamespaceImport) {
      let variableDeclaration: string[] = [];
      variableDeclaration.push("const {");
      variableDeclaration.push(
        [...namedMapping]
          .map(([exportedName, localName]) =>
            exportedName === localName
              ? exportedName
              : `${exportedName}: ${localName}`
          )
          .join(", ")
      );
      variableDeclaration.push(`} = ${localNamespaceImport};`);
      importDeclarations.push(variableDeclaration.join(" "));
    }
    if (
      !namedMapping &&
      !localNamespaceImport &&
      state.sideEffectOnlyImports.has(bundleHref)
    ) {
      importDeclarations.push(
        `import "${maybeRelativeURL(new URL(bundleHref), bundle)}";`
      );
    }
  }
  output.unshift(importDeclarations.join("\n"));

  // if there are no imports nor exports written to the bundle, then write
  // "export {};" to signal that this is an ES6 module.
  if (
    importDeclarations.length === 0 &&
    exports.size === 0 &&
    reexports.size === 0
  ) {
    output.push(`export {};`);
  }

  const importAssignments = invertAssignedImportedNames(
    state.assignedImportedNames
  );
  return {
    code: output.join("\n").trim(),
    importAssignments,
  };
}

function invertAssignedImportedNames(
  assignedImportedNames: State["assignedImportedNames"]
): ImportAssignments {
  let importAssignments: ImportAssignments = new Map();
  for (let [moduleHref, mapping] of assignedImportedNames) {
    for (let [name, assignedName] of mapping) {
      importAssignments.set(assignedName, {
        moduleHref,
        name,
      });
    }
  }
  return importAssignments;
}

function removeBinding(
  assignedName: string,
  rewriters: Map<string, ModuleRewriter>,
  bundle: URL,
  state: State,
  assignments: BundleAssignment[]
): void {
  let name: string | undefined;
  let moduleHref: string | undefined;
  if (!state.usedNames.has(assignedName)) {
    // if we have not found the name it is because it comes from a module that
    // has been assigned to a different bundle. because it comes from a
    // different bundle, the name has never been assigned, so the name being
    // asked about is actually already the original name
    name = assignedName;
    let assignment = assignments.find(({ exposedNames }) =>
      exposedNames.has(assignedName)
    );
    moduleHref = assignment?.bundleURL.href;
  } else {
    ({ moduleHref, name } = state.usedNames.get(assignedName) || {});
  }
  if (!moduleHref || !name) {
    throw new Error(
      `bug: could not determine the original name and module of the bundle scoped binding (after assignment) of '${assignedName}`
    );
  }

  let { bundleURL } = assignments.find(
    ({ module: m }) => m.url.href === moduleHref
  )!;
  // no need to worry about removing bindings that come from other bundles, as
  // we wont even bother writing their import statements in the final steps of
  // the bundle creation since they would be unconsumed.
  if (bundle.href === bundleURL.href) {
    let rewriter = rewriters.get(moduleHref)!;
    rewriter.editor.removeDeclaration(name);
  }
}

interface State {
  bundle: URL;

  usedNames: Map<string, { moduleHref: string; name: string }>;

  // this is a set of bundle hrefs that are imported for side effects only
  sideEffectOnlyImports: Set<string>;

  // this is a set of bundles that are consumed by this bundle in dep-first
  // order of consumption. We use this structure to ensure that the order in
  // which we write the imports in the bundle is maintained correctly.
  consumedBundles: Set<string>;

  // outer map is the href of the exported module. the inner map goes from
  // exported name to our name. our name also must appear in usedNames. If the
  // inner map is undefined, then this is a side effect-only import.
  assignedImportedNames: Map<string, Map<string | NamespaceMarker, string>>;

  // This is synonymous with assignedImportedNames, but it's used specifically
  // to help us lookup local name assignments. outer map is the href of the
  // module. the inner map's key is the original name of the binding in the
  // module, and the value is it's assigned name in the resulting bundle.
  assignedLocalNames: Map<string, Map<string, string>>;

  // keys are the module-scoped names within our bundle (same as usedNames).
  // values are lists of other module-scoped names within our bundle that the
  // given binding depends upon.
  bindingDependsOn: Map<string, Set<string>>;

  // similar to bindingDependsOn, these are bindings that are needed by the
  // bundle's top-level module scope itself.
  bundleDependsOn: Set<string>;

  // similar to bindingDependsOn, these are bindings that are needed by the side
  // effectful declarations that are unable to be removed.
  sideEffectsDependOn: Set<string>;

  seenModules: Set<string>;
}
class ModuleRewriter {
  readonly editor: RegionEditor;

  constructor(
    readonly module: ModuleResolution,
    private sharedState: State,
    private assignments: BundleAssignment[]
  ) {
    this.editor = new RegionEditor(
      module.source,
      module.desc,
      this.unusedNameLike.bind(this)
    );
    this.rewriteScope();
  }

  serialize(): string {
    return this.editor.serialize();
  }

  rewriteScope(): void {
    let assignedDefaultName: string | undefined;
    for (let [name, nameDesc] of this.module.desc.names) {
      let isDefaultExport = false;
      let assignedName: string;

      // figure out which names in module scope are imports vs things that
      // live inside this module
      if (
        nameDesc.type === "import" ||
        (nameDesc.type === "local" && nameDesc.original)
      ) {
        let remoteName: string | NamespaceMarker;
        let remoteModuleHref: string;
        if (nameDesc.type === "local" && nameDesc.original) {
          remoteName = nameDesc.original.exportedName;
          remoteModuleHref = nameDesc.original.moduleHref;
        } else if (nameDesc.type === "import") {
          let remoteModule: ModuleResolution | CyclicModuleResolution;
          ({ name: remoteName, module: remoteModule } = resolveReexport(
            nameDesc.name,
            this.module.resolvedImports[nameDesc.importIndex]
          ));
          remoteModuleHref = remoteModule.url.href;
        }
        assignedName = this.maybeAssignImportName(
          remoteModuleHref!,
          remoteName!,
          name
        );
      } else {
        let entry = [...this.module.desc.exports].find(
          ([_, desc]) => desc.type === "local" && desc.name === name
        );
        isDefaultExport = entry?.[0] === "default";
        if (isDefaultExport) {
          // check to see if we have already assigned this binding as a result
          // of processing it's consumer
          assignedDefaultName = this.sharedState.assignedImportedNames
            .get(this.module.url.href)
            ?.get("default");
          if (assignedDefaultName) {
            // the consumer of this module has already assigned this name
            assignedName = assignedDefaultName;
          } else {
            if (!assignedDefaultName && name !== "default") {
              // the export is a named default export.
              assignedDefaultName = this.unusedNameLike(name);
            } else if (!assignedDefaultName) {
              // the export is an unnamed default export.
              assignedDefaultName = this.unusedNameLike("_default");
            }
            assignedName = assignedDefaultName;
          }
          this.assignLocalName("default", assignedName);
        } else if (entry?.[0]) {
          assignedName = this.maybeAssignImportName(
            this.module.url.href,
            entry[0],
            name
          );
        } else {
          assignedName = this.unusedNameLike(name);
        }

        this.assignLocalName(name, assignedName);
      }
      this.claimAndRename(this.module.url.href, name, assignedName);
    }

    let myAssignment = this.assignments.find(
      (a) => a.module.url.href === this.module.url.href
    );
    if (!myAssignment) {
      throw new Error(
        `bug: could not module assignment ${this.module.url.href}`
      );
    }
    // rewrite dynamic imports to use bundle specifiers
    for (let [index, importDesc] of this.module.desc.imports.entries()) {
      if (!importDesc.isDynamic) {
        continue;
      }
      let dep = this.module.resolvedImports[index];
      let depAssignment = this.assignments.find(
        (a) => a.module.url.href === dep.url.href
      );
      if (!depAssignment) {
        throw new Error(
          `bug: could not find assignment for module ${dep.url.href} which is imported by ${this.module.url.href}`
        );
      }
      let bundleSpecifier = `"${maybeRelativeURL(
        depAssignment.bundleURL,
        myAssignment.bundleURL
      )}"`;
      this.editor.replace(importDesc.specifierRegion, bundleSpecifier);
    }

    // a reexport of a default export from the entrypoint results in a binding
    // that we have not encountered from the consuming side, so providing an
    // available default name to use in that scenario (as well as
    // assignedDefaultName which will give us a nice name based on how the
    // consumer named the default export).
    this.editor.removeImportsAndExports(
      assignedDefaultName ?? this.unusedNameLike("_default")
    );
  }

  private assignLocalName(name: string, assignedName: string) {
    let nameAssignments = this.sharedState.assignedLocalNames.get(
      this.module.url.href
    );
    if (!nameAssignments) {
      nameAssignments = new Map<string, string>();
      this.sharedState.assignedLocalNames.set(
        this.module.url.href,
        nameAssignments
      );
    }
    nameAssignments.set(name, assignedName);
  }

  private maybeAssignImportName(
    remoteModuleHref: string,
    remoteName: string | NamespaceMarker,
    suggestedName: string
  ): string {
    let alreadyAssignedName = this.sharedState.assignedImportedNames
      .get(remoteModuleHref)
      ?.get(remoteName);

    if (alreadyAssignedName) {
      return alreadyAssignedName;
    } else {
      let assignedName = this.unusedNameLike(suggestedName);
      this.assignImportName(remoteModuleHref, remoteName, assignedName);
      return assignedName;
    }
  }

  private assignImportName(
    moduleHref: string,
    exportedName: string | NamespaceMarker,
    assignedName: string
  ) {
    let mapping = this.sharedState.assignedImportedNames.get(moduleHref);
    if (!mapping) {
      mapping = new Map();
      this.sharedState.assignedImportedNames.set(moduleHref, mapping);
    }
    mapping.set(exportedName, assignedName);
  }

  private claimAndRename(
    moduleHref: string,
    origName: string,
    newName: string
  ) {
    this.sharedState.usedNames.set(newName, { moduleHref, name: origName });
    if (origName !== newName) {
      this.editor.rename(origName, newName);
    }
  }

  // it's understood that `name` can be in this module's own description's names
  // and that is not a collision because it's not conflicting with itself.
  private unusedNameLike(name: string) {
    let candidate = name;
    let counter = 0;
    while (
      (candidate !== name && this.module.desc.names.has(candidate)) ||
      this.sharedState.usedNames.has(candidate)
    ) {
      candidate = `${name}${counter++}`;
    }
    return candidate;
  }
}

function gatherModuleRewriters(
  rewriters: Map<string, ModuleRewriter>,
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignment[]
) {
  if (state.seenModules.has(module.url.href)) {
    return;
  }
  state.seenModules.add(module.url.href);

  // we intentionally want to perform the module rewriting when we enter the
  // recursive function so that module bindings that are closest to the bundle
  // entrypoint have their names retained so that collisions are more likely the
  // farther away from the module entrypoint that you go.
  let rewriter = new ModuleRewriter(module, state, assignments);

  for (let resolution of module.resolvedImports) {
    if (resolution.type === "cyclic") {
      continue;
    }
    let assignment = assignments.find(
      (a) => a.module.url.href === resolution.url.href
    );
    if (!assignment) {
      throw new Error(`no bundle assignment for module ${resolution.url.href}`);
    }
    if (assignment.bundleURL.href === state.bundle.href) {
      gatherModuleRewriters(rewriters, resolution, state, assignments);
    } else {
      state.consumedBundles.add(assignment.bundleURL.href);

      // discover any static imports for side effect only. these will be imports that
      // are not dynamic and have no binding name associated with them.
      for (let [index, importDesc] of module.desc.imports.entries()) {
        if (
          !importDesc.isDynamic &&
          ![...module.desc.names.values()].find(
            (nameDesc) =>
              nameDesc.type === "import" && nameDesc.importIndex === index
          )
        ) {
          state.sideEffectOnlyImports.add(assignment.bundleURL.href);
        }
      }
    }
  }

  // we intentionally add modules to the map of rewriters when we exit the
  // recursion so that the order in which modules are added to the map will be
  // the dependencies first to ultimately entrypoints last. The preserves
  // the order of any side effects in the modules.
  rewriters.set(module.url.href, rewriter);

  // Additionally, at this point all of our dependencies should have been
  // assigned names, so we can populate the sharedState.bindingDependsOn
  // with our modules binding dependencies using their assigned names.
  setBindingDependencies(rewriter.module, state, assignments);
}

function setBindingDependencies(
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignment[]
) {
  for (let [originalName, desc] of module.desc.names) {
    let currentModule: ModuleResolution | CyclicModuleResolution = module;
    let name: string | undefined;
    // ignore circular dependencies (which is the result of recursion) so we
    // don't end up with cycles in our graph
    let originalDependsOn = [...desc.dependsOn].filter(
      (d) => d !== originalName
    );

    if (desc.type === "local" && !desc.original) {
      name = state.assignedLocalNames
        .get(currentModule.url.href)
        ?.get(originalName);
    } else if (desc.type === "local" && desc.original) {
      name = state.assignedImportedNames
        .get(desc.original.moduleHref)
        ?.get(desc.original.exportedName);
    } else if (desc.type === "import") {
      // the module that holds the binding dependency to set is actually a
      // different module. follow the export to get to the module where the
      // binding is declared locally
      let outsideName: string | NamespaceMarker | undefined;
      let importedModule = module.resolvedImports[desc.importIndex];
      if (importedModule.type === "cyclic") {
        continue;
      }
      currentModule = importedModule;
      ({ module: currentModule, name: outsideName } = resolveReexport(
        desc.name,
        currentModule
      ));
      let localName: string | undefined;
      if (outsideName && isNamespaceMarker(outsideName)) {
        localName = state.assignedImportedNames
          .get(currentModule.url.href)
          ?.get(outsideName)!;
        originalDependsOn = [
          ...originalDependsOn,
          ...([...currentModule.desc.exports.values()]
            .filter((e) => e.type === "local")
            .map((e) => e.name) as string[]), // the filter for type="local" strips out the namespace markers, but typescript can't see through this filter, hence the cast
        ];
      } else if (outsideName) {
        let exportDesc = currentModule.desc.exports.get(outsideName)!;
        if (exportDesc.type === "local") {
          localName = exportDesc.name;
        } else {
          throw new Error(
            `bug: unexpected reexport encountered in export description for binding '${outsideName}' of module ${currentModule.url.href}`
          );
        }
      }
      if (!localName) {
        throw new Error(
          `bug: could not determine the local name for the binding in ${module.url.href} that was imported as '${outsideName}' from ${currentModule.url.href}`
        );
      }

      let ourBundleURL = assignments.find(
        ({ module: m }) => m.url.href === module.url.href
      )!.bundleURL;
      let bindingsBundleURL = assignments.find(
        ({ module: m }) => m.url.href === currentModule.url.href
      )!.bundleURL;
      // determine if the binding we are looking for is in our bundle or another bundle
      if (ourBundleURL === bindingsBundleURL) {
        if (isNamespaceMarker(outsideName)) {
          name = state.assignedImportedNames
            .get(currentModule.url.href)
            ?.get(NamespaceMarker);
        } else {
          name =
            state.assignedLocalNames
              .get(currentModule.url.href)
              ?.get(localName) ??
            // also need to check assigned imported names as our binding might be
            // explicitly imported and then explicitly exported
            state.assignedImportedNames
              .get(currentModule.url.href)
              ?.get(localName);
          originalDependsOn = [
            ...currentModule.desc.names.get(localName)!.dependsOn,
          ].filter((d) => d !== localName);
        }
      } else {
        // the binding we are dealing with originates from another bundle.
        // terminate the search for this binding in the currentModule and use
        // the assigned import name for the localName we have at hand.
        name = state.assignedImportedNames
          .get(currentModule.url.href)
          ?.get(isNamespaceMarker(outsideName) ? NamespaceMarker : localName);
        // we don't want to track the consumption of bindings in a different bundle
        originalDependsOn = [];
      }
    }

    if (!name) {
      throw new Error(
        `bug: can't find name assignment for the binding '${originalName}' in module: ${module.url.href}`
      );
    }

    if (
      [...module.desc.names].find(([, d]) =>
        [...d.bindingsConsumedByDeclarationSideEffects].includes(originalName)
      )
    ) {
      state.sideEffectsDependOn.add(name);
    }

    if (desc.usedByModule) {
      state.bundleDependsOn.add(name);
    }

    let dependsOn = state.bindingDependsOn.get(name);
    if (!dependsOn) {
      dependsOn = new Set<string>();
      state.bindingDependsOn.set(name, dependsOn);
    }

    for (let originalDepName of originalDependsOn) {
      let depName: string;
      let desc = currentModule.desc.names.get(originalDepName);
      if (!desc) {
        // this would happen for a global, like "console.log()", just add it
        dependsOn.add(originalDepName);
        continue;
      }
      if (desc.type === "import") {
        if (currentModule.type === "cyclic") {
          throw new Error(
            `bug: don't know how to deal with a cyclic edge when resolving binding dependencies for '${originalName}' in module ${currentModule.url.href}`
          );
        }
        let depModule = currentModule.resolvedImports[desc.importIndex];
        let { name: remoteName, module: remoteModule } = resolveReexport(
          desc.name,
          depModule
        );
        depName = state.assignedImportedNames
          .get(remoteModule.url.href)!
          .get(remoteName)!;
      } else {
        depName = state.assignedLocalNames
          .get(currentModule.url.href)!
          .get(originalDepName)!;
      }
      if (depName) {
        dependsOn.add(depName);
      }
    }
  }
}

function isConsumedBy(
  consumingBinding: string,
  consumedBinding: string,
  bindingDependencies: State["bindingDependsOn"],
  cache: Map<string, Map<string, boolean>>,
  bundle: URL,
  visitedConsumers: string[] = []
): boolean {
  if (!cache.has(consumingBinding)) {
    cache.set(consumingBinding, new Map());
  }
  let consumesCache = cache.get(consumingBinding);
  if (consumesCache?.has(consumedBinding)) {
    return consumesCache.get(consumingBinding)!;
  }

  // Collapse cycles in binding consumption which are likely the result of recursion
  if (visitedConsumers.includes(consumingBinding)) {
    consumesCache?.set(consumedBinding, true);
    return true;
  }
  visitedConsumers = [...visitedConsumers, consumingBinding];
  let deps = bindingDependencies.get(consumingBinding);
  if (!deps) {
    return false;
  }
  if (deps.has(consumedBinding)) {
    return true;
  }

  let result = [...deps].some((dep) =>
    isConsumedBy(
      dep,
      consumedBinding,
      bindingDependencies,
      cache,
      bundle,
      visitedConsumers
    )
  );
  consumesCache?.set(consumedBinding, result);
  return result;
}

function assignedExports(
  bundleURL: URL,
  ownAssignments: BundleAssignment[],
  assignments: BundleAssignment[],
  state: State
): {
  exports: Map<string, string>; // outside name -> inside name
  reexports: Map<string, Map<string, string>>; // bundle href -> [outside name => inside name]
} {
  let exports: Map<string, string> = new Map();
  let reexports: Map<string, Map<string, string>> = new Map();
  for (let assignment of ownAssignments) {
    for (let [original, exposed] of assignment.exposedNames) {
      let {
        module,
      }: { module: ModuleResolution | CyclicModuleResolution } = assignment;
      if (
        (typeof original === "string" &&
          module.desc.exports.get(original)?.type === "reexport") ||
        (typeof original === "string" &&
          module.desc.names.get(original)?.type === "import" &&
          [...module.desc.exports.values()].find((e) => e.name === original))
      ) {
        ({ name: original, module } = resolveReexport(original, module));
        let reexportAssignment = assignments.find(
          (a) => a.module.url.href === module.url.href
        );
        if (
          reexportAssignment?.bundleURL.href !== bundleURL.href &&
          typeof original === "string"
        ) {
          let bundleReexports = reexports.get(
            reexportAssignment!.bundleURL.href
          );
          if (!bundleReexports) {
            bundleReexports = new Map();
            reexports.set(reexportAssignment!.bundleURL.href, bundleReexports);
          }
          bundleReexports.set(exposed, original);
          continue;
        }
      }
      let insideName: string | undefined;
      if (original === "default") {
        // we first check for bindings local to the module in question, and then
        // we'll expand our search to bindings that have been reexported from
        // the binding in question
        insideName =
          state.assignedLocalNames.get(module.url.href)?.get(original) ??
          state.assignedImportedNames.get(module.url.href)?.get(original);
      } else {
        insideName =
          typeof original === "string"
            ? state.assignedLocalNames.get(module.url.href)?.get(original)
            : undefined;
        insideName =
          insideName ??
          state.assignedImportedNames.get(module.url.href)?.get(original);
      }

      if (!insideName) {
        throw new Error(`bug: no internal mapping for '${exposed}'`);
      }
      exports.set(exposed, insideName);
    }
  }
  return { exports, reexports };
}

function makeLocalNamespaces(
  module: ModuleResolution,
  bundleURL: URL,
  assignments: BundleAssignment[],
  state: State
): { code: string; bindingName: string }[] {
  let results: { code: string; bindingName: string }[] = [];
  for (let desc of module.desc.names.values()) {
    if (desc.type !== "import" || !isNamespaceMarker(desc.name)) {
      continue;
    }
    let { module: importedModule } = resolveReexport(
      desc.name,
      module.resolvedImports[desc.importIndex]
    );
    let assignment = assignments.find(
      (a) => a.module.url.href === importedModule.url.href
    );
    if (assignment?.bundleURL.href !== bundleURL.href) {
      continue;
    }

    let namespaceDeclaration: string[] = [];
    let nameMappings = state.assignedImportedNames.get(
      importedModule.url.href
    )!;
    let bindingName = nameMappings.get(NamespaceMarker)!;
    namespaceDeclaration.push(`const ${bindingName} = {`);
    let declarators: string[] = [];
    for (let [
      exportedName,
      exportDesc,
    ] of importedModule.desc.exports.entries()) {
      if (exportDesc.type !== "local") {
        continue;
      }
      let assignedName = nameMappings.get(exportedName)!;
      if (exportedName === assignedName) {
        declarators.push(exportedName);
      } else {
        declarators.push(`${exportedName}: ${assignedName}`);
      }
    }
    namespaceDeclaration.push(declarators.join(", "));
    namespaceDeclaration.push(`};`);
    results.push({ code: namespaceDeclaration.join(" "), bindingName });
  }
  return results;
}

function assignedImports(
  assignments: BundleAssignment[],
  state: State,
  removedBindings: Set<string>
): {
  namedImports: Map<string, Map<string, string>>; // bundleHref => <exposedName => localname>
  namespaceImports: Map<string, string>; // bundleHref => localname
} {
  let namedImports: Map<string, Map<string, string>> = new Map();
  let namespaceImports: Map<string, string> = new Map();
  for (let [moduleHref, mappings] of state.assignedImportedNames) {
    let assignment = assignments.find((a) => a.module.url.href === moduleHref)!;
    if (!assignment) {
      // this binding is actually a local binding that originally was imported
      // into a module that this bundle includes
      continue;
    }
    if (assignment.bundleURL.href === state.bundle.href) {
      // internal, no import needed
      continue;
    }
    if (
      [...mappings.values()].every((localName) =>
        removedBindings.has(localName)
      )
    ) {
      continue; // skip over this import--it's actually unconsumed
    }

    let importsFromBundle = namedImports.get(assignment.bundleURL.href);
    if (!importsFromBundle) {
      importsFromBundle = new Map();
      namedImports.set(assignment.bundleURL.href, importsFromBundle);
    }
    for (let [exportedName, localName] of mappings) {
      if (isNamespaceMarker(exportedName)) {
        namespaceImports.set(assignment.bundleURL.href, localName);
        continue;
      }
      let exposedName = assignment.exposedNames.get(exportedName);
      if (!exposedName) {
        // check to see if this is actually a reexport that is being projected
        // to the bundle's entrypoint
        let entrypointAssignment = assignments.find(
          (a) => a.module.url.href === assignment.entrypointModuleURL.href
        );
        if (entrypointAssignment) {
          let { name, module } = resolveReexport(
            localName,
            entrypointAssignment.module
          );
          let reexportedName = state.assignedImportedNames
            .get(module.url.href)
            ?.get(name);
          if (
            module.url.href === assignment.module.url.href &&
            reexportedName
          ) {
            exposedName = entrypointAssignment.exposedNames.get(reexportedName);
          }
        }
        if (!exposedName) {
          throw new Error(
            `bug: tried to import ${exportedName} from ${moduleHref} from another bundle, but it's not exposed`
          );
        }
      }
      importsFromBundle.set(exposedName, localName);
    }
  }
  return { namedImports, namespaceImports };
}

function resolveReexport(
  name: string | NamespaceMarker,
  module: ModuleResolution | CyclicModuleResolution
): {
  name: string | NamespaceMarker;
  module: ModuleResolution | CyclicModuleResolution;
} {
  if (isNamespaceMarker(name)) {
    return { name, module };
  }
  let remoteDesc = module.desc.exports.get(name);
  if (
    (remoteDesc?.type === "reexport" ||
      (remoteDesc?.type == "local" &&
        module.desc.names.get(remoteDesc.name)?.type === "import")) &&
    module.type === "standard"
  ) {
    if (remoteDesc.type === "reexport") {
      return resolveReexport(
        remoteDesc.name,
        module.resolvedImports[remoteDesc.importIndex]
      );
    } else {
      let localDesc = module.desc.names.get(
        remoteDesc.name
      )! as ImportedNameDescription;
      return resolveReexport(
        localDesc.name,
        module.resolvedImports[localDesc.importIndex]
      );
    }
  } else if (remoteDesc?.type === "reexport" && module.type === "cyclic") {
    throw new Error(
      `Bindings can cannot form a cycle. Encountered a cyclic resolution for '${name}' in ${module.url.href}`
    );
  }
  return { name, module };
}
