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
  Node,
  Program,
  ObjectProperty,
  CallExpression,
  isVariableDeclarator,
  isIdentifier,
  isStringLiteral,
  AssignmentExpression,
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
  documentPointer,
  DeclarationCodeRegion,
  DeclarationDescription,
  isReferenceCodeRegion,
} from "./code-region";
import { warn } from "./logger";
import {
  ModuleResolution,
  Resolution,
  makeNonCyclic,
} from "./nodes/resolution";
import { NamespaceMarker } from "./code-region";
import { assignCodeRegionPositions } from "./region-editor";
import { hasIntersection } from "./utils";

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
  declarations: Declarations;
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
  reexportSpecifierRegion: RegionPointer;
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
      // if the specifier for an import() is not a string literal, then we throw
      // a runtime error. we identify that by setting the specifier to
      // undefined.
      specifier: string | undefined;
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

export function describeFile(ast: File, filename: string): FileDescription {
  let isES6Module = false;
  let builder: RegionBuilder;
  let desc: ModuleDescription & CJSDescription;
  let consumedByModule: Set<string> = new Set();
  let cjsExportNames: string[] = [];
  let isTranspiledFromES = false;
  let dependsOn = new WeakMap<CodeRegion, Set<string>>();
  let moduleSideEffects: NodePath[][] = [];
  let assignments: Set<NodePath<AssignmentExpression>> = new Set();
  let programPath: NodePath<Program>;
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
        references = referencesForDeclaration(
          name,
          identifier,
          programPath,
          builder
        );
      }
      let regionDeps: Set<number> = new Set();
      let declaratorOfRegion = [...dependsOnRegion][0]; // this is the declaration region
      let currentDependsOn = declaratorOfRegion;
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
      let sideEffects: RegionPointer | undefined;
      if (sideEffectsRegion) {
        sideEffects = builder.createCodeRegion(sideEffectsRegion, undefined);
        regionDeps.add(sideEffects);
      }
      if (references[0] != null) {
        regionDeps.add(references[0]); // the first reference is the self-reference in the declaration
      }
      let declarationPointer = builder.createCodeRegion(
        declaration,
        {
          type: "local",
          source: filename,
          declaratorOfRegion,
          references,
          declaredName: name,
          initializedBy: [],
        },
        regionDeps
      );
      for (let referencePointer of references) {
        let reference = desc.regions[referencePointer];
        if (isReferenceCodeRegion(reference)) {
          reference.dependsOn.add(declarationPointer);
        }
      }
      if (sideEffects) {
        desc.regions[documentPointer].dependsOn.add(declarationPointer);
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

  function addModuleSideEffect(path: NodePath) {
    if (path.parent.type !== "Program") {
      return;
    }
    let sideEffectIndex = path.parent.body.findIndex(
      (statement) => statement === path.node
    );
    let [lastSideEffects] = moduleSideEffects.slice(-1);
    if (lastSideEffects && lastSideEffects.length > 0) {
      let [lastSideEffect] = lastSideEffects.slice(-1);
      let lastSideEffectIndex = path.parent.body.findIndex(
        (statement) => statement === lastSideEffect.node
      );
      // merge contiguous side effects
      if (
        path.type !== "ImportDeclaration" &&
        lastSideEffect.type !== "ImportDeclaration" &&
        lastSideEffectIndex + 1 === sideEffectIndex
      ) {
        lastSideEffects.push(path as NodePath);
        return;
      }
    }

    moduleSideEffects.push([path as NodePath]);
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
        programPath = path;
        builder = new RegionBuilder(path);
        desc = {
          imports: [],
          requires: [],
          exports: new Map(),
          declarations: new Map(),
          regions: builder.regions,
          esTranspiledExports: undefined,
        };
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
      if (
        currentModuleScopedDeclaration?.lvalStack &&
        currentModuleScopedDeclaration.lvalStack.length > 0
      ) {
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
        } else if (
          ![
            "ExportSpecifier",
            "ExportDefaultDeclaration",
            "ExportNamespaceSpecifier",
          ].includes(path.parent.type)
        ) {
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
      // If there are signals that we are actually in an ES6 module, then we can
      // bail. all the logic below is for CJS files.
      if (isES6Module) {
        return;
      }

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
    AssignmentExpression(path) {
      assignments.add(path);
    },
    ImportDeclaration(path) {
      isES6Module = true;
      // Note that we are intentionally not trying to reuse an existing import
      // description that imports from the same module. Different import
      // descriptions can have different regions even if they refer to the same
      // module.
      let sourceRegion = builder.createCodeRegion(
        path.get("source") as NodePath
      );
      let importDesc = {
        specifier: path.node.source.value,
        isDynamic: false,
        isReexport: false,
        region: builder.createCodeRegion(
          path as NodePath,
          desc.imports.length,
          new Set([sourceRegion])
        ),
      } as ImportDescription;
      desc.imports.push(importDesc);
      if (path.node.specifiers.length === 0) {
        addModuleSideEffect(path as NodePath);
      }
    },
    ImportSpecifier(path) {
      addImportedName(
        desc,
        path.node.imported.name,
        path,
        programPath,
        builder
      );
    },
    ImportDefaultSpecifier(path) {
      addImportedName(desc, "default", path, programPath, builder);
    },
    ImportNamespaceSpecifier(path) {
      addImportedName(desc, NamespaceMarker, path, programPath, builder);
    },
    Import(path) {
      isES6Module = true;
      let callExpression = path.parentPath as NodePath<CallExpression>;
      let specifier: string | undefined;
      if (isStringLiteral(callExpression.node.arguments[0])) {
        specifier = callExpression.node.arguments[0].value;
      } else {
        warn(
          `encountered an import() whose specifier is not a string literal${
            filename ? " in file " + filename : ""
          }. If this import() is evaluated, a runtime error will be thrown.`
        );
      }
      let importIndex = desc.imports.findIndex(
        (i) => i.specifier === specifier
      );
      let importDesc = importIndex > -1 ? desc.imports[importIndex] : undefined;
      let specifierRegion = builder.createCodeRegion(
        (path.parentPath.get("arguments") as NodePath[])[0]
      );
      if (!importDesc) {
        if (!Array.isArray(path.parentPath.get("arguments"))) {
          throw new Error(
            `Cannot determine path to dynamic import's specifier '${specifier}'${
              filename ? " in file " + filename : ""
            }`
          );
        }
        importDesc = {
          specifierRegion,
          specifier,
          isDynamic: true,
        };
        importIndex = desc.imports.length;
        desc.imports.push(importDesc);
      } else {
        importDesc.isDynamic = true;
        if (importDesc.isDynamic) {
          importDesc.specifier = specifier;
          importDesc.specifierRegion = specifierRegion;
        }
      }
      if (importDesc.isDynamic) {
        builder.createCodeRegion(
          path as NodePath,
          {
            importIndex,
            exportType: undefined,
            isDynamic: true,
            specifierForDynamicImport: importDesc.specifier,
          },
          new Set([importDesc.specifierRegion])
        );
      }
    },
    BlockStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    DoWhileStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    ForStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    ForInStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    ForOfStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    IfStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    SwitchStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    ThrowStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    TryStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    WhileStatement(path) {
      addModuleSideEffect(path as NodePath);
    },
    ExpressionStatement(path) {
      if (
        path.parent.type !== "Program" ||
        isSideEffectFree(path.node.expression)
      ) {
        return;
      }

      addModuleSideEffect(path as NodePath);
    },
    ExportAllDeclaration(path) {
      isES6Module = true;

      let source = path.node.source.value;
      let specifier = path.node.source.value;
      let importIndex = desc.imports.findIndex(
        (i) => i.specifier === specifier
      );
      let importExists = importIndex > -1;
      importIndex = importIndex === -1 ? desc.imports.length : importIndex;
      let sourceRegion = builder.createCodeRegion(
        path.get("source") as NodePath
      );
      let exportRegion = builder.createCodeRegion(
        path as NodePath,
        {
          importIndex,
          exportType: "export-all",
          specifierForDynamicImport: undefined,
          isDynamic: false,
        },
        new Set([sourceRegion])
      );
      if (!importExists) {
        desc.imports.push({
          specifier,
          isDynamic: false,
          isReexport: true,
          region: exportRegion,
        });
      }

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
      if (path.node.source) {
        // we are reexporting things
        let specifier = path.node.source.value;
        let importIndex = desc.imports.findIndex(
          (i) => i.specifier === specifier
        );
        let importExists = importIndex > -1;
        importIndex = importIndex === -1 ? desc.imports.length : importIndex;
        let sourceRegion = builder.createCodeRegion(
          path.get("source") as NodePath
        );
        let exportRegion = builder.createCodeRegion(
          path as NodePath,
          {
            importIndex,
            exportType: "reexport",
            specifierForDynamicImport: undefined,
            isDynamic: false,
          },
          new Set()
        );
        if (!importExists) {
          desc.imports.push({
            specifier,
            isDynamic: false,
            isReexport: true,
            region: exportRegion,
          });
        }
        let dependsOn = new Set<RegionPointer>([sourceRegion]);
        for (let specPath of path.get("specifiers")) {
          let reexportSpecifierRegion = builder.createCodeRegion(
            specPath as NodePath,
            "reexport-specifier",
            new Set([exportRegion])
          );
          dependsOn.add(reexportSpecifierRegion);
          let spec = specPath.node;
          switch (spec.type) {
            case "ExportDefaultSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: "default",
                importIndex,
                exportRegion,
                reexportSpecifierRegion,
              });
              break;
            case "ExportSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: spec.local.name,
                importIndex,
                exportRegion,
                reexportSpecifierRegion,
              });
              break;
            case "ExportNamespaceSpecifier":
              desc.exports.set(spec.exported.name, {
                type: "reexport",
                name: NamespaceMarker,
                importIndex,
                exportRegion,
                reexportSpecifierRegion,
              });
              break;
            default:
              assertNever(spec);
          }
        }
        builder.regions[exportRegion].dependsOn = dependsOn;
      } else {
        // we are not reexporting
        let exportRegion = builder.createCodeRegion(path as NodePath);
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

  if (isES6Module) {
    setReferencesFromAssignments(
      programPath!,
      assignments,
      desc!.regions,
      builder!,
      filename
    );
  }

  let declarations = declarationsMap(desc!.regions);
  let { regions } = desc!;
  resolveDependsOnReferences(dependsOn, desc!, declarations);

  let sideEffectPointers = moduleSideEffects.map((paths) => {
    return builder.createCodeRegion(paths, "general");
  });

  let document = regions[documentPointer];
  document.dependsOn = new Set([...document.dependsOn, ...sideEffectPointers]);
  cleanUpSideEffects(regions);

  // clean up any dependencies on ourself--this may happen because at the time
  // we didn't realize that we were identical to a code region that was
  // already created--different paths can have identical code regions, e.g. an
  // LVal declarator and an identifier for the declarator
  cleanupSelfDependencies(regions);

  setDeclarationInitializers(regions);

  assignCodeRegionPositions(regions);

  if (!isES6Module) {
    let { requires } = desc!;
    let esTranspiledExports = isTranspiledFromES ? cjsExportNames : undefined;
    return { regions, requires, esTranspiledExports, declarations };
  } else {
    let { imports, exports } = desc!;
    return { regions, imports, exports, declarations };
  }
}

// Gathers all the side effect regions that consume a local declaration in the
// module.
function setDeclarationInitializers(regions: FileDescription["regions"]) {
  let sideEffects = regions[documentPointer].dependsOn;
  for (let [pointer, region] of regions.entries()) {
    if (region.type !== "declaration" || region.declaration.type !== "local") {
      continue;
    }
    let { declaration } = region;
    declaration.initializedBy = [];
    let references = new Set(declaration.references);
    for (let sideEffectPointer of sideEffects) {
      if (
        sideEffectPointer !== pointer &&
        hasIntersection(references, regions[sideEffectPointer].dependsOn)
      ) {
        declaration.initializedBy.push(sideEffectPointer);
      }
    }
  }
}

// the side effects that we have gathered include general regions in the module,
// which can be call expressions, for loops, if/else's, etc that are module
// scoped as well as declarations that happen to be side effectful. The goal
// here is that we only want to capture the first step of each side effect
// subgraph--not all the nodes. When we capture all the nodes, we don't know
// which node comes before the other. Rather we capture the first node (region)
// of each side effect sub-graph, and then allow our region walk to flesh out
// the rest of the graph in order. Side effects captured in general regions are
// each considered the root of their respective side effect subgraph. The side
// effectful declaration regions, however, may be the root of a side effectful
// subgraph, or they may actually be a dependency of a side effectful general
// region, in which case we should prune it from the document's dependencies, as
// there already is a path to it from a side effect sub graph.
function cleanUpSideEffects(regions: FileDescription["regions"]) {
  let declarationPointers = [...regions[documentPointer].dependsOn].filter(
    (p) => regions[p].type === "declaration"
  );
  let generalRegionPointers = [...regions[documentPointer].dependsOn].filter(
    (p) => regions[p].type === "general"
  );
  for (let declarationPointer of declarationPointers) {
    let { declaration } = regions[declarationPointer] as DeclarationCodeRegion;
    for (let generalPointer of generalRegionPointers) {
      if (
        findDeclarationDependency(
          generalPointer,
          declaration.declaredName,
          regions
        )
      ) {
        // this is a side effectful declaration that is actually consumed by a
        // module side effect
        regions[documentPointer].dependsOn.delete(declarationPointer);
        break;
      }
    }
  }
}

function findDeclarationDependency(
  start: RegionPointer,
  name: string,
  regions: FileDescription["regions"],
  seen: Set<RegionPointer> = new Set()
): boolean {
  seen.add(start);
  let region = regions[start];
  if (
    region.type === "declaration" &&
    region.declaration.declaredName === name
  ) {
    return true;
  }
  for (let dep of region.dependsOn) {
    if (seen.has(dep)) {
      continue;
    }
    if (findDeclarationDependency(dep, name, regions, seen)) {
      return true;
    }
  }
  return false;
}

function cleanupSelfDependencies(regions: FileDescription["regions"]) {
  for (let i = 0; i < regions.length; i++) {
    let region = regions[i];
    region.dependsOn.delete(i);
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
  programPath: NodePath<Program>,
  builder: RegionBuilder
) {
  let identifierPath = path.get("local") as NodePath<Identifier>;
  let references = referencesForDeclaration(
    identifierPath.node.name,
    identifierPath,
    programPath,
    builder
  );
  let declarationPointer = builder.createCodeRegion(path as NodePath, {
    type: "import",
    declaredName: identifierPath.node.name,
    importIndex: desc.imports.length - 1, // it's always the last import description added to desc.imports because the the order in which babel traverses the module
    importedName: remoteName,
    references,
  });
  for (let referencePointer of references) {
    let reference = desc.regions[referencePointer];
    if (isReferenceCodeRegion(reference)) {
      reference.dependsOn.add(declarationPointer);
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

function isSideEffectFree(node: Node): boolean {
  switch (node.type) {
    case "BooleanLiteral":
    case "NumericLiteral":
    case "StringLiteral":
    case "RegExpLiteral":
    case "NullLiteral":
    case "Identifier":
    case "FunctionExpression":
    case "ClassExpression":
      return true;
    case "MemberExpression":
      return isSideEffectFree(node.property);
    case "ArrayExpression":
      return node.elements.every((e) => isSideEffectFree(e as Expression));
    case "SpreadElement":
      return isSideEffectFree(node.argument);
    case "ConditionalExpression":
      return (
        isSideEffectFree(node.test) &&
        isSideEffectFree(node.consequent) &&
        isSideEffectFree(node.alternate)
      );
    case "LogicalExpression":
    case "BinaryExpression":
      return isSideEffectFree(node.left) && isSideEffectFree(node.right);
    case "UnaryExpression":
      return isSideEffectFree(node.argument);
    case "ObjectExpression":
      return node.properties.every(
        (p) =>
          p.type === "ObjectMethod" ||
          (p.type === "ObjectProperty" &&
            isSideEffectFree(p.key) &&
            isSideEffectFree(p.value)) ||
          (p.type === "SpreadElement" && isSideEffectFree(p.argument))
      );
    default:
      return false;
  }
}

function referencesForDeclaration(
  name: string,
  identifierPath: NodePath<Identifier>,
  programPath: NodePath<Program>,
  builder: RegionBuilder
): RegionPointer[] {
  return [
    builder.createCodeRegionForReference(identifierPath as NodePath),
    ...programPath.scope
      .getBinding(name)!
      // we filter because babel gives you some things like
      // ExportNamedDeclaration here that aren't relevant to us, because
      // we never do fine-grained renaming within export statements anyway
      // -- we re-synthesize entire export statements.
      .referencePaths.filter((path) => path.type === "Identifier")
      .map((p) => builder.createCodeRegionForReference(p)),
  ];
}

// @babel has a bug whereby it does not recognize the left side of an assignment
// expression as a binding reference
// https://github.com/babel/babel/issues/10299, so we are gathering up all the
// assignment expressions and looking for any assignments of bindings in the
// module scope and turning those Identifiers into reference regions.
function setReferencesFromAssignments(
  programPath: NodePath<Program>,
  assignments: Set<NodePath<AssignmentExpression>>,
  regions: CodeRegion[],
  builder: RegionBuilder,
  filename: string
) {
  let moduleScope = programPath.scope;
  function setReferenceForName(name: string, path: NodePath) {
    let moduleScopedBinding = moduleScope.getBinding(name);
    let currentScope = path.scope;
    let binding = currentScope.getBinding(name);
    if (binding === moduleScopedBinding) {
      let declarationPointer = regions.findIndex(
        (r) => r.type === "declaration" && r.declaration.declaredName === name
      );
      let declarationRegion = regions[declarationPointer];
      if (!declarationRegion || declarationRegion.type !== "declaration") {
        throw new Error(
          `could not find declaration region for '${name}' in ${filename} despite finding a module scoped binding with this name`
        );
      }
      let referencePointer = builder.createCodeRegionForReference(path);
      regions[referencePointer].dependsOn.add(declarationPointer);
      declarationRegion.declaration.references.push(referencePointer);
    }
  }

  function setReference(path: NodePath<LVal> | NodePath<ObjectProperty>) {
    let { node } = path;
    switch (node.type) {
      case "Identifier":
        let name = node.name as string;
        setReferenceForName(name, path as NodePath);
        break;
      case "ObjectPattern":
        let properties = path.get("properties") as NodePath<ObjectProperty>[];
        for (let prop of properties) {
          setReference(prop);
        }
        break;
      case "ObjectProperty":
        setReference(path.get("value") as NodePath<LVal>);
        break;
      case "ArrayPattern":
        let elements = path.get("elements") as NodePath<LVal>[];
        for (let element of elements) {
          setReference(element);
        }
        break;
      case "RestElement":
        setReference(path.get("element") as NodePath<LVal>);
        break;
      case "AssignmentPattern":
        setReference(path.get("left") as NodePath<LVal>);
        break;
      case "MemberExpression":
      case "TSParameterProperty":
        break;
      default:
        assertNever(node);
    }
  }

  for (let assignment of assignments) {
    let assignee = assignment.get("left");
    setReference(assignee);
  }
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
