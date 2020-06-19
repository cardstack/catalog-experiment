import { BundleAssignment } from "./nodes/bundle";
import { ModuleResolution } from "./nodes/resolution";
import { NamespaceMarker, isNamespaceMarker } from "./describe-module";
import { maybeRelativeURL } from "./path";
import { RegionEditor } from "./code-region";

export function combineModules(
  bundle: URL,
  assignments: BundleAssignment[]
): string {
  let state: State = {
    bundle,
    assignedLocalNames: new Map(),
    usedNames: new Set(),
    assignedImportedNames: new Map(),
    bindingDependsOn: new Map(),
    bundleDependsOn: new Set(),
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
  let exports = assignedExports(ownAssignments, state);
  let removedBindings = new Set<string>();
  let consumptionCache = new Map<string, Map<string, boolean>>();
  for (let bindingName of state.usedNames) {
    if (
      [...exports.values()].some(
        (exportedBinding) =>
          exportedBinding === bindingName ||
          isConsumedBy(
            exportedBinding,
            bindingName,
            state.bindingDependsOn,
            consumptionCache
          )
      ) ||
      [...state.bundleDependsOn].some(
        (usedByBundleBinding) =>
          usedByBundleBinding === bindingName ||
          isConsumedBy(
            usedByBundleBinding,
            bindingName,
            state.bindingDependsOn,
            consumptionCache
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
    output.push(rewriter.serialize());
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
        .join(",")
    );
    exportDeclaration.push("};");
    output.push(exportDeclaration.join(" "));
  }

  let importDeclarations: string[] = [];
  for (let [bundleHref, mapping] of assignedImports(
    assignments,
    state,
    removedBindings
  )) {
    let importDeclaration: string[] = [];
    importDeclaration.push("import {");
    importDeclaration.push(
      [...mapping]
        .map(([exportedName, localName]) =>
          exportedName === localName
            ? exportedName
            : `${exportedName} as ${localName}`
        )
        .join(",")
    );
    importDeclaration.push("} from");
    importDeclaration.push(
      `"${maybeRelativeURL(new URL(bundleHref, bundle), bundle)}";`
    );
    importDeclarations.push(importDeclaration.join(" "));
  }
  output.unshift(importDeclarations.join("\n"));

  return output.join("\n").trim();
}

function removeBinding(
  assignedName: string,
  rewriters: Map<string, ModuleRewriter>,
  bundle: URL,
  state: State,
  assignments: BundleAssignment[]
): void {
  let { name, module } = findOriginalBindingDeclaration(
    assignedName,
    rewriters,
    state,
    assignments
  );

  let { bundleURL } = assignments.find(
    ({ module: m }) => m.url.href === module.url.href
  )!;
  // no need to worry about removing bindings that come from other bundles, as
  // we wont even bother writing their import statements in the final steps of
  // the bundle creation since they would be unconsumed.
  if (bundle.href === bundleURL.href) {
    let rewriter = rewriters.get(module.url.href)!;
    rewriter.editor.removeDeclaration(name);
  }
}

function findOriginalBindingDeclaration(
  assignedName: string,
  rewriters: Map<string, ModuleRewriter>,
  state: State,
  assignments: BundleAssignment[]
): { module: ModuleResolution; name: string } {
  let name: string | undefined;
  // these are all the modules that have the declaration for the binding, but
  // we still need to narrow down to which module has the name as a local (vs
  // as an import)
  let modules = [...rewriters.values()]
    .filter(({ module }) =>
      [
        ...(state.assignedLocalNames.get(module.url.href)?.entries() || []),
        ...(state.assignedImportedNames.get(module.url.href)?.entries() || []),
      ].find(([originalName, _assignedName]) => {
        if (
          _assignedName === assignedName &&
          typeof originalName === "string"
        ) {
          // excuse the side effect, I didn't want to do another search just
          // to determine the value that we have easy access to here
          name = originalName;
          return true;
        }
        return false;
      })
    )
    .map(({ module }) => module);

  if (!name) {
    // if we have not found the name it is because it comes from a module that
    // has been assigned to a different bundle. because it comes from a
    // different bundle, the name has never been assigned, so the name being
    // asked about is actually already the original name
    let assignment = assignments.find(({ exposedNames }) =>
      exposedNames.has(assignedName)
    );
    if (assignment) {
      return { name: assignedName, module: assignment.module };
    }
    throw new Error(
      `bug: could not determine the original name and module of the bundle scoped binding (after assignment) of '${assignedName}`
    );
  }
  let module = modules.find(
    (m) =>
      rewriters.get(m.url.href)!.module.desc.names.get(name!)?.type === "local"
  );
  if (!module) {
    throw new Error(
      `bug: could not determine the module that has the local declaration of the binding with the originalName of '${name}' and assigned name of '${assignedName}', that has import declarations in the modules ${modules
        .map((m) => m.url.href)
        .join(", ")}`
    );
  }
  return { name, module };
}

interface State {
  bundle: URL;

  usedNames: Set<string>;

  // outer map is the href of the exported module. the inner map goes from
  // exported name to our name. our name also must appear in usedNames.
  assignedImportedNames: Map<string, Map<string | NamespaceMarker, string>>;

  // This is synonymous with assignedImportedNames, but it's used speicifically
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
}
class ModuleRewriter {
  readonly editor: RegionEditor;

  constructor(readonly module: ModuleResolution, private sharedState: State) {
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
      let assignedName: string;

      // figure out which names in module scope are imports vs things that
      // live inside this module
      if (nameDesc.type === "import") {
        let { name: remoteName, module: remoteModule } = resolveReexport(
          nameDesc.name,
          this.module.resolvedImports[nameDesc.importIndex]
        );
        assignedName = this.maybeAssignImportName(
          remoteModule,
          remoteName,
          name
        );
      } else {
        let entry = [...this.module.desc.exports].find(
          ([_, desc]) => desc.type === "local" && desc.name === name
        );
        if (entry?.[0] === "default" && entry?.[1].name === "default") {
          // we have already assigned this an actual name when we processed it's
          // consumer (and we wouldn't be here if we haven't already processed
          // this export's consumer)
          assignedDefaultName = this.sharedState.assignedImportedNames
            .get(this.module.url.href)
            ?.get("default");
          if (!assignedDefaultName) {
            throw new Error(
              `bug: a name was never assigned to an unnamed default export in module ${this.module.url.href}`
            );
          }
          assignedName = assignedDefaultName;
        } else if (entry?.[0]) {
          assignedName = this.maybeAssignImportName(
            this.module,
            entry[0],
            name
          );
        } else {
          assignedName = this.unusedNameLike(name);
        }

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
      this.claimAndRename(name, assignedName);
    }

    this.editor.removeImportsAndExports(assignedDefaultName);
  }

  private maybeAssignImportName(
    remoteModule: ModuleResolution,
    remoteName: string | NamespaceMarker,
    suggestedName: string
  ): string {
    let alreadyAssignedName = this.sharedState.assignedImportedNames
      .get(remoteModule.url.href)
      ?.get(remoteName);

    if (alreadyAssignedName) {
      return alreadyAssignedName;
    } else {
      let assignedName = this.unusedNameLike(suggestedName);
      this.assignImportName(remoteModule, remoteName, assignedName);
      return assignedName;
    }
  }

  private assignImportName(
    module: ModuleResolution,
    exportedName: string | NamespaceMarker,
    assignedName: string
  ) {
    let mapping = this.sharedState.assignedImportedNames.get(module.url.href);
    if (!mapping) {
      mapping = new Map();
      this.sharedState.assignedImportedNames.set(module.url.href, mapping);
    }
    mapping.set(exportedName, assignedName);
  }

  private claimAndRename(origName: string, newName: string) {
    this.sharedState.usedNames.add(newName);
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
  if (rewriters.has(module.url.href)) {
    return;
  }
  // we intentionally want to perform the module rewriting when we enter the
  // recursive function so that module bindings that are closest to the bundle
  // entrypoint have their names retained so that collisions are more likely the
  // farther away from the modul entrypoint that you go.
  let rewriter = new ModuleRewriter(module, state);

  for (let resolution of module.resolvedImports) {
    let assignment = assignments.find(
      (a) => a.module.url.href === resolution.url.href
    );
    if (!assignment) {
      throw new Error(`no bundle assignment for module ${resolution.url.href}`);
    }
    if (assignment.bundleURL.href === state.bundle.href) {
      gatherModuleRewriters(rewriters, resolution, state, assignments);
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
    let currentModule = module;
    let name: string | undefined;
    let { dependsOn: originalDependsOn } = desc;

    if (desc.type === "local") {
      name = state.assignedLocalNames
        .get(currentModule.url.href)
        ?.get(originalName);
    } else {
      // the module that holds the binding dependency to set is actually a
      // different module. follow the export to get to the module where the
      // binding is declared locally
      let outsideName: string | NamespaceMarker | undefined;
      if (typeof desc.name === "string") {
        currentModule = module.resolvedImports[desc.importIndex];
        ({ module: currentModule, name: outsideName } = resolveReexport(
          desc.name,
          currentModule
        ));
      }
      if (typeof outsideName !== "string" || typeof desc.name !== "string") {
        continue; // namespaces don't have dependencies, just skip over it
      }
      let exportDesc = currentModule.desc.exports.get(outsideName)!;
      let localName = exportDesc.name;
      if (typeof localName !== "string") {
        throw new Error(
          `bug: the local name for the exported name '${outsideName}' in module ${currentModule.url.href} can't be a namespace marker--we skipped over that condition`
        );
      }

      let ourBundleURL = assignments.find(
        ({ module: m }) => m.url.href === module.url.href
      )!.bundleURL;
      let bindingsBundleURL = assignments.find(
        ({ module: m }) => m.url.href === currentModule.url.href
      )!.bundleURL;
      // determine if the beining we are looking for is in our bundle or another bundle
      if (ourBundleURL === bindingsBundleURL) {
        name = state.assignedLocalNames
          .get(currentModule.url.href)
          ?.get(localName);
        originalDependsOn = currentModule.desc.names.get(localName)!.dependsOn;
      } else {
        // the binding we are dealing with originates from another bundle.
        // terminate the search for this binding in the currentModule and use
        // the assigned import name for the localName we have at hand.
        name = state.assignedImportedNames
          .get(currentModule.url.href)
          ?.get(localName);
      }
    }

    if (!name) {
      throw new Error(
        `bug: can't find name assignment for the binding '${originalName}' in module: ${module.url.href}`
      );
    }

    if (desc.usedByModule) {
      state.bundleDependsOn.add(name);
    }

    let dependsOn = new Set<string>();
    for (let originalDepName of originalDependsOn) {
      let depName: string;
      let desc = currentModule.desc.names.get(originalDepName);
      if (!desc) {
        // this would happen for a global, like "console.log()", just add it
        dependsOn.add(originalDepName);
        continue;
      }
      if (desc.type === "import" && typeof desc.name === "string") {
        depName = state.assignedImportedNames
          .get(currentModule.resolvedImports[desc.importIndex].url.href)!
          .get(desc.name)!;
      } else {
        depName = state.assignedLocalNames
          .get(currentModule.url.href)!
          .get(originalDepName)!;
      }
      if (depName) {
        dependsOn.add(depName);
      }
    }

    state.bindingDependsOn.set(name, dependsOn);
  }
}

function isConsumedBy(
  consumingBinding: string,
  consumedBinding: string,
  bindingDependencies: State["bindingDependsOn"],
  cache: Map<string, Map<string, boolean>>
): boolean {
  if (!cache.has(consumingBinding)) {
    cache.set(consumingBinding, new Map());
  }
  let consumesCache = cache.get(consumingBinding);
  if (consumesCache?.has(consumedBinding)) {
    return consumesCache.get(consumingBinding)!;
  }

  let deps = bindingDependencies.get(consumingBinding);
  if (!deps) {
    return false;
  }
  if (deps.has(consumedBinding)) {
    return true;
  }

  let result = [...deps].some((dep) =>
    isConsumedBy(dep, consumedBinding, bindingDependencies, cache)
  );
  consumesCache?.set(consumedBinding, result);
  return result;
}

function assignedExports(assignments: BundleAssignment[], state: State) {
  let exports: Map<string, string> = new Map();
  for (let assignment of assignments) {
    for (let [original, exposed] of assignment.exposedNames) {
      let insideName = state.assignedImportedNames
        .get(assignment.module.url.href)
        ?.get(original);
      if (!insideName) {
        throw new Error(`bug: no internal mapping for ${exposed}`);
      }
      exports.set(exposed, insideName);
    }
  }
  return exports;
}

function assignedImports(
  assignments: BundleAssignment[],
  state: State,
  removedBindings: Set<string>
): Map<string, Map<string, string>> {
  let imports: ReturnType<typeof assignedImports> = new Map();
  for (let [moduleHref, mappings] of state.assignedImportedNames) {
    let assignment = assignments.find((a) => a.module.url.href === moduleHref)!;
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

    let importsFromBundle = imports.get(assignment.bundleURL.href);
    if (!importsFromBundle) {
      importsFromBundle = new Map();
      imports.set(assignment.bundleURL.href, importsFromBundle);
    }
    for (let [exportedName, localName] of mappings) {
      let exposedName = assignment.exposedNames.get(exportedName);
      if (!exposedName) {
        throw new Error(
          `bug: tried to import ${exportedName} from ${moduleHref} from another bundle, but it's not exposed`
        );
      }
      importsFromBundle.set(exposedName, localName);
    }
  }
  return imports;
}

function resolveReexport(
  name: string | NamespaceMarker,
  module: ModuleResolution
): { name: string | NamespaceMarker; module: ModuleResolution } {
  if (isNamespaceMarker(name)) {
    return { name, module };
  }
  let remoteDesc = module.desc.exports.get(name)!;
  if (remoteDesc.type === "reexport") {
    return resolveReexport(
      remoteDesc.name,
      module.resolvedImports[remoteDesc.importIndex]
    );
  }
  return { name, module };
}
