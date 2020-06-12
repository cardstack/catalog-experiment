import {
  File,
  ImportDeclaration,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  FunctionDeclaration,
  ClassDeclaration,
  VariableDeclarator,
  Identifier,
  Node,
  CallExpression,
  StringLiteral,
  isVariableDeclarator,
  isIdentifier,
} from "@babel/types";
import { assertNever } from "shared/util";
import traverse, { NodePath, Scope } from "@babel/traverse";
import { CodeRegion, RegionPointer, RegionBuilder } from "./code-region";

export const NamespaceMarker = { isNamespace: true };
export type NamespaceMarker = typeof NamespaceMarker;
export function isNamespaceMarker(
  value: string | NamespaceMarker
): value is NamespaceMarker {
  return typeof value !== "string";
}

export interface ModuleDescription {
  imports: ImportDescription[];

  // all the names we export, and where they come from
  exports: Map<
    string,
    // comes from a local binding with this name. You can look it up in `names`.
    | { type: "local"; name: string }
    // comes from another module, you can look up which one in `imports`.
    | { type: "reexport"; importIndex: number; name: string | NamespaceMarker }
  >;

  // all the names in module scope
  names: Map<string, LocalNameDescription | ImportedNameDescription>;

  // storage of all the included CodeRegions. The order is always stable. Other
  // places refer to a code region by its index in this list.
  regions: CodeRegion[];
  topRegion: RegionPointer | undefined;
}

export interface NameDescription {
  // these are other names in the `names` that we depend on
  dependsOn: Set<string>;

  // true if this name is consumed directly the module scope
  usedByModule: boolean;

  declaration: RegionPointer;
  declarationSideEffects: RegionPointer | undefined;
  references: RegionPointer[];
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

// @babel/traverse makes it very hard to talk about NodePath's generically,
// because NodePath<AlmostAnything> is not a valid NodePath<Node>. Here we
// duck-type our own generic thing that will probably only match NodePaths.
interface DuckPath {
  node: any;
  scope: Scope;
  parentPath: DuckPath;
  isIdentifier(): this is NodePath<Identifier>;
}

export function describeModule(ast: File): ModuleDescription {
  let builder = new RegionBuilder();
  let desc: ModuleDescription = {
    imports: [],
    exports: new Map(),
    names: new Map(),
    regions: builder.regions,
    topRegion: -1, // todo: this is just here to satisfy TS, we set the real value at the bottom of the function
  };
  let consumedByModule: Set<string> = new Set();
  let currentModuleScopedDeclaration:
    | {
        path: DuckPath;
        defines: {
          declaration: NodePath;
          name: string;
          // we track the default export along with all our local names, and
          // it's the only one that has no identifier of its own
          identifier?: NodePath<Identifier>;
        }[];
        consumes: Set<string>;
        withinLVal: DuckPath | false;
      }
    | undefined;

  function enterDeclaration(
    path:
      | NodePath<FunctionDeclaration>
      | NodePath<ClassDeclaration>
      | NodePath<VariableDeclarator>
  ) {
    let hasIdentifier = isIdentifier(path.node.id);
    if (
      isModuleScopedDeclaration(path as NodePath) &&
      (path.node.type === "VariableDeclarator" || hasIdentifier)
    ) {
      currentModuleScopedDeclaration = {
        path,
        defines: [],
        consumes: new Set(),
        withinLVal: false,
      };
      if (hasIdentifier) {
        currentModuleScopedDeclaration.defines.push({
          name: path.node.id.name,
          declaration: path as NodePath,
          identifier: path.get("id") as NodePath<Identifier>,
        });
      }
    }
  }

  function exitDeclaration(path: DuckPath) {
    if (currentModuleScopedDeclaration?.path !== path) {
      return;
    }
    let { defines, consumes } = currentModuleScopedDeclaration!;
    currentModuleScopedDeclaration = undefined;
    for (let { name, declaration, identifier } of defines) {
      let references: RegionPointer[];
      if (identifier) {
        references = [
          builder.createCodeRegion(identifier as NodePath),
          ...path.scope
            .getBinding(name)!
            .referencePaths.map((i) => builder.createCodeRegion(i)),
        ];
      } else {
        references = [];
      }
      desc.names.set(name, {
        type: "local",
        dependsOn: consumes,
        usedByModule: false,
        declaration: builder.createCodeRegion(declaration),
        references,
      });
    }
  }

  const handlePossibleLVal = {
    enter(path: DuckPath) {
      if (
        (path.parentPath === currentModuleScopedDeclaration?.path &&
          currentModuleScopedDeclaration?.path.node.id === path.node) ||
        currentModuleScopedDeclaration?.withinLVal === path.parentPath
      ) {
        currentModuleScopedDeclaration!.withinLVal = path;
        builder.createCodeRegion(path as NodePath);
      }
    },
    exit(path: DuckPath) {
      if (currentModuleScopedDeclaration?.withinLVal === path) {
        currentModuleScopedDeclaration.withinLVal = false;
      }
    },
  };

  traverse(ast, {
    Program: {
      exit() {
        for (let name of consumedByModule) {
          let nameDesc = desc.names.get(name);
          if (nameDesc) {
            nameDesc.usedByModule = true;
          }
        }
      },
    },
    FunctionDeclaration: {
      enter: enterDeclaration,
      exit: exitDeclaration,
    },
    ClassDeclaration: {
      enter: enterDeclaration,
      exit: exitDeclaration,
    },
    VariableDeclaration(path) {
      if (isModuleScopedDeclaration(path as NodePath)) {
        builder.createCodeRegion(path as NodePath);
      }
    },
    VariableDeclarator: {
      enter: enterDeclaration,
      exit: exitDeclaration,
    },
    ObjectPattern: handlePossibleLVal,
    ArrayPattern: handlePossibleLVal,
    RestElement: handlePossibleLVal,
    // ObjectProperty is not an LVal, so we don't want to use
    // handlePossibleLVal, but we are interested in making a code region for it,
    // since it composes an LVal
    ObjectProperty(path) {
      if (currentModuleScopedDeclaration?.withinLVal === path.parentPath) {
        builder.createCodeRegion(path as NodePath);
      }
    },
    Identifier(path) {
      if (currentModuleScopedDeclaration?.withinLVal) {
        let declaration = declarationForIdentifier(path);
        if (declaration) {
          currentModuleScopedDeclaration.defines.push({
            name: path.node.name,
            declaration,
            identifier: path,
          });
        }
      }
      if (path.isReferencedIdentifier()) {
        if (currentModuleScopedDeclaration) {
          currentModuleScopedDeclaration.consumes.add(path.node.name);
        } else {
          consumedByModule.add(path.node.name);
        }
      }
    },
    ImportDeclaration(path) {
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
    ImportSpecifier(path) {
      addImportedName(desc, path.node.imported.name, path, builder);
    },
    ImportDefaultSpecifier(path) {
      addImportedName(desc, "default", path, builder);
    },
    ImportNamespaceSpecifier(path) {
      addImportedName(desc, NamespaceMarker, path, builder);
    },

    Import(path) {
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
    ExportDefaultDeclaration: {
      enter(path) {
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

        if (name !== "default") {
          //  the next level down will track its own consumption of other names
          return;
        }

        currentModuleScopedDeclaration = {
          path,
          defines: [
            {
              name: "default",
              declaration: path.get("declaration") as NodePath,
            },
          ],
          consumes: new Set(),
          withinLVal: false,
        };
      },
      exit: exitDeclaration,
    },
    ExportNamedDeclaration(path) {
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

  desc.topRegion = builder.top;
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
  remoteName: string | NamespaceMarker,
  path:
    | NodePath<ImportSpecifier>
    | NodePath<ImportDefaultSpecifier>
    | NodePath<ImportNamespaceSpecifier>,
  builder: RegionBuilder
) {
  let dec = path.parent as ImportDeclaration;
  let identifierPath = path.get("local") as NodePath<Identifier>;
  desc.names.set(identifierPath.node.name, {
    type: "import",
    importIndex: desc.imports.findIndex(
      (i) => i.specifier === dec.source.value
    ),
    name: remoteName,
    dependsOn: new Set(),
    usedByModule: false,
    declaration: builder.createCodeRegion(path as NodePath<Node>),
    references: [
      builder.createCodeRegion(identifierPath as NodePath),
      ...path.scope
        .getBinding(identifierPath.node.name)!
        .referencePaths.map((i) => builder.createCodeRegion(i)),
    ],
  });
}

function isModuleScopedDeclaration(path: NodePath): boolean {
  return (
    ["ExportDefaultDeclaration", "ExportNamedDeclaration", "Program"].includes(
      path.parent.type
    ) ||
    (path.parent.type === "VariableDeclaration" &&
      isModuleScopedDeclaration(path.parentPath))
  );
}

function declarationForIdentifier(
  path: NodePath<Identifier>
): NodePath | false {
  switch (path.parent.type) {
    case "FunctionDeclaration":
    case "ClassDeclaration":
    case "VariableDeclarator":
      if (path.parent.id === path.node) {
        return path.parentPath;
      }
      return false;
    case "ObjectProperty":
      if (path.parent.value === path.node) {
        return path.parentPath;
      }
      return false;
    case "RestElement":
      if (path.parent.argument === path.node) {
        return path.parentPath;
      }
      return false;
    case "ArrayPattern":
      if (path.parent.elements.includes(path.node)) {
        return path as NodePath;
      }
      return false;
    default:
      return false;
  }
}
