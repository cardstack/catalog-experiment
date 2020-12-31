import { BuilderNode, NextNode, Value } from "./common";
import { makeNonCyclic, ModuleResolution, Resolution } from "./resolution";
import { getExportDesc, getExports, ModuleDescription } from "../describe-file";
import {
  CodeRegion,
  DeclarationCodeRegion,
  documentPointer,
  isNamespaceMarker,
  RegionEditor,
  RegionPointer,
} from "../code-region";
import { BundleAssignment, BundleAssignmentsNode } from "./bundle";
import { HeadState, Editor } from "../module-rewriter";
import { AppendModuleNode, FinishAppendModulesNode } from "./append-module";
import { Dependencies } from "./entrypoint";
import { pkgInfoFromCatalogJsURL } from "../resolver";
import {
  DependencyResolver,
  resolutionForPkgDepDeclaration,
  ResolvedDependency,
  ResolvedDeclarationDependency,
  UnresolvedResult,
} from "../dependency-resolution";
import { GetLockFileNode, LockEntries, LockFile } from "./lock-file";
import { flatMap } from "lodash";

export class CombineModulesNode implements BuilderNode {
  cacheKey: CombineModulesNode;
  constructor(
    private bundle: URL,
    private dependencies: Dependencies,
    private lockEntries: LockEntries,
    private bundleAssignmentsNode: BundleAssignmentsNode
  ) {
    this.cacheKey = this;
  }

  async deps() {
    return {
      info: new PrepareCombineModulesNode(
        this.bundle,
        this.bundleAssignmentsNode
      ),
    };
  }

  async run({
    info: { assignments, resolutionsInDepOrder, lockFile },
  }: {
    info: {
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
      lockFile: LockFile | undefined;
    };
  }): Promise<NextNode<{ code: string; desc: ModuleDescription }>> {
    let ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );

    let depResolver = new DependencyResolver(
      this.dependencies,
      assignments,
      this.lockEntries,
      lockFile,
      this.bundle
    );

    let exposed = exposedRegions(this.bundle, assignments, depResolver);

    let editors: Editor[] = [];
    let visitedRegions: Map<
      string,
      Map<RegionPointer, RegionEditor>
    > = new Map();

    // the exposed regions inherit their order from BundleAssignments which is
    // organized consumers first.
    for (let { pointer, module: resolution } of exposed) {
      let module = makeNonCyclic(resolution);
      let editor: RegionEditor | undefined;
      // use an existing editor if there is one
      ({ editor } =
        editors.find((e) => e.module.url.href === module.url.href) ?? {});
      if (!editor) {
        // otherwise create a new editor and insert it before its consumers
        editor = new RegionEditor(module.source, module.desc, this.bundle);
        let editorAbsoluteIndex = resolutionsInDepOrder.findIndex(
          (m) => m.url.href === module.url.href
        );
        let index = editors.length;
        while (index > 0) {
          if (
            resolutionsInDepOrder.findIndex(
              (m) => m.url.href === editors[index - 1].module.url.href
            ) < editorAbsoluteIndex
          ) {
            break;
          }
          index--;
        }
        editors.splice(index, 0, {
          module,
          editor,
          sideEffectDeclarations: new Set(),
        });
      }
      discoverIncludedRegions(
        this.bundle,
        module,
        pointer,
        editor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions
      );
    }
    // remove declaration regions that have no more declarator regions
    for (let { editor } of editors) {
      let flattenedDeclarators = flatMap(editor.regions, (region, pointer) =>
        region.type === "declaration" &&
        region.declaration.type === "local" &&
        region.declaration.declaratorOfRegion != null
          ? [[region.declaration.declaratorOfRegion, pointer]]
          : []
      );
      let declarations = flattenedDeclarators.reduce(
        (declarations, [declarationPointer, declaratorPointer]) => {
          if (editor.dispositions[declarationPointer].state !== "removed") {
            let declarators = declarations.get(declarationPointer);
            if (!declarators) {
              declarators = [];
              declarations.set(declarationPointer, declarators);
            }
            if (editor.dispositions[declaratorPointer].state !== "removed") {
              declarators.push(declaratorPointer);
            }
          }
          return declarations;
        },
        new Map()
      );
      for (let [declarationPointer, declarators] of declarations) {
        if (declarators.length === 0) {
          editor.removeRegion(declarationPointer);
        }
      }
    }
    // filter out editors that have only retained solely their document regions,
    // these are no-ops
    editors = editors.filter(
      (e) =>
        !e.editor
          .includedRegions()
          .every((p) => e.editor.regions[p].type === "document")
    );

    let headState = new HeadState(editors);
    let { module, editor, sideEffectDeclarations } = headState.next() ?? {};
    if (!module || !editor) {
      // this is an empty module, like just "export{};"
      return {
        node: new FinishAppendModulesNode(
          headState,
          this.bundle,
          assignments,
          this.dependencies,
          [],
          depResolver
        ),
      };
    }
    return {
      node: new AppendModuleNode(
        headState,
        module,
        this.bundle,
        editor,
        sideEffectDeclarations ?? new Set(),
        assignments,
        this.dependencies,
        depResolver
      ),
    };
  }
}

function discoverIncludedRegions(
  bundle: URL,
  module: Resolution,
  pointer: RegionPointer,
  editor: RegionEditor,
  editors: Editor[],
  ownAssignments: BundleAssignment[],
  depResolver: DependencyResolver,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>,
  stack: {
    module: Resolution;
    pointer: RegionPointer;
    region: CodeRegion;
  }[] = [{ module, pointer, region: module.desc.regions[pointer] }]
) {
  let region = module.desc.regions[pointer];
  if (visitedRegions.get(module.url.href)?.has(pointer)) {
    let previousEditor = visitedRegions.get(module.url.href)!.get(pointer)!;
    if (previousEditor === editor) {
      return;
    }
    let previousEditorIndex = editors.findIndex(
      (e) => e.editor === previousEditor
    );
    let currentEditorIndex = editors.findIndex((e) => e.editor === editor);
    if (previousEditorIndex < currentEditorIndex) {
      // the region that we are visiting appears in an editor that is not the
      // first editor for this module, and whose previous editor is actually
      // already emitting this exact same region. In this case this is a
      // particular region that _needs_ to be duplicated in order for the
      // serialized javascript in our current editor to be correct.
      if (!editor.isDependentUponRegion(pointer)) {
        return;
      }
    } else {
      // the region that we are visiting and it's subgraph need to be hoisted to
      // the current editor so that it is serialized in the correct order. remove
      // the region from the previous editor and recalculate the region to keep
      // with the current editor.
      if (!previousEditor.isDependentUponRegion(pointer)) {
        if (region.type === "declaration") {
          previousEditor.removeRegionAndItsChildren(pointer);
          revisitRegionAndItsChildren(pointer, module, visitedRegions);
        } else {
          previousEditor.removeRegion(pointer);
        }
      }
    }
  }
  let visited = visitedRegions.get(module.url.href);
  if (!visited) {
    visited = new Map();
    visitedRegions.set(module.url.href, visited);
  }
  visited.set(pointer, editor);

  // collapse module side effects
  if (region.original) {
    let pkgURL = pkgInfoFromCatalogJsURL(new URL(region.original.bundleHref))
      ?.pkgURL;
    if (!pkgURL) {
      throw new Error(
        `Cannot determine pkgURL that corresponds to the bundle URL: ${region.original.bundleHref}`
      );
    }
    let resolution = depResolver.resolutionByConsumptionRegion(
      module,
      pointer,
      pkgURL
    );
    if (!resolution) {
      let declarationPointer = [...region.dependsOn].find(
        (p) => module.desc.regions[p].type === "declaration"
      );
      let declarationInDifferentModule = false;
      if (declarationPointer != null) {
        let declarationRegion = module.desc.regions[declarationPointer];
        if (
          declarationRegion.type === "declaration" &&
          declarationRegion.declaration.type === "local" &&
          declarationRegion.declaration.original
        ) {
          let pkgURL = pkgInfoFromCatalogJsURL(
            new URL(declarationRegion.declaration.original.bundleHref)
          )?.pkgURL;
          let resolution = pkgURL
            ? depResolver.resolutionByConsumptionRegion(
                makeNonCyclic(module),
                declarationPointer,
                pkgURL
              )
            : undefined;
          if (resolution?.type === "declaration") {
            declarationInDifferentModule = resolution.importedSource
              ? resolution.importedSource.declaredIn.url.href !==
                module.url.href
              : resolution.consumedBy.url.href !== module.url.href;
          }
        }
      }

      // don't manipulate side effects within a declaration. we can use more
      // sophisticated resolution for bindings, and if they are indeed unused,
      // we'll rename them thusly
      if (declarationPointer == null || declarationInDifferentModule) {
        // this side effect can be collapsed--the pkg's resolved module (which is
        // not this module) should already be including all the necessary side
        // effects
        editor.removeRegionAndItsChildren(pointer);
        visitRegionAndItsChildren(pointer, module, editor, visitedRegions);
        return;
      }
    }
  }

  if (region.type === "declaration" && region.declaration.type === "import") {
    let localDesc = region.declaration;
    let importedModule = makeNonCyclic(module).resolvedImports[
      localDesc.importIndex
    ];
    let importedName = localDesc.importedName;
    let source = depResolver.resolveDeclaration(
      importedName,
      importedModule,
      module,
      ownAssignments
    );
    if (source.type === "resolved") {
      if (source.module.url.href !== module.url.href) {
        editor = addNewEditor(source.module, editor, editors, bundle);
        module = source.module;
        region = editor.regions[source.pointer];
      }
      discoverIncludedRegions(
        bundle,
        source.module,
        source.pointer,
        editor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions,
        [
          {
            module: source.module,
            pointer: source.pointer,
            region: editor.regions[source.pointer],
          },
          ...stack,
        ]
      );
    } else {
      if (
        source.resolution &&
        source.resolution.type === "declaration" &&
        !source.resolution.importedSource
      ) {
        // This is the scenario where the resolution resolves to an
        // already fashioned namespace object declaration
        let newEditor = addNewEditor(
          source.resolution.consumedBy,
          editor,
          editors,
          bundle
        );
        discoverIncludedRegions(
          bundle,
          source.resolution.consumedBy,
          source.resolution.consumedByPointer,
          newEditor,
          editors,
          ownAssignments,
          depResolver,
          visitedRegions,
          [
            {
              module: source.resolution.consumedBy,
              pointer: source.resolution.consumedByPointer,
              region: newEditor.regions[source.resolution.consumedByPointer],
            },
            ...stack,
          ]
        );
        return; // no need to process any of the original namespace import's dependencies, we've moved on...
      }
      let consumingModule = makeNonCyclic(
        source.resolution?.consumedBy ?? source.consumingModule
      );
      let importedPointer =
        source.resolution?.consumedByPointer ?? source.importedPointer;
      if (importedPointer == null) {
        throw new Error(
          `bug: could not determine code region pointer for import of ${JSON.stringify(
            source.importedAs
          )} from ${source.importedFromModule.url.href} in module ${
            consumingModule.url.href
          }`
        );
      }
      if (consumingModule.url.href !== module.url.href) {
        editor = addNewEditor(consumingModule, editor, editors, bundle);
      }
      if (
        ownAssignments.find(
          (a) =>
            a.module.url.href ===
            (source as UnresolvedResult).importedFromModule.url.href
        ) &&
        isNamespaceMarker(source.resolution?.importedAs ?? source.importedAs)
      ) {
        // we mark the namespace import region as something we want to keep as a
        // signal to the Append nodes to manufacture a namespace object for this
        // consumed import--ultimately, though, we will not include this region.
        if (importedPointer == null) {
          throw new Error(
            `unable to determine the region for a namespace import '${region.declaration.declaredName}' of ${source.importedFromModule.url.href} from the consuming module ${source.consumingModule.url.href} in bundle ${bundle.href}`
          );
        }
        editor.keepRegion(importedPointer);

        let newEditor = addNewEditor(
          source.resolution?.importedSource?.declaredIn ??
            source.importedFromModule,
          editor,
          editors,
          bundle
        );
        discoverIncludedRegionsForNamespace(
          bundle,
          source.resolution?.importedSource?.declaredIn ??
            source.importedFromModule,
          newEditor,
          editors,
          ownAssignments,
          depResolver,
          visitedRegions,
          stack
        );
        return; // don't include the dependsOn in this signal
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        editor.keepRegion(importedPointer);
        return; // don't include the dependsOn in this signal
      }
    }
  } else if (
    region.type === "declaration" &&
    region.declaration.type === "local" &&
    region.declaration.original
  ) {
    let bundleHref = region.declaration.original.bundleHref;
    let isRegionObviated: boolean;
    let originalEditor = editor;
    let originalPointer = pointer;
    let resolution: ResolvedDependency | undefined;
    ({
      module,
      region,
      pointer,
      editor,
      isRegionObviated,
      resolution,
    } = resolveDependency(
      bundleHref,
      depResolver,
      makeNonCyclic(module),
      pointer,
      region,
      editor,
      editors,
      bundle
    ));
    if (!isRegionObviated) {
      // the region for the consumption point is actually the region we
      // want to keep.
      editor.keepRegion(pointer);
    } else {
      // we don't want any dangling side effects. we'll recreate all the regions
      // for this declaration in the resolved module's editor
      originalEditor.removeRegionAndItsChildren(originalPointer);
    }
    if (
      resolution?.type === "declaration" &&
      isNamespaceMarker(resolution?.importedAs) &&
      resolution.importedSource?.declaredIn
    ) {
      // in this case we are replacing a local namespace object declaration with
      // a namespace import (because it's resolution won), meaning that we'll
      // re-derive the namespace object. In order to do that we keep the
      // namespace import, which is our signal to the downstream processes that
      // we want a namespace object manufactured here.
      editor.keepRegion(pointer);
      let newEditor = addNewEditor(
        resolution.importedSource.declaredIn,
        editor,
        editors,
        bundle
      );
      discoverIncludedRegionsForNamespace(
        bundle,
        resolution.importedSource.declaredIn,
        newEditor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions,
        stack
      );
      return; // don't include the dependsOn in this namespace import signal
    }
    discoverIncludedRegions(
      bundle,
      module,
      pointer,
      editor,
      editors,
      ownAssignments,
      depResolver,
      visitedRegions,
      [{ module, pointer, region }, ...stack]
    );
  } else if (region.type === "import" && !region.isDynamic) {
    // we mark the external bundle import region as something we want to keep
    // as a signal to the Append nodes that this import is consumed and to
    // include this region in the resulting bundle.
    editor.keepRegion(pointer);
    let importedModule = makeNonCyclic(module).resolvedImports[
      region.importIndex
    ];
    if (
      ownAssignments.find((a) => a.module.url.href === importedModule.url.href)
    ) {
      let newEditor = addNewEditor(importedModule, editor, editors, bundle);
      discoverIncludedRegions(
        bundle,
        importedModule,
        documentPointer,
        newEditor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions,
        [
          {
            module,
            pointer: documentPointer,
            region: editor.regions[documentPointer],
          },
          ...stack,
        ]
      );
    }
    return; // don't include the dependsOn in this signal
  } else {
    if (hasModuleDeclarationWithSideEffectSignature(stack)) {
      editors
        .find(({ editor: e }) => e === editor)!
        .sideEffectDeclarations.add(pointer);
    }
    editor.keepRegion(pointer);
  }
  for (let depPointer of region.dependsOn) {
    discoverIncludedRegions(
      bundle,
      module,
      depPointer,
      editor,
      editors,
      ownAssignments,
      depResolver,
      visitedRegions,
      [
        { module, pointer: depPointer, region: editor.regions[depPointer] },
        ...stack,
      ]
    );
  }
}

function discoverIncludedRegionsForNamespace(
  bundle: URL,
  module: Resolution,
  editor: RegionEditor,
  editors: Editor[],
  ownAssignments: BundleAssignment[],
  depResolver: DependencyResolver,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>,
  stack: {
    module: Resolution;
    pointer: RegionPointer;
    region: CodeRegion;
  }[]
) {
  let exports = getExports(module);
  for (let [exportName, { module: sourceModule }] of exports.entries()) {
    let source = depResolver.resolveDeclaration(
      exportName,
      sourceModule,
      module,
      ownAssignments
    );
    if (source.type === "resolved") {
      let sourceModule: Resolution = source.module;
      let pointer: RegionPointer = source.pointer;
      let currentEditor = editor;
      if (sourceModule.url.href !== module.url.href) {
        currentEditor = addNewEditor(sourceModule, editor, editors, bundle);
      }
      discoverIncludedRegions(
        bundle,
        sourceModule,
        pointer,
        currentEditor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions,
        [
          {
            module: sourceModule,
            pointer,
            region: currentEditor.regions[pointer],
          },
          ...stack,
        ]
      );
    } else {
      // we mark the namespace import region as something we want to keep as a
      // signal to the Append nodes to manufacture a namespace object for this
      // import--ultimately, though, we will not include this region.
      let { importedPointer } = source;
      if (importedPointer == null) {
        throw new Error(
          `bug: could not determine code region pointer for import of ${JSON.stringify(
            source.importedAs
          )} from ${source.importedFromModule.url.href} in module ${
            source.consumingModule.url.href
          }`
        );
      }
      if (isNamespaceMarker(source.importedAs)) {
        if (source.consumingModule.url.href !== module.url.href) {
          editor = addNewEditor(
            source.consumingModule,
            editor,
            editors,
            bundle
          );
        }
        if (source.importedPointer == null) {
          throw new Error(
            `unable to determine the region for a namespace import of ${source.importedFromModule.url.href} from the consuming module ${source.consumingModule.url.href} in bundle ${bundle.href}`
          );
        }
        editor.keepRegion(source.importedPointer);
        let newEditor = addNewEditor(
          source.importedFromModule,
          editor,
          editors,
          bundle
        );
        discoverIncludedRegionsForNamespace(
          bundle,
          source.importedFromModule,
          newEditor,
          editors,
          ownAssignments,
          depResolver,
          visitedRegions,
          stack
        );
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        editor.keepRegion(importedPointer);
      }
    }
  }
}

function resolveDependency(
  pkgBundleHref: string,
  depResolver: DependencyResolver,
  consumingModule: ModuleResolution,
  pointer: RegionPointer,
  region: DeclarationCodeRegion,
  editor: RegionEditor,
  editors: Editor[],
  bundle: URL
): {
  isRegionObviated: boolean;
  module: ModuleResolution;
  editor: RegionEditor;
  region: DeclarationCodeRegion;
  pointer: RegionPointer;
  resolution: ResolvedDependency | undefined;
} {
  let resolution: ResolvedDependency | undefined;
  let module: ModuleResolution = consumingModule;
  let pkgURL = pkgInfoFromCatalogJsURL(new URL(pkgBundleHref))?.pkgURL;
  let isRegionObviated = false;
  if (!pkgURL) {
    // not all modules are packages
    return {
      isRegionObviated,
      module,
      editor,
      pointer,
      region,
      resolution,
    };
  }
  resolution = depResolver.resolutionByConsumptionRegion(
    consumingModule,
    pointer,
    pkgURL
  );

  if (!resolution) {
    // not all modules have dep resolutions
    return {
      isRegionObviated,
      module,
      editor,
      pointer,
      region,
      resolution,
    };
  }
  if (
    resolution.consumedBy.url.href !== consumingModule.url.href ||
    resolution.consumedByPointer !== pointer
  ) {
    // region we entered this function with is actually obviated by a
    // different region
    isRegionObviated = true;
    if (
      resolution.type === "declaration" &&
      resolution.importedSource &&
      resolution.importedSource.pointer != null
    ) {
      editor = addNewEditor(
        resolution.importedSource.declaredIn,
        editor,
        editors,
        bundle
      );
      module = resolution.importedSource.declaredIn;
      region = editor.regions[
        resolution.importedSource.pointer
      ] as DeclarationCodeRegion;
      pointer = resolution.importedSource.pointer!;
    } else if (
      resolution.type === "declaration" &&
      resolution.importedSource &&
      resolution.importedSource.pointer != null &&
      isNamespaceMarker(resolution.importedAs)
    ) {
      editor = addNewEditor(
        resolution.importedSource.declaredIn,
        editor,
        editors,
        bundle
      );
      module = resolution.importedSource.declaredIn;
    } else {
      editor = addNewEditor(resolution.consumedBy, editor, editors, bundle);
      module = resolution.consumedBy;
      region = editor.regions[
        resolution.consumedByPointer
      ] as DeclarationCodeRegion;
      pointer = resolution.consumedByPointer;
    }
  }
  return {
    isRegionObviated,
    module,
    editor,
    pointer,
    region,
    resolution,
  };
}

function addNewEditor(
  moduleForNewEditor: Resolution,
  insertBefore: RegionEditor,
  editors: Editor[],
  bundle: URL
): RegionEditor {
  let nonCyclicModule = makeNonCyclic(moduleForNewEditor);
  let newEditor = new RegionEditor(
    nonCyclicModule.source,
    moduleForNewEditor.desc,
    bundle
  );
  let editorIndex = editors.findIndex((e) => e.editor === insertBefore);
  // if the editor before the editor we are inserting before is already an
  // editor for the same module that we need an editor for, then just use that
  // one.
  if (
    editorIndex > 0 &&
    editors[editorIndex - 1].module.url.href === moduleForNewEditor.url.href
  ) {
    return editors[editorIndex - 1].editor;
  }
  editors.splice(
    editors.findIndex((e) => e.editor === insertBefore),
    0,
    {
      module: nonCyclicModule,
      editor: newEditor,
      sideEffectDeclarations: new Set(),
    }
  );
  return newEditor;
}
export function assertDeclarationResolution(
  resolution: ResolvedDependency,
  pkgURL: URL,
  module: Resolution,
  pointer: RegionPointer,
  bundle: URL
): asserts resolution is ResolvedDeclarationDependency {
  if (resolution.type !== "declaration") {
    throw new Error(
      `the dependency resolution for the pkg ${pkgURL.href} consumed in the module ${module.url.href} at region ${pointer} was a "side-effect" type of resolution. Was expecting a "declaration" type of resolution while building bundle ${bundle.href}`
    );
  }
}

// the way we got to this region is unique to a side effect that is part of a
// module declaration
function hasModuleDeclarationWithSideEffectSignature(
  stack: { module: Resolution; pointer: RegionPointer; region: CodeRegion }[]
): boolean {
  let stackSizeAtLeast2Signature =
    stack.length >= 2 &&
    stack[0].module.url.href === stack[1].module.url.href &&
    stack[0].region.dependsOn.has(stack[1].pointer) &&
    stack[1].region.dependsOn.has(stack[0].pointer) &&
    stack[1].region.type === "general" &&
    stack[0].region.type === "declaration" &&
    stack[1].module.desc.regions[documentPointer].dependsOn.has(
      stack[1].pointer
    );
  if (stack.length > 2) {
    return (
      stackSizeAtLeast2Signature &&
      stack[2].module.url.href === stack[0].module.url.href &&
      stack[2].pointer === documentPointer
    );
  } else {
    return stackSizeAtLeast2Signature;
  }
}

export interface ExposedRegionInfo {
  exposedAs: string | undefined;
  pointer: RegionPointer;
  module: Resolution;
}

function exposedRegions(
  bundle: URL,
  bundleAssignments: BundleAssignment[],
  depResolver: DependencyResolver
): ExposedRegionInfo[] {
  let results: ExposedRegionInfo[] = [];
  let ownAssignments = bundleAssignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );
  for (let assignment of ownAssignments) {
    let { module: resolution }: { module: Resolution } = assignment;
    let module = makeNonCyclic(resolution);

    for (let [original, exposed] of assignment.exposedNames) {
      let { module: sourceModule, desc: exportDesc } =
        getExportDesc(module, original) ?? {};
      if (!sourceModule || !exportDesc) {
        throw new Error(
          `cannot determine the module that the export '${original}' originally comes from when evaluating the module ${module.url.href} in the bundle ${bundle.href}`
        );
      }
      let importedFrom = sourceModule;
      if (
        !ownAssignments.find(
          (a) => a.module.url.href === sourceModule!.url.href
        )
      ) {
        // In this scenario the export actually comes from an external bundle
        // via an export-all. we'll deal with this as part of determining the
        // assigned exports in a later step
        continue;
      }

      if (exportDesc.type === "local") {
        let resolution = resolutionForPkgDepDeclaration(
          sourceModule,
          exportDesc.name,
          depResolver
        );
        if (resolution) {
          if (isNamespaceMarker(resolution.importedAs)) {
            throw new Error("unimplemented");
          }
          if (!resolution.importedSource) {
            let exposedInfo = {
              module: resolution.consumedBy,
              exposedAs: exposed,
              pointer: resolution.consumedByPointer,
            };
            if (!hasExposedRegionInfo(exposedInfo, results)) {
              results.push(exposedInfo);
            }
            continue;
          }
          original = resolution.importedAs;
          module = resolution.consumedBy;
          importedFrom = resolution.importedSource.declaredIn;
        }
      }

      let source = depResolver.resolveDeclaration(
        original,
        importedFrom,
        sourceModule,
        ownAssignments
      );
      if (source.type === "resolved") {
        let exposedInfo = {
          module: source.module,
          exposedAs: exposed,
          pointer: source.pointer,
        };
        if (!hasExposedRegionInfo(exposedInfo, results)) {
          results.push(exposedInfo);
        }
      } else {
        if (source.importedPointer == null) {
          throw new Error(
            `bug: don't know which region to expose for '${original}' from module ${source.importedFromModule.url.href} consumed by module ${source.consumingModule.url.href} in bundle ${bundle.href}`
          );
        }
        let exposedInfo = {
          module: source.consumingModule,
          pointer: source.importedPointer,
          exposedAs: exposed,
        };
        if (!hasExposedRegionInfo(exposedInfo, results)) {
          results.push(exposedInfo);
        }
      }
    }

    // add module side effects
    let moduleDependencies = module.desc.regions[documentPointer].dependsOn;
    if (moduleDependencies.size > 0) {
      for (let moduleDependency of moduleDependencies) {
        let exposedInfo = {
          module,
          pointer: moduleDependency,
          exposedAs: undefined,
        };
        if (!hasExposedRegionInfo(exposedInfo, results)) {
          results.push(exposedInfo);
        }
      }
    }
  }

  return results;
}

function hasExposedRegionInfo(
  info: ExposedRegionInfo,
  infos: ExposedRegionInfo[]
): boolean {
  return Boolean(
    infos.find(
      (i) =>
        i.module.url.href === info.module.url.href &&
        i.pointer === info.pointer &&
        i.exposedAs === info.exposedAs
    )
  );
}

class PrepareCombineModulesNode implements BuilderNode {
  cacheKey: PrepareCombineModulesNode;
  constructor(
    private bundle: URL,
    private bundleAssignmentsNode: BundleAssignmentsNode
  ) {
    this.cacheKey = this;
  }

  async deps() {
    return {
      bundleAssignments: this.bundleAssignmentsNode,
    };
  }

  async run({
    bundleAssignments: { assignments, resolutionsInDepOrder },
  }: {
    bundleAssignments: {
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
    };
  }): Promise<
    NextNode<{
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
      lockFile: LockFile | undefined;
    }>
  > {
    return {
      node: new FinishPrepareCombineModulesNode(
        this.bundle,
        assignments,
        resolutionsInDepOrder
      ),
    };
  }
}
class FinishPrepareCombineModulesNode implements BuilderNode {
  // caching is not ideal here--we are relying on the fact that the nodes that
  // this builder node depends on are cached
  cacheKey: FinishPrepareCombineModulesNode;
  private ownAssignments: BundleAssignment[];
  constructor(
    private bundle: URL,
    private assignments: BundleAssignment[],
    private resolutionsInDepOrder: ModuleResolution[]
  ) {
    this.cacheKey = this;
    this.ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );
  }
  async deps() {
    return {
      lockFile: new GetLockFileNode(this.ownAssignments[0].entrypointModuleURL),
    };
  }
  async run({
    lockFile,
  }: {
    lockFile: LockFile | undefined;
  }): Promise<
    Value<{
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
      lockFile: LockFile | undefined;
    }>
  > {
    return {
      value: {
        lockFile,
        assignments: this.assignments,
        resolutionsInDepOrder: this.resolutionsInDepOrder,
      },
    };
  }
}

function visitRegionAndItsChildren(
  pointer: RegionPointer,
  module: Resolution,
  editor: RegionEditor,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>
) {
  let visited = visitedRegions.get(module.url.href);
  if (!visited) {
    visited = new Map();
    visitedRegions.set(module.url.href, visited);
  }
  visited.set(pointer, editor);
  let region = makeNonCyclic(module).desc.regions[pointer];
  if (region.firstChild != null) {
    visitRegionAndItsChildrenAndSiblings(
      region.firstChild,
      module,
      editor,
      visitedRegions
    );
  }
}

function visitRegionAndItsChildrenAndSiblings(
  pointer: RegionPointer,
  module: Resolution,
  editor: RegionEditor,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>
) {
  let visited = visitedRegions.get(module.url.href);
  if (!visited) {
    visited = new Map();
    visitedRegions.set(module.url.href, visited);
  }
  visited.set(pointer, editor);
  let region = makeNonCyclic(module).desc.regions[pointer];
  if (region.firstChild != null) {
    visitRegionAndItsChildrenAndSiblings(
      region.firstChild,
      module,
      editor,
      visitedRegions
    );
  }
  if (region.nextSibling != null) {
    visitRegionAndItsChildrenAndSiblings(
      region.nextSibling,
      module,
      editor,
      visitedRegions
    );
  }
}

function revisitRegionAndItsChildren(
  pointer: RegionPointer,
  module: Resolution,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>
) {
  let visited = visitedRegions.get(module.url.href);
  if (visited) {
    visited.delete(pointer);
  }
  let region = makeNonCyclic(module).desc.regions[pointer];
  if (region.firstChild != null) {
    revisitRegionAndItsChildrenAndSiblings(
      region.firstChild,
      module,
      visitedRegions
    );
  }
}

function revisitRegionAndItsChildrenAndSiblings(
  pointer: RegionPointer,
  module: Resolution,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>
) {
  let visited = visitedRegions.get(module.url.href);
  if (visited) {
    visited.delete(pointer);
  }
  let region = makeNonCyclic(module).desc.regions[pointer];
  if (region.firstChild != null) {
    revisitRegionAndItsChildrenAndSiblings(
      region.firstChild,
      module,
      visitedRegions
    );
  }
  if (region.nextSibling != null) {
    revisitRegionAndItsChildrenAndSiblings(
      region.nextSibling,
      module,
      visitedRegions
    );
  }
}
