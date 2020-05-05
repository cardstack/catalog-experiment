import { parse, transformFromAstSync } from "@babel/core";
import generate from "@babel/generator";
import {
  Statement,
  ExportSpecifier,
  ExportNamedDeclaration,
  ImportDeclaration,
  Program,
  isVariableDeclarator,
  isClassDeclaration,
  isFunctionDeclaration,
} from "@babel/types";
import { BundleAssignments } from "./nodes/bundle";
import { assertNever } from "./util";
import { NodePath } from "@babel/traverse";
import { ModuleResolution } from "./nodes/resolution";
import { NamespaceMarker, isNamespaceMarker } from "./describe-module";
import { Memoize } from "typescript-memoize";

export function combineModules(
  bundle: URL,
  assignments: BundleAssignments
): string {
  let bundleAst = parse("");
  if (bundleAst?.type !== "File") {
    throw new Error(`Empty bundle AST is not a 'File' type`);
  }
  let state: State = {
    bundle,
    usedNames: new Set(),
    assignedImportedNames: new Map(),
  };
  let appendedModules: Set<string> = new Set();
  let bundleBody = bundleAst.program.body;

  // handle the entry module we represent, if any
  let entryModule = assignments.entrypointInBundle(bundle);
  if (entryModule) {
    appendToBundle(
      bundleBody,
      entryModule,
      state,
      assignments,
      appendedModules
    );
  }

  // handle the exported names we must expose, if any
  for (let exp of assignments.exportsFromBundle(bundle).values()) {
    appendToBundle(bundleBody, exp.module, state, assignments, appendedModules);
  }

  let { code } = generate(bundleAst);
  return code;
}

interface State {
  bundle: URL;

  usedNames: Set<string>;

  // outer map is the href of the exported module. the inner map goes from
  // exported name to our name. our name also must appear in usedNames.
  assignedImportedNames: Map<string, Map<string | NamespaceMarker, string>>;
}

function appendToBundle(
  bundleBody: Statement[],
  module: ModuleResolution,
  state: State,
  assignments: BundleAssignments,
  appendedModules: Set<string>
) {
  if (appendedModules.has(module.url.href)) {
    return;
  }
  appendedModules.add(module.url.href);
  let adjusted = adjustModule(module, state, assignments);
  for (let { resolution } of Object.values(module.imports)) {
    appendToBundle(bundleBody, resolution, state, assignments, appendedModules);
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
  rewriter: ModuleRewriter;
}

class ModuleRewriter {
  private module: ModuleResolution;
  private assignments: BundleAssignments;

  // shared between all ModuleRewriters in the same bundle
  private sharedState: State;

  constructor(private programPath: NodePath<Program>, config: PluginConfig) {
    this.module = config.module;
    this.sharedState = config.state;
    this.assignments = config.assignments;
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

  @Memoize()
  private get exportedBundleNames(): Map<
    string, // module href
    Map<string, string> // key is inside name, value is outside name
  > {
    let result = new Map();
    let bundleExports = this.assignments.exportsFromBundle(
      this.sharedState.bundle
    );
    for (let [outsideName, { name: insideName, module }] of bundleExports) {
      let insideMapping = result.get(module.url.href);
      if (!insideMapping) {
        insideMapping = new Map();
        result.set(module.url.href, insideMapping);
      }
      insideMapping.set(insideName, outsideName);
    }
    return result;
  }

  @Memoize()
  private get bundleExports(): ReturnType<
    BundleAssignments["exportsFromBundle"]
  > {
    return this.assignments.exportsFromBundle(this.sharedState.bundle);
  }

  rewriteExportNamedDeclaration(
    path: NodePath<ExportNamedDeclaration>,
    _context: PluginContext
  ) {
    let exportSpecifiers = path.node.specifiers.filter(
      (s) => s.type === "ExportSpecifier"
    ) as ExportSpecifier[];

    let hasDeclarations = Array.isArray(path.node.declaration?.declarations);
    if (hasDeclarations) {
      let retainExports = false;
      for (let declaration of path.node.declaration.declarations) {
        if (isVariableDeclarator(declaration)) {
          switch (declaration.id.type) {
            case "Identifier":
              let localName = declaration.id.name;
              if (
                this.exportedBundleNames.has(this.module.url.href) &&
                this.exportedBundleNames
                  .get(this.module.url.href)
                  ?.has(localName)
              ) {
                // this is a bundle export--leave it alone
                retainExports = true;
                break;
                // TODO need to split the exported names from the non-exported names
              }
            case "ArrayPattern":
            case "AssignmentPattern":
            case "MemberExpression":
            case "ObjectPattern":
            case "RestElement":
            case "TSParameterProperty":
              // TODO
              break;
            default:
              assertNever(declaration.id);
          }
        }
      }
      // return out of this method, we want to retain the exports
      if (retainExports) {
        return;
      }
    } else if (
      path.node.declaration &&
      isFunctionDeclaration(path.node.declaration)
    ) {
      if (path.node.declaration.id == null) {
        throw new Error(
          `Should never have a named export function declaration without an id`
        );
      }
      if (
        this.exportedBundleNames.has(this.module.url.href) &&
        this.exportedBundleNames
          .get(this.module.url.href)
          ?.has(path.node.declaration.id.name)
      ) {
        // this is a bundle export--leave it alone
        return;
      }
    } else if (
      path.node.declaration &&
      isClassDeclaration(path.node.declaration)
    ) {
      switch (
        path.node.declaration.id.type // ugh, this type sucks :-(
      ) {
        case "Identifier":
          if (
            this.exportedBundleNames.has(this.module.url.href) &&
            this.exportedBundleNames
              .get(this.module.url.href)
              ?.has(path.node.declaration.id.name)
          ) {
            // this is a bundle export--leave it alone
            return;
          }
        default:
          throw new Error("unimplemented");
      }
    } else if (exportSpecifiers.length > 0) {
      let changedSpecifiers = false;
      let retainExports = false;
      for (let specifier of exportSpecifiers) {
        switch (specifier.exported.type) {
          case "Identifier":
            let name = specifier.exported.name;
            if (
              this.exportedBundleNames.has(this.module.url.href) &&
              this.exportedBundleNames.get(this.module.url.href)?.has(name)
            ) {
              // this is a bundle export's inside name, we need to make sure to
              // rename the export to the outside name
              let exportedName = this.exportedBundleNames
                .get(this.module.url.href)!
                .get(name);
              if (name !== exportedName) {
                changedSpecifiers = true;
                specifier.exported.name = exportedName;
              } else {
                retainExports = true;
              }
              // TODO need to split the exported names from the non-exported names
            } else if (
              this.bundleExports.get(name)?.module.url.href ===
              this.module.url.href
            ) {
              // this is the bundle export's outside name, just leave it alone
              retainExports = true;
            }
            break;

          default:
            assertNever(specifier.exported.type);
        }
      }

      if (changedSpecifiers) {
        // this will trigger a new ExportNamedDeclaration call, but with the outside name
        path.replaceWith({ ...path.node, specifiers: exportSpecifiers });
        return;
      }

      // return out of this method, we want to retain the exports
      if (retainExports) {
        return;
      }
    }

    if (path.node.declaration) {
      path.replaceWith(path.node.declaration);
    } else {
      path.remove();
    }
  }

  rewriteScope() {
    for (let name of Object.keys(this.programPath.scope.bindings)) {
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
        if (this.exportedBundleNames.get(this.module.url.href)?.has(name)) {
          // this is a bundle export--it's name has been set already been
          // reserved, use the assigned export name for this binding
          assignedName = this.exportedBundleNames
            .get(this.module.url.href)!
            .get(name)!;
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
      this.sharedState.usedNames.has(candidate) ||
      this.bundleExports.has(candidate)
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
