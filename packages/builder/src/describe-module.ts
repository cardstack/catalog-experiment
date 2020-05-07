import {
  File,
  ImportDeclaration,
  Import,
  ExportNamedDeclaration,
  ExportSpecifier,
  CallExpression,
  StringLiteral,
  isVariableDeclarator,
  isFunctionDeclaration,
  isClassDeclaration,
} from "@babel/types";
import { assertNever } from "./util";
import traverse, { NodePath } from "@babel/traverse";

export const NamespaceMarker = { isNamespace: true };
export type NamespaceMarker = typeof NamespaceMarker;
export function isNamespaceMarker(
  value: string | NamespaceMarker
): value is NamespaceMarker {
  return typeof value !== "string";
}

export interface ModuleDescription {
  imports: ImportDescription[];
  exports: ExportDescription;
}

export interface ExportDescription {
  // keys are publicly-visible names, values are module-scoped names from inside
  exportedNames: Map<string, string>;

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
    exportedNames: new Map(),
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

      let hasDeclarations = Array.isArray(path.node.declaration?.declarations);
      if (hasDeclarations) {
        for (let declarator of path.node.declaration.declarations) {
          if (isVariableDeclarator(declarator)) {
            switch (declarator.id.type) {
              case "Identifier":
                exportDesc.exportedNames.set(
                  declarator.id.name,
                  declarator.id.name
                );
                break;
              case "ArrayPattern":
              case "AssignmentPattern":
              case "MemberExpression":
              case "ObjectPattern":
              case "RestElement":
              case "TSParameterProperty":
                throw new Error("unimplemented");
              default:
                assertNever(declarator.id);
            }
          }
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
        exportDesc.exportedNames.set(
          path.node.declaration.id.name,
          path.node.declaration.id.name
        );
      } else if (
        path.node.declaration &&
        isClassDeclaration(path.node.declaration)
      ) {
        switch (
          path.node.declaration.id.type // ugh, this type sucks :-(
        ) {
          case "Identifier":
            exportDesc.exportedNames.set(
              path.node.declaration.id.name,
              path.node.declaration.id.name
            );
            break;
          default:
            throw new Error("unimplemented");
        }
      } else if (exportSpecifiers.length > 0) {
        for (let specifier of exportSpecifiers) {
          let exportedName: string;
          switch (specifier.exported.type) {
            case "Identifier":
              exportedName = specifier.exported.name;
              exportDesc.exportedNames.set(exportedName, specifier.local.name);
              break;
            default:
              assertNever(specifier.exported.type);
          }

          if (isReexport(path)) {
            let importedName = specifier.local.name as string;
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
