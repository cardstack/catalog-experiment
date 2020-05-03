import {
  File,
  ImportDeclaration,
  Import,
  ExportNamedDeclaration,
  ExportSpecifier,
  VariableDeclarator,
  Identifier,
  CallExpression,
  StringLiteral,
} from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";

export interface ModuleDescription {
  imports: ImportDescription[];
  exports: ExportDescription;
}

export interface ExportDescription {
  exportedNames: Set<string>;

  // keys are the exported names, values are the imported names
  reexports: Map<string, string>;
}
export interface ImportDescription {
  // true if this specifier is used dynamically in this module
  isDynamic: boolean;

  specifier: string;

  // keys are local names, values are imported names. These are the statically
  // imported names, this map is empty if the specifier was used *only*
  // dynamically. But you can also have both static and dynamic references to
  // the same specifier, meaning this map is non-empty while isDynamic is true.
  names: Map<string, string>;

  // the whole module's namespace has been (statically) imported as these local
  // names
  namespace: string[];

  // keys are the exported names, values are the imported names
  reexports: Map<string, string>;
}

export function describeModule(ast: File): ModuleDescription {
  let imports: Map<string, ImportDescription> = new Map();
  let exportDesc: ExportDescription = {
    exportedNames: new Set(),
    reexports: new Map(),
  };

  traverse(ast, {
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      let desc = imports.get(path.node.source.value);
      if (!desc) {
        desc = {
          specifier: path.node.source.value,
          isDynamic: false,
          names: new Map(),
          namespace: [],
          reexports: new Map(),
        };
        imports.set(desc.specifier, desc);
      }
      for (let spec of path.node.specifiers) {
        switch (spec.type) {
          case "ImportDefaultSpecifier":
            desc.names.set(spec.local.name, "default");
            break;
          case "ImportNamespaceSpecifier":
            desc.namespace.push(spec.local.name);
            break;
          case "ImportSpecifier":
            desc.names.set(spec.local.name, spec.imported.name);
            break;
          default:
            throw assertNever(spec);
        }
      }
    },
    Import(path: NodePath<Import>) {
      let callExpression = path.parentPath as NodePath<CallExpression>;
      let stringLiteral = callExpression.node.arguments[0] as StringLiteral;
      let desc = imports.get(stringLiteral.value);
      if (!desc) {
        desc = {
          specifier: stringLiteral.value,
          isDynamic: true,
          names: new Map(),
          namespace: [],
          reexports: new Map(),
        };
        imports.set(desc.specifier, desc);
      } else {
        desc.isDynamic = true;
      }
    },
    ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
      let exportSpecifiers = path.node.specifiers.filter(
        (s) => s.type === "ExportSpecifier"
      ) as ExportSpecifier[];

      // what other ones are there besides VariableDeclarators?
      let exportDeclarations = Array.isArray(
        path.node.declaration?.declarations
      );
      if (exportDeclarations) {
        for (let declarator of (path.node.declaration
          .declarations as VariableDeclarator[]).filter(
          (d) => d.id.type === "Identifier"
        )) {
          exportDesc.exportedNames.add((declarator.id as Identifier).name);
        }
      } else if (exportSpecifiers.length > 0) {
        for (let exportSpecifier of exportSpecifiers) {
          let exportedName = exportSpecifier.exported.name as string;
          exportDesc.exportedNames.add(exportedName);

          if (isReexport(path)) {
            let importedName = exportSpecifier.local.name as string;
            let importDesc = imports.get(importedName);
            if (!importDesc) {
              importDesc = {
                specifier: path.node.source!.value, // reexport will always have a non-null source value
                isDynamic: false,
                names: new Map(),
                namespace: [],
                reexports: new Map(),
              };
              imports.set(importDesc.specifier, importDesc);
            }
            // setting the reexports on both the import and export desc, so that
            // we can access this information from either side.
            importDesc.reexports.set(exportedName, importedName);
            exportDesc.reexports.set(exportedName, importedName);
          }
        }
      }
    },
  });

  return {
    imports: [...imports.values()],
    exports: exportDesc,
  };
}

function isReexport(path: NodePath<ExportNamedDeclaration>): boolean {
  let exportSpecifiers = path.node.specifiers.filter(
    (s) => s.type === "ExportSpecifier"
  ) as ExportSpecifier[];
  for (let exportSpecifier of exportSpecifiers) {
    if (
      exportSpecifier.local.type === "Identifier" &&
      path.node.source?.value
    ) {
      return true;
    }
  }
  return false;
}

function assertNever(_value: never): never {
  throw new Error(`not never`);
}
