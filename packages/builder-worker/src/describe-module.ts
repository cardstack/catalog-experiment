import {
  File,
  ImportDeclaration,
  Import,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  Program,
  CallExpression,
  StringLiteral,
  isVariableDeclarator,
  isIdentifier,
} from "@babel/types";
import { assertNever } from "shared/util";
import traverse, { NodePath } from "@babel/traverse";
//import { CodeRegion, IdentifierRegion } from "./code-region";

export const NamespaceMarker = { isNamespace: true };
export type NamespaceMarker = typeof NamespaceMarker;
export function isNamespaceMarker(
  value: string | NamespaceMarker
): value is NamespaceMarker {
  return typeof value !== "string";
}

export interface ModuleDescription {
  imports: ImportDescription[];

  // all the names we export, and where they come fromn
  exports: Map<
    string,
    // comes from a local binding with this name. You can look it up in `names`.
    | { type: "local"; name: string }
    // comes from another module, you can look up which one in `imports`.
    | { type: "reexport"; importIndex: number; name: string | NamespaceMarker }
  >;

  // all the names in module scope
  names: Map<string, LocalNameDescription | ImportedNameDescription>;

  // for each binding in module scope, these are the source ranges of
  // identifiers that reference it. That lets us quickly rename the binding.
  //references: Map<string, IdentifierRegion[]>;

  // for each binding in module scope, these are where they are declared.
  //bindingDeclarations: Map<string, CodeRegion>;
}

export interface NameDescription {
  // these are other names in the `names` that we depend on
  dependsOn: Set<string>;

  // true if this name is consumed directly the module scope
  usedByModule: boolean;

  //declaration: CodeRegion;
}

export interface LocalNameDescription extends NameDescription {
  type: "local";
}

export interface ImportedNameDescription extends NameDescription {
  type: "import";
  importIndex: number;
  name: string | NamespaceMarker;
}

export interface ImportDescription {
  // true if this specifier is used dynamically in this module
  isDynamic: boolean;
  specifier: string;
}

export function describeModule(ast: File): ModuleDescription {
  let desc: ModuleDescription = {
    imports: [],
    exports: new Map(),
    names: new Map(),
  };

  let bindingPaths: Map<NodePath, string> = new Map();

  traverse(ast, {
    Program: {
      exit(programPath: NodePath<Program>) {
        // we take two passes through all module-scoped names

        // first pass discovers them all and puts them into bindingPaths
        for (let [name, binding] of Object.entries(
          programPath.scope.bindings
        )) {
          let { node } = binding.path;
          bindingPaths.set(binding.path, name);
          switch (node.type) {
            case "ImportSpecifier":
              addImportedName(
                desc,
                node.local.name,
                node.imported.name,
                binding.path.parent as ImportDeclaration
              );
              break;
            case "ImportDefaultSpecifier":
              addImportedName(
                desc,
                node.local.name,
                "default",
                binding.path.parent as ImportDeclaration
              );
              break;
            case "ImportNamespaceSpecifier":
              addImportedName(
                desc,
                node.local.name,
                NamespaceMarker,
                binding.path.parent as ImportDeclaration
              );
              break;
            default:
              desc.names.set(name, {
                type: "local",
                dependsOn: new Set(),
                usedByModule: false,
              });
          }
        }

        // second pass figures out dependencies between bindings.
        for (let [name, binding] of Object.entries(
          programPath.scope.bindings
        )) {
          for (let refPath of binding.referencePaths) {
            while (refPath.type !== "Program") {
              let otherName = bindingPaths.get(refPath);
              if (otherName) {
                desc.names.get(otherName)!.dependsOn.add(name);
                break;
              }

              if (refPath.type === "ExportNamedDeclaration") {
                // named exports are already accounted for
                break;
              }
              refPath = refPath.parentPath;
            }
            if (refPath.type === "Program") {
              desc.names.get(name)!.usedByModule = true;
            }
          }
        }
      },
    },
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      let importDesc = desc.imports.find(
        (i) => i.specifier === path.node.source.value
      );
      if (!importDesc) {
        importDesc = {
          specifier: path.node.source.value,
          isDynamic: false,
        };
        desc.imports.push(importDesc);
      }
    },
    Import(path: NodePath<Import>) {
      let callExpression = path.parentPath as NodePath<CallExpression>;
      let stringLiteral = callExpression.node.arguments[0] as StringLiteral;
      let importDesc = desc.imports.find(
        (i) => i.specifier === stringLiteral.value
      );
      if (!importDesc) {
        importDesc = {
          specifier: stringLiteral.value,
          isDynamic: true,
        };
        desc.imports.push(importDesc);
      } else {
        importDesc.isDynamic = true;
      }
    },
    ExportDefaultDeclaration(path: NodePath<ExportDefaultDeclaration>) {
      // we're relying on the fact that default is a keyword so it can't be used
      // as a real local name
      let name = "default";

      switch (path.node.declaration.type) {
        case "ClassDeclaration":
        case "FunctionDeclaration":
          if (isIdentifier(path.node.declaration.id)) {
            name = path.node.declaration.id.name;
          }
      }
      desc.exports.set("default", {
        type: "local",
        name,
      });

      // we treat the value of the default export as if it were also a local
      // binding named "default". This can't collide with a real one because
      // it's a keyword. This is useful because we want the default export to
      // participate in our dependsOn graph, and that is all in terms of local
      // bindings.
      desc.names.set("default", {
        type: "local",
        dependsOn: new Set(),
        usedByModule: false,
      });
      bindingPaths.set(path as NodePath, "default");
    },
    ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
      if (path.node.source) {
        // we are reexporting things
        let importIndex = ensureImportSpecifier(desc, path.node.source!.value);

        for (let spec of path.node.specifiers) {
          switch (spec.type) {
            case "ExportDefaultSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: "default",
                importIndex,
              });
              break;
            case "ExportSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: spec.local.name,
                importIndex,
              });
              break;
            case "ExportNamespaceSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: NamespaceMarker,
                importIndex,
              });
              break;
            default:
              assertNever(spec);
          }
        }
      } else {
        // we are not reexporting
        if (path.node.declaration) {
          switch (path.node.declaration.type) {
            case "ClassDeclaration":
            case "FunctionDeclaration":
              let id = path.node.declaration.id;
              if (!isIdentifier(id)) {
                throw new Error(
                  `bug: exported declarations always have an identifier`
                );
              }
              desc.exports.set(id.name, { type: "local", name: id.name });
              break;
            case "VariableDeclaration":
              for (let declarator of path.node.declaration.declarations) {
                if (!isVariableDeclarator(declarator)) {
                  throw new Error(
                    `bug: something weird inside VariableDeclaration: ${declarator.type}`
                  );
                }
                switch (declarator.id.type) {
                  case "Identifier":
                    desc.exports.set(declarator.id.name, {
                      type: "local",
                      name: declarator.id.name,
                    });
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
              break;
            default:
              throw new Error(
                `bug: unexpected syntax in named export: ${path.node.declaration.type}`
              );
          }
        } else {
          // no declaration means we have individual specifiers.
          for (let spec of path.node.specifiers) {
            if (spec.type !== "ExportSpecifier") {
              throw new Error(
                `bug: only ExportSpecifier is valid when not reexporting`
              );
            }
            desc.exports.set(spec.exported.name, {
              type: "local",
              name: spec.local.name,
            });
          }
        }
      }
    },
  });

  return desc;
}

function ensureImportSpecifier(
  desc: ModuleDescription,
  specifier: string
): number {
  let importDesc = desc.imports.find((i) => i.specifier === specifier);
  if (importDesc) {
    return desc.imports.indexOf(importDesc);
  } else {
    let importIndex = desc.imports.length;
    desc.imports.push({
      specifier,
      isDynamic: false,
    });
    return importIndex;
  }
}

function addImportedName(
  desc: ModuleDescription,
  localName: string,
  remoteName: string | NamespaceMarker,
  dec: ImportDeclaration
) {
  desc.names.set(localName, {
    type: "import",
    importIndex: desc.imports.findIndex(
      (i) => i.specifier === dec.source.value
    ),
    name: remoteName,
    dependsOn: new Set(),
    usedByModule: false,
  });
}
