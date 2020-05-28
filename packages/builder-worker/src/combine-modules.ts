import { parse, transformFromAstSync } from "@babel/core";
import generate from "@babel/generator";
import {
  Statement,
  ExportNamedDeclaration,
  exportNamedDeclaration,
  importDeclaration,
  importSpecifier,
  exportSpecifier,
  identifier,
  ImportDeclaration,
  Program,
  stringLiteral,
} from "@babel/types";
import { BundleAssignment } from "./nodes/bundle";
import { NodePath } from "@babel/traverse";
import { ModuleResolution } from "./nodes/resolution";
import { NamespaceMarker, isNamespaceMarker } from "./describe-module";
import { Memoize } from "typescript-memoize";
import { maybeRelativeURL } from "./path";

export function combineModules(
  bundle: URL,
  assignments: BundleAssignment[]
): string {
  let bundleAst = parse("");
  if (bundleAst?.type !== "File") {
    throw new Error(`Empty bundle AST is not a 'File' type`);
  }
  let state: State = {
    bundle,
    usedNames: new Set(),
    assignedImportedNames: new Map(),
    bindingDependsOn: new Map(),
    bundleDependsOn: new Set(),
  };
  let appendedModules: Set<string> = new Set();
  let bundleBody = bundleAst.program.body;
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );

  // handle the exported names we must expose, if any
  for (let assignment of ownAssignments) {
    appendToBundle(
      bundleBody,
      assignment.module,
      state,
      assignments,
      appendedModules
    );
  }

  // at this point we removed all export statements because our modules can
  // directly consume each other's renamed bindings. Here we re-add exports for
  // the things that are specifically configured to be exposed outside the
  // bundle.
  let exports = assignedExports(ownAssignments, state);
  if (exports.size > 0) {
    bundleBody.push(
      exportNamedDeclaration(
        undefined,
        [...exports].map(([outsideName, insideName]) => {
          return exportSpecifier(
            identifier(insideName),
            identifier(outsideName)
          );
        })
      )
    );
  }

  for (let [bundleHref, mapping] of assignedImports(assignments, state)) {
    bundleBody.unshift(
      importDeclaration(
        [...mapping].map(([exportedName, localName]) => {
          return importSpecifier(
            identifier(localName),
            identifier(exportedName)
          );
        }),
        stringLiteral(maybeRelativeURL(new URL(bundleHref, bundle), bundle))
      )
    );
  }

  let { code } = generate(bundleAst);
  return code;
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
  state: State
): Map<string, Map<string, string>> {
  let imports: ReturnType<typeof assignedImports> = new Map();
  for (let [moduleHref, mappings] of state.assignedImportedNames) {
    let assignment = assignments.find((a) => a.module.url.href === moduleHref)!;
    if (assignment.bundleURL.href === state.bundle.href) {
      // internal, no import needed
      continue;
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

interface State {
  bundle: URL;

  usedNames: Set<string>;

  // outer map is the href of the exported module. the inner map goes from
  // exported name to our name. our name also must appear in usedNames.
  assignedImportedNames: Map<string, Map<string | NamespaceMarker, string>>;

  // keys are the module-scoped names within our bundle (same as usedNames).
  // values are lists of other module-scoped names within our bundle that the
  // given binding depends upon.
  bindingDependsOn: Map<string, Set<string>>;

  // similar to bindingDependsOn, these are bindings that are needed by the
  // bundle's top-level module scope itself.
  bundleDependsOn: Set<string>;
}

function appendToBundle(
  bundleBody: Statement[],
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignment[],
  appendedModules: Set<string>
) {
  if (appendedModules.has(module.url.href)) {
    return;
  }
  appendedModules.add(module.url.href);
  let adjusted = adjustModule(module, state, assignments);
  for (let { resolution } of Object.values(module.imports)) {
    let assignment = assignments.find(
      (a) => a.module.url.href === resolution.url.href
    );
    if (!assignment) {
      throw new Error(`no bundle assignment for module ${resolution.url.href}`);
    }
    if (assignment.bundleURL.href === state.bundle.href) {
      appendToBundle(
        bundleBody,
        resolution,
        state,
        assignments,
        appendedModules
      );
    }
  }
  bundleBody.push(...adjusted.program.body);
}

function adjustModule(
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignment[]
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
  assignments: BundleAssignment[];
  module: ModuleResolution;
  state: State;
}

interface PluginContext {
  opts: PluginConfig;
  rewriter: ModuleRewriter;
}

class ModuleRewriter {
  private module: ModuleResolution;

  // shared between all ModuleRewriters in the same bundle
  private sharedState: State;

  constructor(private programPath: NodePath<Program>, config: PluginConfig) {
    this.module = config.module;
    this.sharedState = config.state;
    this.rewriteScope();
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

  rewriteExportNamedDeclaration(
    path: NodePath<ExportNamedDeclaration>,
    _context: PluginContext
  ) {
    if (path.node.declaration) {
      path.replaceWith(path.node.declaration);
    } else {
      path.remove();
    }
  }

  rewriteScope() {
    let bindingPaths: Map<NodePath, string> = new Map();
    for (let [name, binding] of Object.entries(
      this.programPath.scope.bindings
    )) {
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
      bindingPaths.set(binding.path, assignedName);
    }

    for (let binding of Object.values(this.programPath.scope.bindings)) {
      let assignedName = bindingPaths.get(binding.path)!;
      for (let refPath of binding.referencePaths) {
        while (refPath.type !== "Program") {
          // exports are already accounted for globally throughout the bundle.
          // We're about to delete this export statement.
          if (refPath.type === "ExportNamedDeclaration") {
            break;
          }
          let otherName = bindingPaths.get(refPath);
          if (otherName) {
            let deps = this.sharedState.bindingDependsOn.get(otherName);
            if (!deps) {
              deps = new Set();
              this.sharedState.bindingDependsOn.set(otherName, deps);
            }
            deps.add(assignedName);
            break;
          }
          refPath = refPath.parentPath;
        }
        if (refPath.type === "Program") {
          this.sharedState.bundleDependsOn.add(assignedName);
        }
      }
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
      this.programPath.scope.rename(origName, newName);
    }
  }

  // it's understood that `name` can be in `path.scope.bindings` and that is not a
  // collision because it's not conflicting with itself.
  private unusedNameLike(name: string) {
    let candidate = name;
    let counter = 0;
    while (
      (candidate !== name && candidate in this.programPath.scope.bindings) ||
      this.sharedState.usedNames.has(candidate)
    ) {
      candidate = `${name}${counter++}`;
    }
    return candidate;
  }
}

function adjustModulePlugin(): unknown {
  let visitor = {
    Program(path: NodePath<Program>, context: PluginContext) {
      context.rewriter = new ModuleRewriter(path, context.opts);
    },

    ExportNamedDeclaration(
      path: NodePath<ExportNamedDeclaration>,
      context: PluginContext
    ) {
      context.rewriter.rewriteExportNamedDeclaration(path, context);
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
