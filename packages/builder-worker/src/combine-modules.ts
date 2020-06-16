import { parse, transformFromAstSync } from "@babel/core";
import generate from "@babel/generator";
import {
  Statement,
  Expression,
  ExportNamedDeclaration,
  exportNamedDeclaration,
  importDeclaration,
  importSpecifier,
  exportSpecifier,
  identifier,
  variableDeclaration,
  variableDeclarator,
  ImportDeclaration,
  Program,
  stringLiteral,
} from "@babel/types";
import { BundleAssignment } from "./nodes/bundle";
import { NodePath } from "@babel/traverse";
import { ModuleResolution } from "./nodes/resolution";
import { NamespaceMarker, isNamespaceMarker } from "./describe-module";
import { maybeRelativeURL } from "./path";
import { assertNever } from "shared/util";
import upperFirst from "lodash/upperFirst";
import { RegionEditor } from "./code-region";

export function combineModules(
  bundle: URL,
  assignments: BundleAssignment[]
): string {
  let modules = [];
  let editors = new Map();
  let usedNames: Set<string> = new Set();

  for (let assignment of assignments) {
    if (assignment.bundleURL.href !== bundle.href) {
      continue;
    }
    let editor = new RegionEditor(
      assignment.module.source,
      assignment.module.desc,
      () => {
        throw new Error("unimplemented");
      }
    );
    editors.set(assignment.module, editor);
    modules.push(assignment.module);
    editor.removeImportsAndExports();
    for (let [name, nameDesc] of assignment.module.desc.names) {
      let assignedName = name;
      if (usedNames.has(name)) {
        assignedName = unusedNameLike(name, usedNames);
        editor.rename(name, assignedName);
      }
      usedNames.add(assignedName);
    }
  }
  let output = [];
  for (let module of modules) {
    output.push(editors.get(module).serialize());
  }
  return output.join("\n");
}

function unusedNameLike(name: string, usedNames: Set<string>) {
  let candidate = name;
  let counter = 0;
  while (usedNames.has(candidate)) {
    candidate = `${name}${counter++}`;
  }
  return candidate;
}

export function xcombineModules(
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
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );

  // handle the exported names we must expose, if any
  let potentialBundleAppends: Statement[] = [];
  for (let assignment of ownAssignments) {
    gatherBundleStatements(
      potentialBundleAppends,
      assignment.module,
      state,
      assignments,
      appendedModules
    );
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
  }

  appendToBody(bundleAst.program.body, potentialBundleAppends, removedBindings);

  // at this point we removed all export statements because our modules can
  // directly consume each other's renamed bindings. Here we re-add exports for
  // the things that are specifically configured to be exposed outside the
  // bundle.
  if (exports.size > 0) {
    bundleAst.program.body.push(
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

  for (let [bundleHref, mapping] of assignedImports(
    assignments,
    state,
    removedBindings
  )) {
    bundleAst.program.body.unshift(
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

function gatherBundleStatements(
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
  for (let resolution of module.resolvedImports) {
    let assignment = assignments.find(
      (a) => a.module.url.href === resolution.url.href
    );
    if (!assignment) {
      throw new Error(`no bundle assignment for module ${resolution.url.href}`);
    }
    if (assignment.bundleURL.href === state.bundle.href) {
      gatherBundleStatements(
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

  rewriteExportDefaultDeclaration(
    path: NodePath<ExportNamedDeclaration>,
    _context: PluginContext
  ) {
    let declaration = path.node.declaration;
    if (declaration) {
      let defaultName = this.unusedNameLike(
        `default${upperFirst(
          this.module.url.href.split("/").pop()!.split(".")[0]
        )}`
      );
      if (declaration.type === "ObjectExpression") {
        declaration = variableDeclaration("const", [
          variableDeclarator(identifier(defaultName), declaration),
        ]);
      }
      if (declaration.id == null) {
        declaration.id = identifier(defaultName);
      }
      path.replaceWith(declaration);
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
      let nameDesc = this.module.desc.names.get(name)!;
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
        if (entry?.[0]) {
          assignedName = this.maybeAssignImportName(
            this.module,
            entry[0],
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

    ExportDefaultDeclaration(
      path: NodePath<ExportNamedDeclaration>,
      context: PluginContext
    ) {
      context.rewriter.rewriteExportDefaultDeclaration(path, context);
    },

    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      path.remove();
    },
  };
  return { visitor };
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

function appendToBody(
  body: Statement[],
  statements: Statement[],
  removedBindings: Set<string>
): void {
  for (let node of statements) {
    switch (node.type) {
      case "FunctionDeclaration":
      case "ClassDeclaration":
      case "DeclareClass":
      case "DeclareFunction":
      case "DeclareVariable":
        if (!removedBindings.has(node.id.name)) {
          body.push(node);
        }
        break;
      case "VariableDeclaration":
        let filteredDeclarations = node.declarations.filter(
          (d) =>
            d.id.type !== "Identifier" ||
            !removedBindings.has(d.id.name) ||
            (d.init && !isSideEffectFree(d.init))
        );
        if (filteredDeclarations.length > 0) {
          node.declarations = filteredDeclarations;
          body.push(node);
        }
        break;
      case "ExpressionStatement":
      case "BlockStatement":
      case "BreakStatement":
      case "ContinueStatement":
      case "DebuggerStatement":
      case "DoWhileStatement":
      case "EmptyStatement":
      case "ForStatement":
      case "ForInStatement":
      case "ForOfStatement":
      case "IfStatement":
      case "LabeledStatement":
      case "ReturnStatement":
      case "SwitchStatement":
      case "ThrowStatement":
      case "TryStatement":
      case "WhileStatement":
      case "WithStatement":
      case "ExportAllDeclaration":
      case "ExportDefaultDeclaration":
      case "ExportNamedDeclaration": // this is intentionally ignored
      case "ImportDeclaration": // this is intentionally ignored
      case "DeclareModule":
      case "DeclareModuleExports":
      case "DeclareInterface":
      case "DeclareTypeAlias":
      case "DeclareOpaqueType":
      case "DeclareExportDeclaration":
      case "DeclareExportAllDeclaration":
      case "InterfaceDeclaration":
      case "OpaqueType":
      case "TypeAlias":
      case "EnumDeclaration":
      case "TSDeclareFunction":
      case "TSInterfaceDeclaration":
      case "TSTypeAliasDeclaration":
      case "TSEnumDeclaration":
      case "TSModuleDeclaration":
      case "TSImportEqualsDeclaration":
      case "TSExportAssignment":
      case "TSNamespaceExportDeclaration":
        body.push(node);
        break;
      default:
        assertNever(node);
    }
  }
}

function isSideEffectFree(node: Expression): boolean {
  switch (node.type) {
    case "BooleanLiteral":
    case "NumericLiteral":
    case "StringLiteral":
    case "NullLiteral":
    case "Identifier":
    case "FunctionExpression":
    case "ClassExpression":
      return true;
    // TODO consider ArrayLiteral and ObjectLiteral (which recurse--all members must be side effect free too)
    default:
      return false;
  }
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
