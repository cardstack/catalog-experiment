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
  ObjectProperty,
  RestElement,
  LVal,
  isVariableDeclarator,
  isIdentifier,
  isLVal,
} from "@babel/types";
import { assertNever } from "shared/util";
import traverse, { NodePath, Scope } from "@babel/traverse";
import { CodeRegion, IdentifierRegion, RegionBuilder } from "./code-region";

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
}

export interface NameDescription {
  // these are other names in the `names` that we depend on
  dependsOn: Set<string>;

  // true if this name is consumed directly the module scope
  usedByModule: boolean;

  declaration: CodeRegion;
  references: IdentifierRegion[];
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
  isIdentifier(): this is NodePath<Identifier>;
}

export function describeModule(ast: File): ModuleDescription {
  let desc: ModuleDescription = {
    imports: [],
    exports: new Map(),
    names: new Map(),
  };

  let bindingPaths: Map<DuckPath, string> = new Map();
  let builder = new RegionBuilder();

  traverse(ast, {
    Program: {
      enter(programPath) {
        for (let [name, binding] of Object.entries(
          programPath.scope.bindings
        )) {
          // need to check the path to see if contains an LVal, if so, break it
          // down farther because there could be mulitple bindings located at
          // this path. We'll break the LVals down to the NodePath<Identifier>'s
          // for each binding in the LVal.
          if (
            isVariableDeclarator(binding.path.node) &&
            isLVal(binding.path.node.id)
          ) {
            let path = binding.path.get("id") as NodePath<LVal>;
            let idPath = lvalToIdentifiers(path).find(
              (idPath) => idPath.node.name === name
            );
            if (!idPath) {
              throw new Error(
                `bug: could not find path for lval binding ${name}`
              );
            }
            bindingPaths.set(idPath, name);
          } else {
            bindingPaths.set(binding.path, name);
          }
        }
      },
      exit(programPath) {
        // this pass figures out dependencies between bindings.
        for (let [name, binding] of Object.entries(
          programPath.scope.bindings
        )) {
          for (let refPath of binding.referencePaths) {
            // at this point,  before we've started iterating upward, refPath is
            // always a NodePath<Identifier>
            desc.names
              .get(name)!
              .references.push(
                builder.createIdentifierRegion(refPath as NodePath<Identifier>)
              );

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
    FunctionDeclaration(path) {
      addLocalIdDeclaration(desc, bindingPaths, path, builder);
    },
    VariableDeclarator(path) {
      let lvalPath = path.get("id");
      if (lvalPath.type === "Identifier") {
        addLocalIdDeclaration(desc, bindingPaths, path, builder);
      }
      let idPaths = lvalToIdentifiers(lvalPath);
      for (let idPath of idPaths) {
        if (!bindingPaths.has(idPath)) {
          continue;
        }
        let declarationPath: NodePath<Node>;
        if (["RestElement", "ObjectProperty"].includes(idPath.parent.type)) {
          // in these scenarios we want to include the original and renamed
          // property as part of the declaration path for object patterns or the
          // "..." as part of the declaration for the RestElement
          declarationPath = idPath.parentPath;
        } else {
          declarationPath = idPath as NodePath<Node>;
        }
        desc.names.set(
          idPath.node.name,
          localNameDescription(
            builder.createCodeRegion(declarationPath),
            builder.createIdentifierRegion(idPath)
          )
        );
      }
    },
    ClassDeclaration(path) {
      addLocalIdDeclaration(desc, bindingPaths, path, builder);
    },
    ImportSpecifier(path) {
      if (bindingPaths.has(path)) {
        addImportedName(desc, path.node.imported.name, path, builder);
      }
    },
    ImportDefaultSpecifier(path) {
      if (bindingPaths.has(path)) {
        addImportedName(desc, "default", path, builder);
      }
    },
    ImportNamespaceSpecifier(path) {
      if (bindingPaths.has(path)) {
        addImportedName(desc, NamespaceMarker, path, builder);
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
    ExportDefaultDeclaration(path) {
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
        declaration: builder.createCodeRegion(
          path.get("declaration") as NodePath<Node>
        ),
        references: [], // default is never actually referenced internally
      });
      bindingPaths.set(path as NodePath, "default");
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
    references: [builder.createIdentifierRegion(identifierPath)],
  });
}

function localNameDescription(
  declaration: CodeRegion,
  selfReference: IdentifierRegion
): LocalNameDescription {
  return {
    type: "local",
    dependsOn: new Set(),
    usedByModule: false,
    declaration,
    references: [selfReference],
  };
}

function ensureIdentifierPath(
  path: DuckPath | DuckPath[]
): NodePath<Identifier> {
  if (Array.isArray(path)) {
    throw new Error(`bug: expected identifier path to not be an array`);
  }
  if (!path.isIdentifier()) {
    throw new Error(`bug: expected a non-null identifier path`);
  }
  return path;
}

function addLocalIdDeclaration(
  desc: ModuleDescription,
  bindingPaths: Map<DuckPath, string>,
  path:
    | NodePath<FunctionDeclaration>
    | NodePath<VariableDeclarator>
    | NodePath<ClassDeclaration>,
  builder: RegionBuilder
) {
  let name = bindingPaths.get(path);
  if (name) {
    desc.names.set(
      name,
      localNameDescription(
        builder.createCodeRegion(path as NodePath<Node>),
        builder.createIdentifierRegion(ensureIdentifierPath(path.get("id")))
      )
    );
  }
}

function lvalToIdentifiers(
  path: NodePath<LVal> | NodePath<ObjectProperty>
): NodePath<Identifier>[] {
  let results: NodePath<Identifier>[] = [];
  switch (path.node.type) {
    case "ObjectPattern":
      for (let propPath of path.get("properties") as NodePath<
        ObjectProperty
      >[]) {
        results = [...results, ...lvalToIdentifiers(propPath)];
      }
      break;
    case "ObjectProperty":
      results = [
        ...results,
        ...lvalToIdentifiers(path.get("key") as NodePath<LVal>),
        ...lvalToIdentifiers(path.get("value") as NodePath<LVal>),
      ];
      break;
    case "ArrayPattern":
      for (let elPath of path.get("elements") as NodePath<LVal>[]) {
        results = [...results, ...lvalToIdentifiers(elPath)];
      }
      break;
    case "RestElement":
      let restPath = path as NodePath<RestElement>; // ugh
      results = lvalToIdentifiers(restPath.get("argument"));
      break;
    case "Identifier":
      results = [path as NodePath<Identifier>];
      break;
    case "MemberExpression":
    case "AssignmentPattern":
    case "TSParameterProperty":
      throw new Error("unimplemented");
    default:
      assertNever(path.node);
  }
  return results;
}
