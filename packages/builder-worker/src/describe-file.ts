import {
  Expression,
  File,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  FunctionDeclaration,
  ClassDeclaration,
  VariableDeclarator,
  Identifier,
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
import {
  CodeRegion,
  RegionPointer,
  RegionBuilder,
  notFoundPointer,
  documentPointer,
  DeclarationCodeRegion,
  DeclarationDescription,
  isReferenceCodeRegion,
} from "./code-region";
import { warn } from "./logger";
import intersection from "lodash/intersection";
import {
  ModuleResolution,
  Resolution,
  makeNonCyclic,
} from "./nodes/resolution";
import { NamespaceMarker } from "./code-region";

export interface ExportAllMarker {
  exportAllFrom: string;
}
export function isExportAllMarker(value: any): value is ExportAllMarker {
  return typeof value === "object" && "exportAllFrom" in value;
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
  exports: Map<string | ExportAllMarker, ExportDescription>;

  declarations: Declarations;
}

export type Declarations = Map<
  string,
  { pointer: RegionPointer; declaration: DeclarationDescription }
>;

export interface CJSDescription extends Description {
  requires: RequireDescription[];
  // when the module includes: Object.defineProperty(exports, "__esModule", {
  // value: true }) we'll keep track of all the named exports so that we can
  // have a higher fidelity ES shim for this module
  esTranspiledExports: string[] | undefined;
}

// TODO we need to refactor this to be region-centric as well....
export interface RequireDescription {
  specifier: string | undefined;
  definitelyRuns: boolean;
  requireRegion: RegionPointer;
  specifierRegion: RegionPointer;
}

export type ExportDescription =
  | LocalExportDescription
  | ReexportExportDescription
  | ExportAllExportDescription;

// comes from a local binding with this name. You can look it up in `names`.
export interface LocalExportDescription {
  type: "local";
  name: string;
  exportRegion: RegionPointer;
}

// comes from another module, you can look up which one in `imports`.
export interface ReexportExportDescription {
  type: "reexport";
  importIndex: number;
  name: string | NamespaceMarker;
  exportRegion: RegionPointer;
}

// this is `export * from 'foo';` which appends the exports of foo (excluding
// the default export) to the current module
export interface ExportAllExportDescription {
  type: "export-all";
  importIndex: number;
  exportRegion: RegionPointer;
}

export type ImportDescription =
  | {
      isDynamic: false;
      specifier: string;
      isReexport: boolean;
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

export function getExportDesc(
  module: Resolution,
  exportName: string
):
  | {
      desc: LocalExportDescription | ReexportExportDescription;
      module: ModuleResolution;
    }
  | undefined;
export function getExportDesc(
  module: Resolution,
  exportAllMarker: ExportAllMarker
):
  | Map<
      string,
      {
        desc: LocalExportDescription | ReexportExportDescription;
        module: ModuleResolution;
      }
    >
  | undefined;
export function getExportDesc(
  module: Resolution,
  exportKey: string | ExportAllMarker
):
  | {
      desc: LocalExportDescription | ReexportExportDescription;
      module: ModuleResolution;
    }
  | Map<
      string,
      {
        desc: LocalExportDescription | ReexportExportDescription;
        module: ModuleResolution;
      }
    >
  | undefined {
  module = makeNonCyclic(module);
  let desc = module.desc.exports.get(exportKey);

  if (desc?.type === "local" || desc?.type === "reexport") {
    return { desc, module };
  }
  if (desc?.type === "export-all") {
    let exportModule = module.resolvedImports[desc.importIndex];
    return getExports(exportModule);
  }
  if (
    !desc &&
    !isExportAllMarker(exportKey) &&
    [...module.desc.exports.values()].some((e) => e.type === "export-all")
  ) {
    let exportAllMarkers = [...module.desc.exports.keys()].filter((k) =>
      isExportAllMarker(k)
    ) as ExportAllMarker[];
    for (let exportAllMarker of exportAllMarkers) {
      let descriptions = getExportDesc(module, exportAllMarker)!;
      let desc = descriptions.get(exportKey);
      if (desc) {
        return desc;
      }
    }
  }
  return;
}

export function getExports(
  module: Resolution
): Map<
  string,
  {
    desc: LocalExportDescription | ReexportExportDescription;
    module: ModuleResolution;
  }
> {
  let result = new Map();
  for (let exportKey of module.desc.exports.keys()) {
    if (isExportAllMarker(exportKey)) {
      let descriptions = new Map(
        [...getExportDesc(module, exportKey)!].filter(
          ([key]) => key !== "default" // export-all does not export the default export of the source module
        )
      );
      0;
      result = new Map([...result, ...descriptions]);
    } else {
      let desc = getExportDesc(module, exportKey)!;
      result.set(exportKey, desc);
    }
  }
  return result;
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
    filename,
  }: {
    filename?: string;
  } = {}
): FileDescription {
  let isES6Module = false;
  let builder: RegionBuilder;
  let desc: ModuleDescription & CJSDescription;
  let consumedByModule: Set<string> = new Set();
  let cjsExportNames: string[] = [];
  let isTranspiledFromES = false;
  let dependsOn = new WeakMap<CodeRegion, Set<string>>();
  let moduleSideEffects: {
    regionFromPaths: NodePath[];
    dependsOn: NodePath[];
  }[] = [];
  let currentModuleScopedDeclaration:
    | {
        path: DuckPath;
        region: RegionPointer | undefined;
        defines: {
          declaration: NodePath;
          name: string;
          // we track the default export along with all our local names, and
          // it's the only one that has no identifier of its own
          identifier?: NodePath<Identifier>;
          sideEffects: NodePath | false;
          lvalStack: DuckPath[];
        }[];
        consumes: Set<string>;
        dependsOnRegion: Set<RegionPointer>;
        lvalStack: DuckPath[];
      }
    | undefined;

  function enterDeclaration(
    path:
      | NodePath<FunctionDeclaration>
      | NodePath<ClassDeclaration>
      | NodePath<VariableDeclarator>
  ) {
    let hasIdentifier = isIdentifier(path.node.id);
    let declaratorRegion: RegionPointer | undefined;
    if (isModuleScopedDeclaration(path as NodePath)) {
      declaratorRegion = builder.createCodeRegion(path as NodePath);
    }

    if (
      isModuleScopedDeclaration(path as NodePath) &&
      (path.node.type === "VariableDeclarator" || hasIdentifier)
    ) {
      let declarationRegion: RegionPointer | undefined;
      if (path.parent.type === "VariableDeclaration") {
        declarationRegion = builder.createCodeRegion(path.parentPath);
      }
      currentModuleScopedDeclaration = {
        path,
        region: declaratorRegion,
        defines: [],
        consumes: new Set(),
        dependsOnRegion: new Set(
          declarationRegion != null ? [declarationRegion] : []
        ),
        lvalStack: [],
      };
      if (hasIdentifier) {
        let identifier = path.get("id") as NodePath<Identifier>;
        currentModuleScopedDeclaration.defines.push({
          name: path.node.id.name,
          declaration: path as NodePath,
          identifier,
          sideEffects: sideEffectsForIdentifier(identifier),
          lvalStack: [],
        });
      }
    }
  }

  function exitDeclaration(path: DuckPath) {
    if (currentModuleScopedDeclaration?.path !== path) {
      return;
    }
    let {
      defines,
      consumes,
      dependsOnRegion,
      region: declaratorRegionPointer,
    } = currentModuleScopedDeclaration!;
    currentModuleScopedDeclaration = undefined;
    let declaratorRegion =
      declaratorRegionPointer != null
        ? desc.regions[declaratorRegionPointer]
        : undefined;
    for (let {
      name,
      declaration,
      identifier,
      sideEffects: sideEffectsRegion,
      lvalStack,
    } of defines) {
      if (!path.scope.getBinding(name) && identifier) {
        continue;
      }
      // if an "export default" exports an already declared binding, then our work
      // is already done
      if (
        desc.regions.find(
          (r) => r.type === "declaration" && r.declaration.declaredName === name
        )
      ) {
        continue;
      }
      let references: RegionPointer[] = [];
      if (identifier) {
        references = referencesForDeclaration(name, identifier, builder);
      }
      let regionDeps: Set<number> = new Set();
      let sideEffects: RegionPointer | undefined;
      if (sideEffectsRegion) {
        sideEffects = builder.createCodeRegion(sideEffectsRegion, undefined);
      }
      let currentDependsOn = [...dependsOnRegion][0]; // this is the declaration region
      let withinLval = lvalStack.length > 0;
      if (currentDependsOn != null) {
        if (withinLval && declaratorRegion && declaratorRegionPointer != null) {
          declaratorRegion.dependsOn.add(currentDependsOn);
          currentDependsOn = declaratorRegionPointer;
        }
        while (lvalStack.length > 0) {
          currentDependsOn = builder.createCodeRegion(
            lvalStack.pop()! as NodePath,
            "general",
            new Set([currentDependsOn])
          );
        }
        regionDeps.add(currentDependsOn);
      }
      let declarationPointer = builder.createCodeRegion(
        declaration,
        {
          type: "local",
          references,
          sideEffects,
          declaredName: name,
        },
        regionDeps
      );
      for (let referencePointer of references) {
        let reference = desc.regions[referencePointer];
        if (isReferenceCodeRegion(reference)) {
          reference.declarationRegion = declarationPointer;
        }
      }
      if (sideEffects) {
        desc.regions[sideEffects].dependsOn.add(declarationPointer);
      }
      dependsOn.set(builder.regions[declarationPointer], consumes);
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
        if (currentModuleScopedDeclaration?.lvalStack) {
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

  function addModuleSideEffect(
    path: NodePath,
    programChildPath: NodePath = path
  ) {
    if (programChildPath.parent.type !== "Program") {
      return;
    }
    let sideEffectIndex = programChildPath.parent.body.findIndex(
      (statement) => statement === programChildPath.node
    );
    let [lastSideEffectGroup] = moduleSideEffects.slice(-1);
    if (lastSideEffectGroup && programChildPath.type !== "ImportDeclaration") {
      let { regionFromPaths: lastSideEffects, dependsOn } = lastSideEffectGroup;
      if (lastSideEffects && lastSideEffects.length > 0) {
        let [lastSideEffect] = lastSideEffects;
        let lastSideEffectIndex = programChildPath.parent.body.findIndex(
          (statement) => statement === lastSideEffect.node
        );
        // merge contiguous side effects
        if (
          lastSideEffectIndex + 1 === sideEffectIndex &&
          lastSideEffect.type === programChildPath.type
        ) {
          lastSideEffects.push(programChildPath as NodePath);
          if (path !== programChildPath) {
            dependsOn.push(path);
          }
          return;
        }
      }
    }

    moduleSideEffects.push({
      regionFromPaths: [programChildPath as NodePath],
      dependsOn: path !== programChildPath ? [path] : [],
    });
  }

  const handlePossibleLVal = {
    enter(path: DuckPath) {
      if (
        (path.parentPath === currentModuleScopedDeclaration?.path &&
          currentModuleScopedDeclaration?.path.node.id === path.node) ||
        currentModuleScopedDeclaration?.lvalStack[0] === path.parentPath
      ) {
        currentModuleScopedDeclaration.lvalStack.unshift(path);
      }
    },
    exit(path: DuckPath) {
      if (currentModuleScopedDeclaration?.lvalStack[0] === path) {
        currentModuleScopedDeclaration.lvalStack.shift();
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
          declarations: new Map(),
          regions: builder.regions,
          esTranspiledExports: undefined,
        };
        for (let statement of path.get("body")) {
          // we create a code region for each statement in the body so that
          // reference code regions whose parents depend on them, will never be
          // a dependency of the document region--that's for side effects only
          builder.createCodeRegion(statement as NodePath);
        }
      },
      exit() {
        let document = builder.regions[documentPointer];
        for (let name of consumedByModule) {
          let declarationPointer = builder.regions.findIndex(
            (r) =>
              r.type === "declaration" && r.declaration.declaredName === name
          );
          if (declarationPointer !== notFoundPointer) {
            document.dependsOn.add(declarationPointer);
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
    VariableDeclarator: {
      enter: enterDeclaration,
      exit: exitDeclaration,
    },
    AssignmentPattern: handlePossibleLVal,
    ObjectPattern: handlePossibleLVal,
    ArrayPattern: handlePossibleLVal,
    RestElement: handlePossibleLVal,
    ObjectProperty: handlePossibleLVal,
    Identifier(path) {
      if (currentModuleScopedDeclaration?.lvalStack) {
        let declaration = declarationForIdentifier(path);
        let sideEffects = sideEffectsForIdentifier(path);
        if (declaration) {
          currentModuleScopedDeclaration.defines.push({
            name: path.node.name,
            declaration,
            identifier: path,
            sideEffects,
            lvalStack: [...currentModuleScopedDeclaration.lvalStack],
          });
        }
      }
      if (
        path.isReferencedIdentifier() &&
        (path.scope.path.node.type === "Program" ||
          path.scope.getBinding(path.node.name)?.scope.path.node.type ===
            "Program")
      ) {
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
          isTranspiledFromES ||
          (isMemberExpression(calleeNode) &&
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
            argumentsNodes[2].properties[0].key.name === "value"); // this seems close enough....
      }
    },
    ImportDeclaration(path) {
      isES6Module = true;
      // Note that we are intentionally not trying to reuse an existing import
      // description that imports from the same module. Different import
      // descriptions can have different regions even if they refer to the same
      // module.
      let importDesc = {
        specifier: path.node.source.value,
        isDynamic: false,
        isReexport: false,
        region: builder.createCodeRegion(path as NodePath, desc.imports.length),
      } as ImportDescription;
      desc.imports.push(importDesc);
      if (path.node.specifiers.length === 0) {
        addModuleSideEffect(path as NodePath);
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
    ExpressionStatement(path) {
      if (
        path.parent.type !== "Program" ||
        isSideEffectFree(path.node.expression)
      ) {
        return;
      }

      addModuleSideEffect(path.get("expression") as NodePath, path as NodePath);
    },
    ExportAllDeclaration(path) {
      isES6Module = true;

      let source = path.node.source.value;
      let exportRegion = builder.createCodeRegion(path as NodePath);
      let importIndex = ensureImportSpecifier(desc, source, exportRegion, true);

      let marker: ExportAllMarker = { exportAllFrom: source };
      desc.exports.set(marker, {
        type: "export-all",
        importIndex,
        exportRegion,
      });
    },
    ExportDefaultDeclaration: {
      enter(path) {
        isES6Module = true;

        // we're relying on the fact that default is a keyword so it can't be used
        // as a real local name
        let name = "default";
        switch (path.node.declaration.type) {
          case "Identifier":
            name = path.node.declaration.name;
            break;
          case "ClassDeclaration":
          case "FunctionDeclaration":
            if (isIdentifier(path.node.declaration.id)) {
              name = path.node.declaration.id.name;
            }
        }
        let exportRegion = builder.createCodeRegion(path as NodePath);
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
          region: exportRegion,
          defines: [
            {
              name: "default",
              declaration: path.get("declaration") as NodePath,
              sideEffects: false,
              lvalStack: [],
            },
          ],
          consumes: new Set(),
          dependsOnRegion: new Set(),
          lvalStack: [],
        };
      },
      exit: exitDeclaration,
    },
    ExportNamedDeclaration(path) {
      isES6Module = true;
      let exportRegion = builder.createCodeRegion(path as NodePath);
      if (path.node.source) {
        // we are reexporting things
        let importIndex = ensureImportSpecifier(
          desc,
          path.node.source!.value,
          exportRegion,
          true
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

  let declarations = declarationsMap(desc!.regions);
  let { regions } = desc!;
  resolveDependsOnReferences(dependsOn, desc!, declarations);
  discoverReferencesConsumedBySideEffects(desc!, declarations);

  let sideEffectPointers = moduleSideEffects.map(
    ({ regionFromPaths: paths, dependsOn: dependsOnPaths }) => {
      let dependsOn = dependsOnPaths.map((p) => builder.createCodeRegion(p));
      return builder.createCodeRegion(paths, "general", new Set(dependsOn));
    }
  );
  for (let { pointer } of declarations.values()) {
    let region = regions[pointer];
    region.dependsOn = new Set([...region.dependsOn, ...sideEffectPointers]);
  }
  let document = builder!.regions[documentPointer];
  let declarationSideEffects = [...declarations.values()]
    .filter(({ declaration }) => declaration.sideEffects != null)
    .map(({ declaration }) => declaration.sideEffects) as RegionPointer[];
  document.dependsOn = new Set([
    ...document.dependsOn,
    ...sideEffectPointers,
    ...declarationSideEffects,
  ]);

  // clean up any dependencies on ourself--this may happen because at the time
  // we didn't realize that we were identical to a code region that was
  // already created--different paths can have identical code regions, e.g. an
  // LVal declarator and an identifier for the declarator
  cleanupSelfDependencies(desc!.regions);

  assignCodeRegionPositions(documentPointer, desc!.regions);

  if (!isES6Module) {
    let { requires } = desc!;
    let esTranspiledExports = isTranspiledFromES ? cjsExportNames : undefined;
    return { regions, requires, esTranspiledExports };
  } else {
    let { imports, exports } = desc!;
    return { regions, imports, exports, declarations };
  }
}

function cleanupSelfDependencies(regions: FileDescription["regions"]) {
  for (let i = 0; i < regions.length; i++) {
    let region = regions[i];
    region.dependsOn.delete(i);
  }
}

export function assignCodeRegionPositions(
  pointer: RegionPointer,
  regions: CodeRegion[],
  index = 0
) {
  let region = regions[pointer];
  region.position = index++;
  if (region.firstChild != null) {
    assignCodeRegionPositions(region.firstChild, regions, index);
  }
  if (region.nextSibling != null) {
    assignCodeRegionPositions(region.nextSibling, regions, index);
  }
}

function resolveDependsOnReferences(
  dependsOn: WeakMap<CodeRegion, Set<string>>,
  desc: FileDescription,
  declarations: Declarations
) {
  for (let region of desc.regions) {
    let names = dependsOn.get(region);
    if (!names) {
      continue;
    }
    region.dependsOn = new Set([
      ...region.dependsOn,
      ...([...names].map((name) => declarations.get(name)).filter(Boolean) as {
        declaration: DeclarationDescription;
        pointer: RegionPointer;
      }[]).map(({ pointer }) => pointer),
    ]);
  }
}

function discoverReferencesConsumedBySideEffects(
  fileDesc: FileDescription,
  declarations: Declarations
) {
  let { regions } = fileDesc;
  let declarationsInSideEffects = [...declarations.values()].filter(
    ({ declaration }) =>
      declaration.sideEffects != null &&
      regions[declaration.sideEffects].firstChild != null
  );
  for (let {
    pointer: declarationRegion,
    declaration,
  } of declarationsInSideEffects) {
    let region = regions[declarationRegion];
    let sideEffectRegions = [...regionSet(declaration.sideEffects!, regions)];
    for (let {
      pointer,
      declaration: { references },
    } of declarations.values()) {
      if (intersection(sideEffectRegions, references).length > 0) {
        region.dependsOn.add(pointer);
      }
    }
  }
}

function regionSet(
  pointer: RegionPointer,
  regions: CodeRegion[]
): Set<RegionPointer> {
  let results: RegionPointer[] = [];
  let region = regions[pointer];
  let { firstChild, nextSibling } = region;
  if (firstChild !== undefined) {
    results.push(firstChild);
    results.push(...regionSet(firstChild, regions));
  }
  if (nextSibling !== undefined) {
    results.push(nextSibling);
    results.push(...regionSet(nextSibling, regions));
  }
  return new Set(results);
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

export function ensureImportSpecifier(
  desc: ModuleDescription,
  specifier: string,
  region: RegionPointer,
  isReexport: boolean
): number {
  let importDesc = desc.imports.find((i) => i.specifier === specifier);
  if (importDesc) {
    return desc.imports.indexOf(importDesc);
  } else {
    let importIndex = desc.imports.length;
    desc.imports.push({
      specifier,
      isDynamic: false,
      isReexport,
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
  let identifierPath = path.get("local") as NodePath<Identifier>;
  let references = referencesForDeclaration(
    identifierPath.node.name,
    identifierPath,
    builder
  );
  let declarationPointer = builder.createCodeRegion(path as NodePath, {
    type: "import",
    declaredName: identifierPath.node.name,
    importIndex: desc.imports.length - 1, // it's always the last import description added to desc.imports because the the order in which babel traverses the module
    importedName: remoteName,
    references,
    sideEffects: undefined,
  });
  for (let referencePointer of references) {
    let reference = desc.regions[referencePointer];
    if (isReferenceCodeRegion(reference)) {
      reference.declarationRegion = declarationPointer;
    }
  }
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

function referencesForDeclaration(
  name: string,
  identifierPath: NodePath<Identifier>,
  builder: RegionBuilder
): RegionPointer[] {
  return [
    builder.createCodeRegionForReference(identifierPath as NodePath),
    ...identifierPath.scope
      .getBinding(name)!
      // we filter because babel gives you some things like
      // ExportNamedDeclaration here that aren't relevant to us, because
      // we never do fine-grained renaming within export statements anyway
      // -- we re-synthesize entire export statements.
      .referencePaths.filter((path) => path.type === "Identifier")
      .map((p) => builder.createCodeRegionForReference(p)),
  ];
}

// this is a convenience to replace the removal of the "names" property in
// ModuleDescription. it would be nice if this was memoized, somehow, after the
// resolution has been constructed...
export function declarationsMap(
  regions: FileDescription["regions"]
): Map<
  string,
  { declaration: DeclarationDescription; pointer: RegionPointer }
> {
  return new Map(
    (regions.filter(
      (r) => r.type === "declaration"
    ) as DeclarationCodeRegion[]).map(({ declaration }) => [
      declaration.declaredName,
      {
        declaration,
        pointer: regions.findIndex(
          (r2) =>
            r2.type === "declaration" &&
            r2.declaration.declaredName === declaration.declaredName
        ),
      },
    ])
  );
}
