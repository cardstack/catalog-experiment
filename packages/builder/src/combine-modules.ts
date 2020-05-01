import { parse, transformFromAstSync } from "@babel/core";
import generate from "@babel/generator";
import {
  Statement,
  ExportNamedDeclaration,
  ImportDeclaration,
  Program,
} from "@babel/types";
import { Bundle, BundleAssignments } from "./nodes/bundle";
import { NodePath } from "@babel/traverse";
import { ModuleResolution } from "./nodes/resolution";

export function combineModules(
  bundle: Bundle,
  assignments: BundleAssignments
): string {
  let bundleAst = parse("");
  if (bundleAst?.type !== "File") {
    throw new Error(`Empty bundle AST is not a 'File' type`);
  }
  let state: State = {
    usedNames: new Set(),
    assignedImportedNames: new Map(),
  };
  let bundleBody = bundleAst.program.body;
  for (let module of bundle.exposedModules) {
    appendToBundle(bundleBody, module, state, assignments);
  }

  let { code } = generate(bundleAst);
  return code;
}

interface State {
  usedNames: Set<string>;

  // outer map is the href of the exported module. the inner map goes from
  // exported name to our name. our name also must appear in usedNames.
  assignedImportedNames: Map<
    string,
    Map<string | typeof NamespaceMarker, string>
  >;
}

const NamespaceMarker = { isNamespace: true };

function appendToBundle(
  bundleBody: Statement[],
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignments,
  appendedModules: string[] = []
) {
  let adjusted = adjustModule(module, state, assignments);
  for (let { resolution } of Object.values(module.imports)) {
    if (!appendedModules.includes(resolution.url.href)) {
      appendToBundle(
        bundleBody,
        resolution,
        state,
        assignments,
        appendedModules
      );
      appendedModules.push(resolution.url.href);
    }
  }
  bundleBody.push(...adjusted.program.body);
}

function adjustModule(
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignments
) {
  let config: PluginConfig = { state, module, assignments };
  let result = transformFromAstSync(module.parsed, undefined, {
    ast: true,
    plugins: [[adjustModulePlugin, config]],
  });
  if (!result?.ast) {
    throw new Error(`transformed AST is null`);
  }
  return result.ast;
}

interface PluginConfig {
  assignments: BundleAssignments;
  module: ModuleResolution;
  state: State;
}

interface PluginContext {
  opts: PluginConfig;
}

function adjustModulePlugin(): unknown {
  const visitor = {
    Program(path: NodePath<Program>, context: PluginContext) {
      let { module, assignments, state } = context.opts;
      let { usedNames, assignedImportedNames } = state;
      let localAssignments = new Set<string>();
      for (let name of Object.keys(path.scope.bindings)) {
        // figure out which names in module scope are imports vs things that
        // live inside this module
        let isImported = false;
        for (let imp of Object.values(module.imports)) {
          let remoteName = imp.desc.names.get(name);
          if (remoteName) {
            // name is imported
            isImported = true;
            let mapping = assignedImportedNames.get(imp.resolution.url.href);
            if (!mapping) {
              mapping = new Map();
              assignedImportedNames.set(imp.resolution.url.href, mapping);
            }
            let assignedName = mapping.get(remoteName);
            if (!assignedName) {
              assignedName = unusedNameLike(
                name,
                path as NodePath<unknown>,
                usedNames,
                true
              );
              if (!localAssignments.has(assignedName)) {
                usedNames.add(assignedName);
                mapping.set(remoteName, assignedName);
                localAssignments.add(assignedName);
              }
            }
            if (name !== assignedName && !localAssignments.has(assignedName)) {
              path.scope.rename(name, assignedName);
            }
          } else if (imp.desc.namespace.includes(name)) {
            isImported = true;
            // name is imported, like "import * as name from..."
            throw new Error(`unimplemented`);
          }
        }

        if (isImported) {
          continue;
        }

        // Check to see if the name is actually an export in which case
        // we should use the assignment for this binding, or create a new one
        // (strive to preserve the exported names when possible)
        if (module.exports.exportedNames.has(name)) {
          let mapping = assignedImportedNames.get(module.url.href);
          if (!mapping) {
            mapping = new Map();
            assignedImportedNames.set(module.url.href, mapping);
          }
          let assignedName = mapping.get(name);
          if (!assignedName) {
            assignedName = unusedNameLike(
              name,
              path as NodePath<unknown>,
              usedNames,
              true
            );
            if (!localAssignments.has(assignedName)) {
              usedNames.add(assignedName);
              mapping.set(name, assignedName);
              localAssignments.add(assignedName);
            }
          }
          if (name !== assignedName && !localAssignments.has(assignedName)) {
            path.scope.rename(name, assignedName);
          }
        } else {
          if (usedNames.has(name)) {
            let newName = unusedNameLike(
              name,
              path as NodePath<unknown>,
              usedNames
            );
            if (!localAssignments.has(newName)) {
              path.scope.rename(name, newName);
              usedNames.add(newName);
              localAssignments.add(newName);
            }
          } else {
            if (!localAssignments.has(name)) {
              usedNames.add(name);
              localAssignments.add(name);
            }
          }
        }
      }
    },
    ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
      if (path.node.declaration) {
        path.replaceWith(path.node.declaration);
      }
    },
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      path.remove();
    },
  };
  return { visitor };
}

function unusedNameLike(
  name: string,
  path: NodePath<unknown>,
  reserved: Set<string>,
  nameIsFromScopedBindings = false
) {
  let candidate = name;
  let counter = 0;
  while (
    (!nameIsFromScopedBindings && candidate in path.scope.bindings) ||
    reserved.has(candidate)
  ) {
    candidate = `${name}${counter++}`;
  }
  return candidate;
}

/*

  babel has: scope.rename(old, new);
  babel has Object.keys(path.scope.bindings) is all the names in scope at path

  // we called this State["usedNames"] above
  let finalModuleScopeNames = Set<string>;

  //
  let assignedImportedNames: WeakMap<ModuleResolution, Map<exportedName: string, finalModuleScopeName: string>>

  For each module, starting from the bundle.exposedModules and recursing deeper:

    let importedNames = iterate over resolution.imports.@each.desc.names and gather together a reverse mapping from local names to where they come from

    look at all the names in path.scope for the very first NodePath in the module body (so we see the module scope).

    for each name

      if this module is one of the bundle.exposedModules and name is one of our exports

        our choice of new name (for the export!) is already decided in the BundleAssignments. That is not *necessarily* the same as we name it internally.

        must deal carefully with difference between set of names in scope and set of names that are exported

      if importedNames says this name is not something we imported or it's imported from another bundle

        check for collisions with finalModuleScopeNames, and rename it if necessary, adding the new name to finalModuleScopeNames

        in this case, when we encounter the ImportStatement itself we will rewrite it to point at the external bundle

          we can tell how to rewrite it based on assignments.importFor(originalModuleJS, name)

      else

        if not assignedImportedNames already has a final name for the thing I'm importing

          pick a new name that doesn't collide with finalModuleScopeNames. It could even be the original name if nobody claimed it.

          put the new name into both finalModuleScopeNames and assignedImportedNames

        rename the name to the one from assignedImportedNames


*/
