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
import { NamespaceMarker, isNamespaceMarker } from "./describe-module";
import { Memoize } from "typescript-memoize";

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
    string, // TODO: back to weakmap with ModuleResolution here. Update test helper to do identity mapping.
    Map<string | NamespaceMarker, string>
  >;
}

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

class ModuleRewriter {
  private module: ModuleResolution;

  // shared between all ModuleRewriters in the same bundle
  private sharedState: State;

  constructor(private path: NodePath<Program>, context: PluginContext) {
    this.module = context.opts.module;
    this.sharedState = context.opts.state;
  }

  @Memoize()
  private get importedNames(): Map<
    string,
    {
      remoteName: string | typeof NamespaceMarker;
      remoteModule: ModuleResolution;
    }
  > {
    let output: Map<
      string,
      { remoteName: string; remoteModule: ModuleResolution }
    > = new Map();
    for (let imp of Object.values(this.module.imports)) {
      for (let [localName, remoteName] of imp.desc.names) {
        output.set(localName, { remoteName, remoteModule: imp.resolution });
      }
    }
    return output;
  }

  @Memoize()
  private get exportedLocalNames(): Map<string, string> {
    let result = new Map();
    for (let [outsideName, insideName] of this.module.exports.exportedNames) {
      result.set(insideName, outsideName);
    }
    return result;
  }

  rewriteScope() {
    for (let name of Object.keys(this.path.scope.bindings)) {
      let assignedName: string;

      // figure out which names in module scope are imports vs things that
      // live inside this module
      let nameIsImported = this.importedNames.get(name);
      if (nameIsImported) {
        let { remoteName, remoteModule } = resolveReexport(nameIsImported);
        assignedName = this.maybeAssignImportName(
          remoteModule,
          remoteName,
          name
        );
      } else {
        // Check to see if the name is actually our export in which case we
        // should use the established assignment for this binding, or create a
        // new one (strive to preserve the exported names when possible)
        let outsideName = this.exportedLocalNames.get(name);
        if (outsideName) {
          assignedName = this.maybeAssignImportName(
            this.module,
            outsideName,
            name
          );
        } else {
          assignedName = this.unusedNameLike(name);
        }
      }
      this.claimAndRename(name, assignedName);
    }
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
      this.path.scope.rename(origName, newName);
    }
  }

  // it's understood that `name` can be in `path.scope.bindings` and that is not a
  // collision because it's not conflicting with itself.
  private unusedNameLike(name: string) {
    let candidate = name;
    let counter = 0;
    while (
      (candidate !== name && candidate in this.path.scope.bindings) ||
      this.sharedState.usedNames.has(candidate)
    ) {
      candidate = `${name}${counter++}`;
    }
    return candidate;
  }
}

function adjustModulePlugin(): unknown {
  const visitor = {
    Program(path: NodePath<Program>, context: PluginContext) {
      let rewriter = new ModuleRewriter(path, context);
      rewriter.rewriteScope();
    },

    ExportNamedDeclaration(
      path: NodePath<ExportNamedDeclaration>,
      context: PluginContext
    ) {
      let { module, assignments } = context.opts;
      let bundle = assignments.bundleFor(module.url);
      if (
        bundle.exposedModules.map((m) => m.url.href).includes(module.url.href)
      ) {
        return; // don't change the exports of the exposed modules--they are sacrosanct
      }

      if (path.node.declaration) {
        path.replaceWith(path.node.declaration);
      } else {
        path.remove();
      }
    },

    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      path.remove();
    },
  };
  return { visitor };
}

function resolveReexport({
  remoteName,
  remoteModule,
}: {
  remoteName: string | NamespaceMarker;
  remoteModule: ModuleResolution;
}): { remoteName: string | NamespaceMarker; remoteModule: ModuleResolution } {
  if (isNamespaceMarker(remoteName)) {
    return { remoteName, remoteModule };
  }
  if (remoteModule.exports.reexports.has(remoteName)) {
    let reexportedFrom = Object.values(remoteModule.imports).find((m) =>
      m.desc.reexports.has(remoteName!)
    )!;

    return resolveReexport({
      remoteName: remoteModule.exports.reexports.get(remoteName)!,
      remoteModule: reexportedFrom.resolution,
    });
  }
  return { remoteName, remoteModule };
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
