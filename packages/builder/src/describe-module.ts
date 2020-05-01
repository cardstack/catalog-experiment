import {
  File,
  ImportDeclaration,
  Import,
  ExportNamedDeclaration,
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
}

export function describeModule(ast: File): ModuleDescription {
  let imports: Map<string, ImportDescription> = new Map();
  let exports: ExportDescription = {
    exportedNames: new Set(),
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
        };
        imports.set(desc.specifier, desc);
      } else {
        desc.isDynamic = true;
      }
    },
    ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
      let exportSpecifier = path.node.specifiers.find(
        (s) => s.type === "ExportSpecifier"
      );

      // what other ones are there besides VariableDeclarators?
      let exportDeclarations = Array.isArray(
        path.node.declaration.declarations
      );
      if (exportDeclarations) {
        for (let declarator of (path.node.declaration
          .declarations as VariableDeclarator[]).filter(
          (d) => d.id.type === "Identifier"
        )) {
          exports.exportedNames.add((declarator.id as Identifier).name);
        }
      } else if (exportSpecifier) {
        exports.exportedNames.add(exportSpecifier.exported.name);
      }
    },
  });

  return {
    imports: [...imports.values()],
    exports,
  };
}

function assertNever(_value: never): never {
  throw new Error(`not never`);
}
