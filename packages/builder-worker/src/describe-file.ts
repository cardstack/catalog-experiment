import {
  Expression,
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
  LVal,
  ObjectProperty,
  CallExpression,
  StringLiteral,
  isVariableDeclarator,
  isIdentifier,
  isStringLiteral,
  isMemberExpression,
  isObjectExpression,
  isObjectProperty,
  isLVal,
} from "@babel/types";
import { assertNever } from "@catalogjs/shared/util";
import traverse, { NodePath, Scope } from "@babel/traverse";
import { CodeRegion, RegionPointer, RegionBuilder } from "./code-region";
import { ImportAssignments } from "./combine-modules";
import { warn } from "./logger";

export const NamespaceMarker = { isNamespace: true };
export type NamespaceMarker = typeof NamespaceMarker;
export function isNamespaceMarker(
  value: string | NamespaceMarker
): value is NamespaceMarker {
  return typeof value !== "string";
}

export type FileDescription = ModuleDescription | CJSDescription;

interface Description {
  // storage of all the included CodeRegions. The order is always stable. Other
  // places refer to a code region by its index in this list.
  regions: CodeRegion[];
}

export interface ModuleDescription extends Description {
  imports: ImportDescription[];

  // all the names we export, and where they come from
  exports: Map<string, ExportDescription>;

  exportRegions: {
    region: RegionPointer;
    declaration: RegionPointer | undefined;
  }[];

  // all the names in module scope
  names: Map<string, LocalNameDescription | ImportedNameDescription>;
}

export interface CJSDescription extends Description {
  requires: RequireDescription[];
  names: Map<string, LocalNameDescription | RequiredNameDescription>;
  // when the module includes: Object.defineProperty(exports, "__esModule", {
  // value: true }) we'll keep track of all the named exports so that we can
  // have a higher fidelity ES shim for this module
  esTranspiledExports: string[] | undefined;
}

export interface RequireDescription {
  specifier: string | undefined;
  definitelyRuns: boolean;
  requireRegion: RegionPointer;
  specifierRegion: RegionPointer;
}

export type ExportDescription =
  // comes from a local binding with this name. You can look it up in `names`.
  | {
      type: "local";
      name: string;
      exportRegion: RegionPointer;
    }
  // comes from another module, you can look up which one in `imports`.
  | {
      type: "reexport";
      importIndex: number;
      name: string | NamespaceMarker;
      exportRegion: RegionPointer;
    };

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
  original?: {
    moduleHref: string;
    exportedName: string | NamespaceMarker;
  };
}

export interface ImportedNameDescription extends NameDescription {
  type: "import";
  importIndex: number;
  name: string | NamespaceMarker;
}

export interface RequiredNameDescription extends NameDescription {
  type: "require";
  requireIndex: number;
  name: string | NamespaceMarker;
}

export type ImportDescription =
  | {
      isDynamic: false;
      specifier: string;
      region: RegionPointer;
    }
  | {
      isDynamic: true;
      specifier: string;
      specifierRegion: RegionPointer;
    };

export function isModuleDescription(
  desc: FileDescription
): desc is ModuleDescription {
  return !("requires" in desc);
}

// @babel/traverse makes it very hard to talk about NodePath's generically,
// because NodePath<AlmostAnything> is not a valid NodePath<Node>. Here we
// duck-type our own generic thing that will probably only match NodePaths.
interface DuckPath {
  node: any;
  type: string;
  scope: Scope;
  parentPath: DuckPath;
  isIdentifier(): this is NodePath<Identifier>;
}

export function describeFile(
  ast: File,
  {
    importAssignments,
    filename,
  }: {
    importAssignments?: ImportAssignments;
    filename?: string;
  } = {}
): FileDescription {
  let isES6Module = false;
  let builder: RegionBuilder;
  let desc: ModuleDescription & CJSDescription;
  let consumedByModule: Set<string> = new Set();
  let cjsExportNames: string[] = [];
  let isTranspiledFromES = false;
  let currentModuleScopedDeclaration:
    | {
        path: DuckPath;
        defines: {
          declaration: NodePath;
          name: string;
          // we track the default export along with all our local names, and
          // it's the only one that has no identifier of its own
          identifier?: NodePath<Identifier>;
          sideEffects: NodePath | false;
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
    // TODO also handle straightforward declarations that use a require
    let hasIdentifier = isIdentifier(path.node.id);
    if (isModuleScopedDeclaration(path as NodePath)) {
      builder.createCodeRegion(path as NodePath);
    }

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
        let identifier = path.get("id") as NodePath<Identifier>;
        currentModuleScopedDeclaration.defines.push({
          name: path.node.id.name,
          declaration: path as NodePath,
          identifier,
          sideEffects: sideEffectsForIdentifier(identifier),
        });
      }
    }
  }

  function exitDeclaration(path: DuckPath) {
    // TODO also handle straightforward declarations that use a require
    if (currentModuleScopedDeclaration?.path !== path) {
      return;
    }
    let { defines, consumes } = currentModuleScopedDeclaration!;
    currentModuleScopedDeclaration = undefined;
    for (let { name, declaration, identifier, sideEffects } of defines) {
      let references: RegionPointer[];
      if (identifier) {
        references = [
          builder.createCodeRegion(identifier as NodePath),
          ...path.scope
            .getBinding(name)!
            // we filter because babel gives you some things like
            // ExportNamedDeclaration here that aren't relevant to us, because
            // we never do fine-grained renaming within export statements anyway
            // -- we re-synthesize entire export statements.
            .referencePaths.filter((path) => path.type === "Identifier")
            .map((i) => builder.createCodeRegion(i)),
        ];
      } else {
        references = [];
      }

      let declarationSideEffects: RegionPointer | undefined;
      if (sideEffects) {
        declarationSideEffects = builder.createCodeRegion(sideEffects);
      }
      let nameDesc = {
        type: "local",
        dependsOn: consumes,
        usedByModule: false,
        declaration: builder.createCodeRegion(declaration),
        references,
        declarationSideEffects,
      } as LocalNameDescription;
      if (importAssignments && importAssignments.has(name)) {
        let { moduleHref, name: exportedName } = importAssignments.get(name)!;
        nameDesc.original = {
          moduleHref,
          exportedName,
        };
      }
      desc.names.set(name, nameDesc);
    }
  }

  function sideEffectsForIdentifier(
    path: NodePath<Identifier>
  ): NodePath | false {
    switch (path.parent.type) {
      case "VariableDeclarator":
        if (
          path.parent.id === path.node &&
          path.parent.init &&
          !isSideEffectFree(path.parent.init)
        ) {
          return path.parentPath.get("init") as NodePath;
        }
        return false;
      case "AssignmentPattern":
        if (
          path.parent.left === path.node &&
          !isSideEffectFree(path.parent.right)
        ) {
          return path.parentPath.get("right") as NodePath;
        }
        return false;
      case "ObjectProperty":
      case "ArrayPattern":
      case "RestElement":
        if (currentModuleScopedDeclaration?.withinLVal) {
          let declaration = currentModuleScopedDeclaration.path as NodePath;
          if (
            declaration &&
            isVariableDeclarator(declaration.node) &&
            declaration.node.init &&
            !isSideEffectFree(declaration.node.init)
          ) {
            return declaration.get("init") as NodePath;
          }
        }
        return false;
      default:
        return false;
    }
  }
  const handlePossibleLVal = {
    enter(path: DuckPath) {
      if (
        (path.parentPath === currentModuleScopedDeclaration?.path &&
          currentModuleScopedDeclaration?.path.node.id === path.node) ||
        currentModuleScopedDeclaration?.withinLVal === path.parentPath
      ) {
        builder.createCodeRegion(path as NodePath);
      }
      if (
        path.parentPath === currentModuleScopedDeclaration?.path &&
        currentModuleScopedDeclaration?.path.node.id === path.node
      ) {
        currentModuleScopedDeclaration.withinLVal = path;
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
      enter(path) {
        builder = new RegionBuilder(path);
        desc = {
          imports: [],
          requires: [],
          exports: new Map(),
          exportRegions: [],
          names: new Map(),
          regions: builder.regions,
          esTranspiledExports: undefined,
        };
      },
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
    AssignmentPattern: handlePossibleLVal,
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
        let sideEffects = sideEffectsForIdentifier(path);
        if (declaration) {
          currentModuleScopedDeclaration.defines.push({
            name: path.node.name,
            declaration,
            identifier: path,
            sideEffects,
          });
        }
      }
      if (path.isReferencedIdentifier()) {
        if (currentModuleScopedDeclaration) {
          currentModuleScopedDeclaration.consumes.add(path.node.name);
        } else if (path.parent.type !== "ExportSpecifier") {
          consumedByModule.add(path.node.name);
        }
      }
    },
    MemberExpression(path) {
      // discover all the named exports from ES transpiled code
      let { node } = path;
      if (
        isIdentifier(node.object) &&
        node.object.name === "exports" &&
        isIdentifier(node.property) &&
        !path.scope.getBinding("exports")
      ) {
        cjsExportNames.push(node.property.name);
      }
    },
    CallExpression(path) {
      let callee = path.get("callee");
      let calleeNode = callee.node;
      let argumentsPaths = path.get("arguments");
      let argumentsNodes = argumentsPaths.map((a) => a.node);
      if (
        isIdentifier(calleeNode) &&
        calleeNode.name === "require" &&
        !path.scope.getBinding("require")
      ) {
        let [specifierNode] = argumentsNodes;
        let specifier: string | undefined;
        if (isStringLiteral(specifierNode)) {
          specifier = specifierNode.value;
        } else {
          warn(
            `encountered a require() whose specifier is not a string literal${
              filename ? " in file " + filename : ""
            }. If this require() is evaluated, a runtime error will be thrown.`
          );
        }
        desc.requires.push({
          specifier,
          requireRegion: builder.createCodeRegion(path as NodePath),
          specifierRegion: builder.createCodeRegion(
            argumentsPaths[0] as NodePath
          ),
          definitelyRuns: path.scope.block.type === "Program",
        });
      } else {
        // looking for: Object.defineProperty(exports, "__esModule", { value: true });
        isTranspiledFromES =
          isMemberExpression(calleeNode) &&
          isIdentifier(calleeNode.object) &&
          calleeNode.object.name === "Object" &&
          calleeNode.property.name === "defineProperty" &&
          argumentsNodes.length === 3 &&
          isIdentifier(argumentsNodes[0]) &&
          argumentsNodes[0].name === "exports" &&
          isStringLiteral(argumentsNodes[1]) &&
          argumentsNodes[1].value === "__esModule" &&
          isObjectExpression(argumentsNodes[2]) &&
          isObjectProperty(argumentsNodes[2].properties[0]) &&
          isIdentifier(argumentsNodes[2].properties[0].key) &&
          argumentsNodes[2].properties[0].key.name === "value"; // this seems close enough....
      }
    },
    ImportDeclaration(path) {
      isES6Module = true;
      let importDesc = desc.imports.find(
        (i) => i.specifier === path.node.source.value
      );
      if (!importDesc) {
        importDesc = {
          specifier: path.node.source.value,
          isDynamic: false,
          region: builder.createCodeRegion(path as NodePath),
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
      isES6Module = true;
      let callExpression = path.parentPath as NodePath<CallExpression>;
      let stringLiteral = callExpression.node.arguments[0] as StringLiteral;
      let importDesc = desc.imports.find(
        (i) => i.specifier === stringLiteral.value
      );
      if (!importDesc) {
        if (!Array.isArray(path.parentPath.get("arguments"))) {
          throw new Error(
            `bug: Cannot determine path to dynamic import's specifier`
          );
        }
        importDesc = {
          specifierRegion: builder.createCodeRegion(
            (path.parentPath.get("arguments") as NodePath[])[0]
          ),
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
        isES6Module = true;
        let exportRegion = builder.createCodeRegion(path as NodePath);
        desc.exportRegions.push({
          region: exportRegion,
          declaration: builder.createCodeRegion(
            path.get("declaration") as NodePath
          ),
        });

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
          exportRegion,
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
              sideEffects: false,
            },
          ],
          consumes: new Set(),
          withinLVal: false,
        };
      },
      exit: exitDeclaration,
    },
    ExportNamedDeclaration(path) {
      isES6Module = true;
      let declaration: RegionPointer | undefined;
      let exportRegion = builder.createCodeRegion(path as NodePath);
      if (path.node.declaration != null) {
        declaration = builder.createCodeRegion(
          path.get("declaration") as NodePath
        );
      }
      desc.exportRegions.push({
        region: exportRegion,
        declaration,
      });

      if (path.node.source) {
        // we are reexporting things
        let importIndex = ensureImportSpecifier(
          desc,
          path.node.source!.value,
          exportRegion
        );

        for (let spec of path.node.specifiers) {
          switch (spec.type) {
            case "ExportDefaultSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: "default",
                importIndex,
                exportRegion,
              });
              break;
            case "ExportSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: spec.local.name,
                importIndex,
                exportRegion,
              });
              break;
            case "ExportNamespaceSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: NamespaceMarker,
                importIndex,
                exportRegion,
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
              desc.exports.set(id.name, {
                type: "local",
                name: id.name,
                exportRegion,
              });
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
                      exportRegion,
                    });
                    break;
                  case "ArrayPattern":
                  case "ObjectPattern":
                  case "RestElement":
                    setLValExportDesc(
                      desc.exports,
                      declarator.id,
                      exportRegion
                    );
                    break;
                  case "AssignmentPattern":
                  case "MemberExpression":
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
              exportRegion,
            });
          }
        }
      }
    },
  });

  let { names, regions } = desc!;
  if (!isES6Module) {
    let { requires } = desc!;
    let esTranspiledExports = isTranspiledFromES ? cjsExportNames : undefined;
    return { names, regions, requires, esTranspiledExports };
  } else {
    let { imports, exports, exportRegions } = desc!;
    return { names, regions, imports, exports, exportRegions };
  }
}

function setLValExportDesc(
  exportDesc: ModuleDescription["exports"],
  node: LVal | ObjectProperty,
  exportRegion: RegionPointer
): void {
  switch (node.type) {
    case "Identifier":
      let name = node.name as string;
      exportDesc.set(name, {
        type: "local",
        exportRegion,
        name,
      });
      break;
    case "ObjectPattern":
      for (let prop of node.properties) {
        setLValExportDesc(exportDesc, prop, exportRegion);
      }
      break;
    case "ObjectProperty":
      if (isLVal(node.value)) {
        setLValExportDesc(exportDesc, node.value, exportRegion);
      }
      break;
    case "ArrayPattern":
      for (let element of node.elements) {
        if (element) {
          setLValExportDesc(exportDesc, element, exportRegion);
        }
      }
      break;
    case "RestElement":
      setLValExportDesc(exportDesc, node.argument, exportRegion);
      break;
    case "AssignmentPattern":
    case "MemberExpression":
    case "TSParameterProperty":
      throw new Error("unimplemented");
    default:
      assertNever(node);
  }
}

function ensureImportSpecifier(
  desc: ModuleDescription,
  specifier: string,
  region: RegionPointer
): number {
  let importDesc = desc.imports.find((i) => i.specifier === specifier);
  if (importDesc) {
    return desc.imports.indexOf(importDesc);
  } else {
    let importIndex = desc.imports.length;
    desc.imports.push({
      specifier,
      isDynamic: false,
      region,
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
    declarationSideEffects: undefined,
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
    case "AssignmentPattern":
      if (path.parent.left === path.node) {
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
    default:
      return false;
  }
}
