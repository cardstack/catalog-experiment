import { parse } from "@babel/core";
import generate from "@babel/generator";
import { Statement } from "@babel/types";
import { Bundle, BundleAssignments } from "./nodes/bundle";
import { ModuleResolution } from "./nodes/resolution";

export function combineModules(
  bundle: Bundle,
  _assignments: BundleAssignments
): string {
  let bundleAst = parse("");
  if (bundleAst?.type !== "File") {
    throw new Error(`Empty bundle AST is not a 'File' type`);
  }
  let bundleBody = bundleAst.program.body;
  for (let module of bundle.exposedModules) {
    appendToBundle(bundleBody, module);
  }

  // TODO perhaps we want to save the source code in the ModuleResolutions so we
  // can generate source maps...
  let { code } = generate(bundleAst);
  return code;
}

function appendToBundle(bundleBody: Statement[], module: ModuleResolution) {
  for (let { desc, resolution } of Object.values(module.imports)) {
    appendToBundle(bundleBody, resolution);
  }
  adjustModule(module);
  bundleBody.push(...module.parsed.program.body);
}

function adjustModule(module: ModuleResolution) {
  let body = module.parsed.program.body;

  module.parsed.program.body = body
    .map((statement) => {
      switch (statement.type) {
        // case 'ExportDefaultDeclaration':
        // case 'ExportDefaultDeclaration':
        case "ExportNamedDeclaration":
          statement = statement.declaration; // TODO need to guard against collisions
          break;
      }
      return statement;
    })
    .filter(
      // This is just a silly baby step to the final goal
      (s) => s.type !== "ImportDeclaration"
    );
}

/*

  babel has: scope.rename(old, new);
  babel has Object.keys(path.scope.bindings) is all the names in scope at path

  let finalModuleScopeNames = Set<string>;

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
