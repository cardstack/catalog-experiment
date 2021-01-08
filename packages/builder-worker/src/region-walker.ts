import { difference, flatMap } from "lodash";
import {
  documentPointer,
  isNamespaceMarker,
  RegionEditor,
  RegionPointer,
} from "./code-region";
import {
  DependencyResolver,
  ResolvedDependency,
} from "./dependency-resolution";
import { getExports } from "./describe-file";
import { Editor } from "./module-rewriter";
import { BundleAssignment } from "./nodes/bundle";
import { ExposedRegionInfo } from "./nodes/combine-modules";
import {
  makeNonCyclic,
  ModuleResolution,
  Resolution,
} from "./nodes/resolution";
import { pkgInfoFromCatalogJsURL } from "./resolver";

// A region's identity is denoted as "moduleHref:pointer".
export type RegionGraph = Map<string, Set<string>>;

interface EditorAssignment {
  moduleHref: string;
  enclosingEditors: Set<string>;
}

export class RegionWalker {
  readonly keptRegions: RegionGraph = new Map();
  private resolvedRegions: Map<string, string> = new Map();
  private seenRegions: Set<string> = new Set();
  private assigner: EditorAssigner;
  private declarationsWithSideEffects: Set<string> = new Set();
  constructor(
    exposed: ExposedRegionInfo[],
    private bundle: URL,
    private ownAssignments: BundleAssignment[],
    resolutionsInDepOrder: ModuleResolution[],
    private depResolver: DependencyResolver
  ) {
    let ownResolutions = resolutionsInDepOrder.filter((m) =>
      ownAssignments.find(({ module }) => module.url.href === m.url.href)
    );
    // marry up the document regions to the exposed regions in dependency order
    for (let module of ownResolutions) {
      // walks all the module side effects
      this.walk(module, documentPointer);

      // walks the exposed API of the module
      for (let pointer of exposed
        .filter(({ module: m }) => m.url.href === module.url.href)
        .map(({ pointer }) => pointer)) {
        this.walk(module, pointer);
      }
    }
    if (typeof process?.stdout?.write === "function") {
      console.log();
    }
    this.assigner = new EditorAssigner(
      this.keptRegions,
      this.declarationsWithSideEffects,
      this.ownAssignments,
      ownResolutions,
      this.bundle,
      exposed
    );
  }

  get editors(): Editor[] {
    return this.assigner.editors;
  }

  private walk(
    module: Resolution,
    pointer: RegionPointer,
    originalId = regionId(module, pointer)
  ): string | undefined {
    let id = regionId(module, pointer);
    let region = module.desc.regions[pointer];

    if (this.keptRegions.has(id)) {
      return id;
    }
    if (this.seenRegions.has(id)) {
      return this.resolvedRegions.get(id);
    }

    this.seenRegions.add(id);
    if (typeof process?.stdout?.write === "function") {
      process.stdout.write(
        `  visited ${this.seenRegions.size} regions for bundle ${this.bundle.href}\r`
      );
    }

    // consider a side effect that comes from a rolled-up package. If the
    // package that this side effect comes from is actually not the "winning"
    // version of this package, then we skip this region. The "winning" pkg
    // version should be responsible for all the side effects related to the
    // resolved package version.
    if (region.original) {
      let pkgURL = pkgInfoFromCatalogJsURL(new URL(region.original.bundleHref))
        ?.pkgURL;
      if (!pkgURL) {
        throw new Error(
          `Cannot determine pkgURL that corresponds to the bundle URL: ${region.original.bundleHref}`
        );
      }
      let resolution = this.depResolver.resolutionByConsumptionRegion(
        module,
        pointer,
        pkgURL
      );

      // another version of this pkg is responsible for the side effects, not this version
      if (!resolution) {
        return;
      }
    }

    // consider a region that is an import declaration. First resolve the source
    // of the import, which might be a local declaration, a namespace import, an
    // external bundle or a pkg dependency resolution for this consumption point
    // (that in turn could be any of the former items).
    if (region.type === "declaration" && region.declaration.type === "import") {
      let localDesc = region.declaration;
      let importedModule = makeNonCyclic(module).resolvedImports[
        localDesc.importIndex
      ];
      let importedName = localDesc.importedName;
      let source = this.depResolver.resolveDeclaration(
        importedName,
        importedModule,
        module,
        this.ownAssignments
      );
      if (source.type === "resolved") {
        return this.walk(source.module, source.pointer, originalId);
      } else {
        // declarations that are "unresolved" are either namespace imports
        // (internal or external) or external imports
        if (
          source.resolution &&
          source.resolution.type === "declaration" &&
          !source.resolution.importedSource
        ) {
          // This is the scenario where the resolution resolves to an
          // already fashioned namespace object declaration
          return this.walk(
            source.resolution.consumedBy,
            source.resolution.consumedByPointer,
            originalId
          );
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
        // the region we want to memorialize for this step in our "walk" might
        // be different than the region that we entered this method with due to
        // how the declaration was resolved.
        id = regionId(consumingModule, importedPointer);
        if (
          this.moduleInOurBundle(source.importedFromModule) &&
          isNamespaceMarker(source.resolution?.importedAs ?? source.importedAs)
        ) {
          // we mark the namespace import region as something we want to keep as a
          // signal to the Append nodes to manufacture a namespace object for this
          // consumed import--ultimately, though, we will not include this region.
          if (importedPointer == null) {
            throw new Error(
              `unable to determine the region for a namespace import '${region.declaration.declaredName}' of ${source.importedFromModule.url.href} from the consuming module ${source.consumingModule.url.href} in bundle ${this.bundle.href}`
            );
          }
          let items = this.visitNamespace(
            source.resolution?.importedSource?.declaredIn ??
              source.importedFromModule
          );
          this.keepRegion(originalId, id, new Set(items));
          return id;
        } else {
          // we mark the external bundle import region as something we want to keep
          // as a signal to the Append nodes that this import is consumed and to
          // include this region in the resulting bundle.
          this.keepRegion(originalId, id, new Set());
          return id;
        }
      }
    }

    // consider a region that is a local declaration that we know has a pkg
    // dependency resolution, in which case it may or may not actually be
    // selected as the "winning" pkg version (our pkg resolution will tell us
    // where to go next on our "walk").
    else if (
      region.type === "declaration" &&
      region.declaration.type === "local" &&
      region.declaration.original
    ) {
      let pkgBundleHref = region.declaration.original.bundleHref;
      let {
        resolvedConsumingModule,
        resolvedConsumingPointer,
        resolution,
        isRegionObviated,
      } = this.resolvePkgDependency(pkgBundleHref, module, pointer) ?? {};
      // the region we want to memorialize for this step in our "walk" is
      // probably different than the region that we entered this method with
      // due to how the declaration was resolved.
      id = regionId(resolvedConsumingModule, resolvedConsumingPointer);

      if (isRegionObviated) {
        return this.walk(
          resolvedConsumingModule,
          resolvedConsumingPointer,
          originalId
        );
      }

      // in this case we are replacing a local namespace object declaration with
      // a namespace import (because it's resolution won), meaning that we'll
      // re-derive the namespace object. In order to do that we keep the
      // namespace import, which is our signal to the downstream processes that
      // we want a namespace object manufactured here.
      else if (
        resolution?.type === "declaration" &&
        isNamespaceMarker(resolution?.importedAs) &&
        resolution.importedSource?.declaredIn
      ) {
        let items = this.visitNamespace(resolution.importedSource.declaredIn);
        this.keepRegion(originalId, id, new Set(items));
        return id;
      }

      // In this case the region that we entered our walk with is actually the
      // winning resolution, so we keep this region and continue our journey.
      else {
        let deps: Set<string> = new Set();
        for (let depId of region.dependsOn) {
          let resolvedDepId = this.walk(module, depId);
          if (resolvedDepId != null) {
            deps.add(resolvedDepId);
          }
        }
        this.keepRegion(originalId, id, deps);
        return id;
      }
    }

    // This is an import for side-effects only.
    else if (region.type === "import" && !region.isDynamic) {
      let importedModule = makeNonCyclic(module).resolvedImports[
        region.importIndex
      ];
      if (this.moduleInOurBundle(importedModule)) {
        return this.walk(importedModule, documentPointer, originalId);
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        this.keepRegion(originalId, id, new Set());
        return id;
      }
    }

    // This is a plain jane region that has no pkg resolutions that we just want
    // to keep, and continue our journey for its deps
    else {
      let deps: Set<string> = new Set();
      for (let depId of region.dependsOn) {
        let resolvedDepId = this.walk(module, depId);
        if (resolvedDepId != null) {
          deps.add(resolvedDepId);
        }
      }
      this.keepRegion(originalId, id, deps);
      if (this.isDeclarationWithSideEffect(id)) {
        this.declarationsWithSideEffects.add(id);
      }
      return id;
    }
  }

  private visitNamespace(module: Resolution): string[] {
    let exports = getExports(module);
    let namespaceItemIds: string[] = [];
    for (let [exportName, { module: sourceModule }] of exports.entries()) {
      let source = this.depResolver.resolveDeclaration(
        exportName,
        sourceModule,
        module,
        this.ownAssignments
      );

      // this is the scenario where we were able to resolve the namespace item
      // to a local declaration
      if (source.type === "resolved") {
        let sourceModule: Resolution = source.module;
        let pointer: RegionPointer = source.pointer;
        let itemId = this.walk(sourceModule, pointer);
        if (itemId) {
          namespaceItemIds.push(itemId);
        }
      }

      // in this case the namespace item is either a nested namespace import or
      // comes from an external bundle.
      else {
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
        // we mark the namespace import region as something we want to keep as a
        // signal to the Append nodes to manufacture a namespace object for this
        // import--ultimately, though, we will not include this region.
        if (isNamespaceMarker(source.importedAs)) {
          if (source.importedPointer == null) {
            throw new Error(
              `unable to determine the region for a namespace import of ${source.importedFromModule.url.href} from the consuming module ${source.consumingModule.url.href} in bundle ${this.bundle.href}`
            );
          }
          let itemId = regionId(source.consumingModule, source.importedPointer);
          let items = this.visitNamespace(source.importedFromModule);
          this.keepRegion(itemId, itemId, new Set(items));
          namespaceItemIds.push(itemId);
        } else {
          let itemId = regionId(module, importedPointer);
          this.keepRegion(itemId, itemId, new Set());
          namespaceItemIds.push(itemId);
        }
      }
    }

    return namespaceItemIds;
  }

  private keepRegion(
    originalId: string,
    resolvedId: string,
    deps: Set<string>
  ) {
    this.keptRegions.set(resolvedId, deps);
    this.resolvedRegions.set(originalId, resolvedId);
  }

  private isDeclarationWithSideEffect(id: string): boolean {
    let { module, pointer } = getRegionFromId(id, this.ownAssignments);
    let region = module.desc.regions[pointer];
    if (region.type !== "declaration" || region.declaration.type !== "local") {
      return false;
    }
    return module.desc.regions[documentPointer].dependsOn.has(pointer);
  }

  private resolvePkgDependency(
    pkgBundleHref: string,
    consumingModule: Resolution,
    pointer: RegionPointer
  ): {
    isRegionObviated: boolean;
    resolvedConsumingModule: Resolution;
    resolvedConsumingPointer: RegionPointer;
    resolution: ResolvedDependency | undefined;
  } {
    let resolution: ResolvedDependency | undefined;
    let resolvedConsumingModule: Resolution = consumingModule;
    let resolvedConsumingPointer = pointer;
    let pkgURL = pkgInfoFromCatalogJsURL(new URL(pkgBundleHref))?.pkgURL;
    let isRegionObviated = false;
    if (!pkgURL) {
      // not all modules are packages
      return {
        isRegionObviated,
        resolvedConsumingModule,
        resolvedConsumingPointer,
        resolution,
      };
    }
    resolution = this.depResolver.resolutionByConsumptionRegion(
      consumingModule,
      pointer,
      pkgURL
    );

    if (!resolution) {
      // not all modules have dep resolutions
      return {
        isRegionObviated,
        resolvedConsumingModule,
        resolvedConsumingPointer,
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
        resolvedConsumingModule = resolution.importedSource.declaredIn;
        resolvedConsumingPointer = resolution.importedSource.pointer!;
      } else if (
        resolution.type === "declaration" &&
        resolution.importedSource &&
        resolution.importedSource.pointer != null &&
        isNamespaceMarker(resolution.importedAs)
      ) {
        resolvedConsumingModule = resolution.importedSource.declaredIn;
      } else {
        resolvedConsumingModule = resolution.consumedBy;
        resolvedConsumingPointer = resolution.consumedByPointer;
      }
    }
    return {
      isRegionObviated,
      resolvedConsumingModule,
      resolvedConsumingPointer,
      resolution,
    };
  }

  private moduleInOurBundle(module: Resolution): boolean {
    return Boolean(
      this.ownAssignments.find((a) => a.module.url.href === module.url.href)
    );
  }
}

class EditorAssigner {
  private assignmentMap: Map<string, EditorAssignment> = new Map();
  private editorMap: Map<string, Editor> = new Map();
  private dependenciesOf: RegionGraph;
  private exposedIds: string[];
  constructor(
    private keptRegions: RegionGraph,
    private declarationsWithSideEffects: Set<string>,
    private ownAssignments: BundleAssignment[],
    resolutionsInDepOrder: ModuleResolution[],
    private bundle: URL,
    exposed: ExposedRegionInfo[]
  ) {
    this.exposedIds = [];
    // marry up the document regions to the exposed regions in dependency order
    for (let module of resolutionsInDepOrder) {
      let modulesExposedRegions = exposed.filter(
        ({ module: m }) => m.url.href === module.url.href
      );
      this.exposedIds.push(
        regionId(module, documentPointer),
        ...modulesExposedRegions.map(({ module: m, pointer: p }) =>
          regionId(m, p)
        )
      );
    }
    if (typeof process?.stdout?.write === "function") {
      console.log(`  inverting code regions for bundle ${this.bundle.href}`);
    }
    let { dependenciesOf, leaves } = this.invertCodeRegions(this.exposedIds);
    this.dependenciesOf = dependenciesOf;

    let leavesInDepOrder: string[] = [];
    for (let module of resolutionsInDepOrder) {
      let moduleLeaves = [...leaves].filter(
        (leaf) => idParts(leaf).moduleHref === module.url.href
      );
      leavesInDepOrder.push(...moduleLeaves);
    }
    for (let leaf of leavesInDepOrder.reverse()) {
      this.assignEditor(leaf);
    }

    for (let [regionId, { enclosingEditors }] of this.assignmentMap) {
      let { pointer } = idParts(regionId);
      for (let editorId of enclosingEditors) {
        let item = this.editorMap.get(editorId);
        if (!item) {
          let { module } = getRegionFromId(regionId, this.ownAssignments);
          let editor = new RegionEditor(
            module.source,
            module.desc,
            this.bundle
          );
          item = {
            editor,
            module,
            sideEffectDeclarations: new Set(),
          };
          this.editorMap.set(editorId, item);
        }
        let { editor } = item;
        if (this.declarationsWithSideEffects.has(regionId)) {
          item.sideEffectDeclarations.add(idParts(regionId).pointer);
        }
        editor.keepRegion(pointer);
      }
    }

    this.pruneEditors();
  }

  get editors(): Editor[] {
    // these editors are organized in consumer-first order because we recurse
    // from the leafs to the entrypoints, and then start doing editor assignment
    // on the exit of the recursion. We reverse it so that we can serialize
    // the dependencies first
    return [...this.editorMap.values()].reverse();
  }

  private assignEditor(id: string): EditorAssignment {
    let alreadyAssigned = this.assignmentMap.get(id);
    if (alreadyAssigned) {
      return alreadyAssigned;
    }

    let { moduleHref } = idParts(id);

    let dependers = [...(this.dependenciesOf.get(id) ?? [])].map(
      (depender) => ({
        moduleHref: idParts(depender).moduleHref,
        assignment: this.assignEditor(depender),
      })
    );

    // base case: region has no regions that depend on it--its an exposed region
    if (this.exposedIds.includes(id)) {
      let assignment: EditorAssignment = {
        moduleHref,
        // we name our editors after the ID of the initial region it encloses
        enclosingEditors: new Set([id]),
      };
      this.assignmentMap.set(id, assignment);
      return assignment;
    }

    // test the regions that depend on us to see if it can use the same editor
    for (let depender of dependers) {
      if (
        !depender.assignment.enclosingEditors.has(
          regionId(moduleHref, documentPointer)
        ) &&
        depender.moduleHref === moduleHref &&
        dependers.every(
          (otherDepender) => otherDepender.moduleHref === depender.moduleHref
        )
      ) {
        // we can merge with this consumer
        let assignment: EditorAssignment = {
          moduleHref,
          enclosingEditors: depender.assignment.enclosingEditors,
        };
        this.assignmentMap.set(id, assignment);
        return assignment;
      }
    }

    // we need to have our own editor
    let assignment: EditorAssignment = {
      moduleHref,
      enclosingEditors: new Set([id]),
    };
    this.assignmentMap.set(id, assignment);
    return assignment;
  }

  private pruneEditors() {
    for (let [editorId, { editor }] of this.editorMap) {
      // remove declaration regions that have no more declarator regions
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

      // filter out editors that have only retained solely their document regions,
      // these are no-ops
      if (
        editor
          .includedRegions()
          .every((p) => editor.regions[p].type === "document")
      ) {
        this.editorMap.delete(editorId);
      }
    }

    // collapse contiguous editors
    let merges = [...this.editorMap].reduce((merges, item, index, source) => {
      let [editorId] = item;
      if (index === 0) {
        merges.push([item]);
      } else {
        let [previousEditorId] = source[index - 1];
        let { moduleHref: previousModuleHref } = idParts(previousEditorId);
        let { moduleHref } = idParts(editorId);
        if (moduleHref === previousModuleHref) {
          merges[merges.length - 1].push(item);
        } else {
          merges.push([item]);
        }
      }
      return merges;
    }, [] as [string, Editor][][]);

    for (let [[, item], ...rest] of merges) {
      let { editor } = item;
      if (rest.length > 0) {
        editor.mergeWith(...rest.map(([, { editor }]) => editor));
        item.sideEffectDeclarations = new Set([
          ...item.sideEffectDeclarations,
          ...flatMap(rest, ([, e]) => [...e.sideEffectDeclarations]),
        ]);
        for (let [mergedId] of rest) {
          this.editorMap.delete(mergedId);
        }
      }
    }
  }

  private invertCodeRegions(
    regionIds: string[],
    dependenciesOf: RegionGraph = new Map(),
    leaves: Set<string> = new Set(),
    seen: Set<string> = new Set()
  ): { dependenciesOf: RegionGraph; leaves: Set<string> } {
    for (let depender of regionIds) {
      seen.add(depender);
    }
    for (let depender of regionIds) {
      let dependsOn = [...(this.keptRegions.get(depender) ?? [])];
      if (dependsOn.length > 0) {
        this.invertCodeRegions(
          difference(dependsOn, [...seen]),
          dependenciesOf,
          leaves,
          seen
        );
        // since we are handling this on the exit of the recursion, all your deps
        // will have entries in the identity map
        for (let depId of dependsOn) {
          setDependenciesOf(depId, depender, dependenciesOf);
        }
      } else {
        leaves.add(depender);
      }
    }
    return { dependenciesOf, leaves };
  }
}

function setDependenciesOf(
  dependsOn: string,
  depender: string,
  dependenciesOf: RegionGraph
) {
  if (!dependenciesOf.has(dependsOn)) {
    dependenciesOf.set(dependsOn, new Set());
  }
  dependenciesOf.get(dependsOn)!.add(depender);
}

function regionId(module: Resolution | string, pointer: RegionPointer) {
  if (typeof module === "string") {
    return `${module}:${pointer}`;
  }
  return `${module.url.href}:${pointer}`;
}

function idParts(
  regionId: string
): { moduleHref: string; pointer: RegionPointer } {
  let index = regionId.lastIndexOf(":");
  let moduleHref = regionId.slice(0, index);
  let pointer = parseInt(regionId.slice(index + 1)) as RegionPointer;
  return { moduleHref, pointer };
}

function getRegionFromId(
  regionId: string,
  ownAssignments: BundleAssignment[]
): { module: ModuleResolution; pointer: RegionPointer } {
  let { moduleHref, pointer } = idParts(regionId);
  let module = ownAssignments.find(({ module: m }) => m.url.href === moduleHref)
    ?.module;
  if (!module) {
    throw new Error(
      `cannot resolve regionId ${regionId}, unable to resolve the module ${moduleHref} to an assigned module for the bundle ${ownAssignments[0].bundleURL}`
    );
  }

  return { module, pointer };
}
