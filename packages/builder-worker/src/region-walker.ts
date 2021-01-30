import { flatMap } from "lodash";
import {
  CodeRegion,
  documentPointer,
  isNamespaceMarker,
  NamespaceMarker,
  RegionPointer,
} from "./code-region";
import { RegionEditor } from "./region-editor";
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
import { log, debug } from "./logger";

// A region's identity is denoted as "moduleHref:pointer".
export type RegionGraph = Map<string, Set<string>>;

interface EditorAssignment {
  moduleHref: string;
  editors: Set<string>;
}

export class RegionWalker {
  readonly keptRegions: RegionGraph = new Map();
  private dependenciesOf: RegionGraph = new Map();
  private leaves: Set<string> = new Set();
  private resolvedRegions: Map<string, string> = new Map();
  private seenRegions: Set<string> = new Set();
  private assigner: EditorAssigner;
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
    let walkStart = Date.now();
    // marry up the document regions to the exposed regions in dependency order
    for (let module of ownResolutions) {
      // we walk the exposed API of the module
      for (let pointer of exposed
        .filter(({ module: m }) => m.url.href === module.url.href)
        .map(({ pointer }) => pointer)) {
        this.walk(module, pointer);
      }
    }
    // We also walk the side effects of the entrypoint module since the bundle
    // may not have any exports.
    let [entrypointModule] = ownResolutions.slice(-1);
    for (let pointer of entrypointModule.desc.regions[documentPointer]
      .dependsOn) {
      this.walk(entrypointModule, pointer);
    }

    if (typeof process?.stdout?.write === "function") {
      console.log();
    }
    log(
      `  completed walking ${this.seenRegions.size} code regions in ${
        Date.now() - walkStart
      }ms`
    );
    this.assigner = new EditorAssigner(
      this.dependenciesOf,
      this.leaves,
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
    sideEffectStack: string[] = [],
    originalId = regionId(module, pointer)
  ): string | undefined {
    let id = regionId(module, pointer);
    let region = module.desc.regions[pointer];

    if (this.keptRegions.has(id)) {
      this.resolvedRegions.set(originalId, id);
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
    } else if (this.seenRegions.size % 1000 === 0) {
      debug(
        `  visited ${this.seenRegions.size} regions for bundle ${this.bundle.href}`
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
        let sourceModule = source.module;
        let sourcePointer = source.pointer;
        return this.withSideEffects(
          source.moduleStack[0],
          sideEffectStack,
          (stack) => {
            let innerId = this.walk(
              sourceModule,
              sourcePointer,
              stack,
              originalId
            );
            for (let visitedModule of source.moduleStack.slice(1)) {
              this.withSideEffects(visitedModule, stack, () => undefined);
            }
            return innerId;
          }
        );
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
          let sourceModule = source.resolution.consumedBy;
          let sourcePointer = source.resolution.consumedByPointer;
          return this.withSideEffects(
            source.moduleStack[0],
            sideEffectStack,
            (stack) => {
              let innerId = this.walk(
                sourceModule,
                sourcePointer,
                stack,
                originalId
              );
              for (let visitedModule of source.moduleStack.slice(1)) {
                this.withSideEffects(visitedModule, stack, () => undefined);
              }
              return innerId;
            }
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
          isNamespaceMarker(source.resolution?.name ?? source.importedAs)
        ) {
          // we mark the namespace import region as something we want to keep as a
          // signal to the Append nodes to manufacture a namespace object for this
          // consumed import--ultimately, though, we will not include this region.
          if (importedPointer == null) {
            throw new Error(
              `unable to determine the region for a namespace import '${region.declaration.declaredName}' of ${source.importedFromModule.url.href} from the consuming module ${source.consumingModule.url.href} in bundle ${this.bundle.href}`
            );
          }
          let namespaceMarker = this.visitNamespace(
            source.resolution?.importedSource?.declaredIn ??
              source.importedFromModule,
            sideEffectStack
          );
          this.keepRegion(originalId, id, new Set([namespaceMarker]));
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
          sideEffectStack,
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
        isNamespaceMarker(resolution?.name) &&
        resolution.importedSource?.declaredIn
      ) {
        let namespaceModule = resolution.importedSource.declaredIn;
        return this.withSideEffects(
          resolvedConsumingModule,
          sideEffectStack,
          (stack) => {
            let namespaceMarker = this.visitNamespace(namespaceModule, stack);
            this.keepRegion(originalId, id, new Set([namespaceMarker]));
            return id;
          }
        );
      }

      // In this case the region that we entered our walk with is actually the
      // winning resolution, so we keep this region and continue our journey.
      else {
        return this.withSideEffects(
          resolvedConsumingModule,
          sideEffectStack,
          (stack) => {
            let deps: Set<string> = this.walkDeps(
              resolvedConsumingModule,
              region,
              stack
            );
            this.keepRegion(originalId, id, deps);
            return id;
          }
        );
      }
    }

    // consider "import" regions (which can include reexports as well as imports
    // for pure side effects)
    else if (region.type === "import" && !region.isDynamic) {
      let importedModule = makeNonCyclic(module).resolvedImports[
        region.importIndex
      ];
      if (this.moduleInOurBundle(importedModule)) {
        // consider a namespace reexport from an entrypoint module, which in
        // turn is a bundle export. normally reexports do not effect the
        // module scope. however namespace reexports do require us to fabricate
        // a namespace object in the module scope. For namespace reexports,
        // generally the declaration resolution will guide our "walk" such that
        // the namespace markers are included as kept regions. However, in this
        // case, because module scope is skipped entirely, we need to handle it
        // specially.
        if (region.exportType === "reexport") {
          let exportDesc = [...module.desc.exports.values()].find(
            (desc) => desc.type === "reexport" && desc.exportRegion === pointer
          );
          if (!exportDesc || exportDesc.type !== "reexport") {
            throw new Error(
              `cannot identify export description for the reexport region ${pointer} in module ${module.url.href} when making bundle ${this.bundle.href}`
            );
          }
          if (isNamespaceMarker(exportDesc.name)) {
            return this.withSideEffects(module, sideEffectStack, (stack) => {
              let namespaceMarker = this.visitNamespace(importedModule, stack);
              this.keepRegion(originalId, id, new Set([namespaceMarker]));
              return id;
            });
          }
        }

        // This is an import for side-effects only.
        return this.withSideEffects(
          importedModule,
          sideEffectStack,
          () => undefined
        );
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        this.keepRegion(originalId, id, new Set());
        return id;
      }
    }

    // Finally we are ready to walk through our dependencies, importantly
    // marking them as kept before we mark the region in question as kept, and
    // recording our deps as regions that we indeed depend upon as part of our
    // walk.
    else {
      return this.withSideEffects(module, sideEffectStack, (stack) => {
        let deps = this.walkDeps(module, region, stack);
        this.keepRegion(originalId, id, deps);
        return id;
      });
    }
  }

  private walkDeps(
    module: Resolution,
    region: CodeRegion,
    sideEffectStack: string[]
  ): Set<string> {
    let deps: Set<string> = new Set();
    for (let depId of orderDependencies(region.dependsOn, module)) {
      let resolvedDepId = this.walk(module, depId, sideEffectStack);
      if (resolvedDepId != null) {
        deps.add(resolvedDepId);
      }
    }
    return deps;
  }

  private visitNamespace(
    module: Resolution,
    sideEffectStack: string[]
  ): string {
    let exports = getExports(module);
    let namespaceItemIds: string[] = [];
    return this.withSideEffects(module, sideEffectStack, (stack) => {
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
          let itemId = this.withSideEffects(
            source.moduleStack[0],
            stack,
            (s) => {
              let id = this.walk(sourceModule, pointer, s);
              for (let visitedModule of source.moduleStack.slice(1)) {
                this.withSideEffects(visitedModule, s, () => undefined);
              }
              return id;
            }
          );
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
            let namespaceImport = regionId(
              source.consumingModule,
              source.importedPointer
            );
            let namespaceMarker = this.visitNamespace(
              source.importedFromModule,
              stack
            );
            this.keepRegion(
              namespaceImport,
              namespaceImport,
              new Set([namespaceMarker])
            );
            namespaceItemIds.push(namespaceImport);
          } else {
            let itemId = regionId(module, importedPointer);
            this.keepRegion(itemId, itemId, new Set());
            namespaceItemIds.push(itemId);
          }
        }
      }

      let namespaceMarker = regionId(module, NamespaceMarker);
      this.keepRegion(
        namespaceMarker,
        namespaceMarker,
        new Set(namespaceItemIds)
      );
      return namespaceMarker;
    })!;
  }

  private withSideEffects(
    module: Resolution,
    sideEffectStack: string[],
    walk: (sideEffectStack: string[]) => string | undefined
  ): string | undefined {
    if (sideEffectStack.includes(module.url.href)) {
      // we are already in the midsts of processing side effects for this
      // module, so just do the walk
      return walk(sideEffectStack);
    }

    let regions = module.desc.regions;
    let sideEffects = regions[documentPointer].dependsOn;
    let newStack = [module.url.href, ...sideEffectStack];
    for (let sideEffect of sideEffects) {
      if (regions[sideEffect].type !== "declaration") {
        this.walk(module, sideEffect, newStack);
      }
    }

    let result = walk(newStack);

    // walk the side-effectful declarations last so that we can step through the
    // declaration in its natural order if it is consumed in our walk.

    // I'm thinking that is this probably not going to be sufficient as-is. I
    // could almost see doing a 2 pass walk. The first pass is to derive all the
    // resolutions and understand what resolved regions consume what, and a 2nd
    // pass to actually perform the walk, where side effects that are consume
    // the region that actually brought you to the module actually go last
    // here... I'll let the next issue we find in this area drive this work so
    // we have a solid scenario to test against.
    for (let sideEffect of sideEffects) {
      if (regions[sideEffect].type === "declaration") {
        this.walk(module, sideEffect, newStack);
      }
    }
    return result;
  }

  private keepRegion(
    originalId: string,
    resolvedId: string,
    deps: Set<string>
  ) {
    // document regions are inherently retained.
    if (idParts(resolvedId).pointer === documentPointer) {
      return;
    }
    this.keptRegions.set(resolvedId, deps);
    this.resolvedRegions.set(originalId, resolvedId);
    if (deps.size === 0) {
      this.leaves.add(resolvedId);
    } else {
      this.leaves.delete(resolvedId);
    }
    for (let dep of deps) {
      let consumers = this.dependenciesOf.get(dep);
      if (!consumers) {
        consumers = new Set();
        this.dependenciesOf.set(dep, consumers);
      }
      consumers.add(resolvedId);
    }
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
        isNamespaceMarker(resolution.name)
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
  private exposedIds: string[];
  constructor(
    private dependenciesOf: RegionGraph,
    leaves: Set<string>,
    private ownAssignments: BundleAssignment[],
    resolutionsInDepOrder: ModuleResolution[],
    private bundle: URL,
    exposed: ExposedRegionInfo[]
  ) {
    this.exposedIds = exposed.map(({ module: m, pointer: p }) =>
      regionId(m, p)
    );

    let leavesInDepOrder: string[] = [];
    for (let module of resolutionsInDepOrder) {
      let moduleLeaves = [...leaves].filter(
        (leaf) => idParts(leaf).moduleHref === module.url.href
      );
      leavesInDepOrder.push(...moduleLeaves);
    }
    let assignStart = Date.now();
    for (let leaf of leavesInDepOrder.reverse()) {
      this.assignEditor(leaf);
    }
    log(`  completed editor assignment in ${Date.now() - assignStart}ms`);

    for (let [regionId, { editors: editors }] of this.assignmentMap) {
      let { pointer } = idParts(regionId);
      if (isNamespaceMarker(pointer)) {
        // the namespace marker is just a grouping mechanism that allows the
        // constituent namespace items to be co-located in the same
        // editor--there is nothing to write out here.
        continue;
      }
      for (let editorId of editors) {
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
          };
          this.editorMap.set(editorId, item);
        }
        let { editor } = item;
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

    let { moduleHref, pointer } = idParts(id);

    let consumers = [...(this.dependenciesOf.get(id) ?? [])].map(
      (consumer) => ({
        moduleHref: idParts(consumer).moduleHref,
        assignment: this.assignEditor(consumer),
      })
    );

    // base case: region has no regions that depend on it--its an exposed region
    if (this.exposedIds.includes(id)) {
      let assignment: EditorAssignment = {
        moduleHref,
        // we name our editors after the ID of the initial region it encloses
        editors: new Set([id]),
      };
      this.assignmentMap.set(id, assignment);
      return assignment;
    }

    // test the regions that depend on us to see if it can use the same editor
    let declarationAssignment: EditorAssignment | undefined;
    let hasDeclarators = Boolean(
      getRegionFromId(id, this.ownAssignments).module.desc.regions.find(
        (r) =>
          r.type === "declaration" &&
          r.declaration.type === "local" &&
          r.declaration.declaratorOfRegion === pointer
      )
    );
    // we only merge into consumers that are in our module and all share the
    // same editor, unless we have declarators--in that case all our consumers
    // need us to merge into them regardless
    if (
      consumers.every(
        (c) =>
          c.moduleHref === moduleHref &&
          [...c.assignment.editors][0] ===
            [...consumers[0].assignment.editors][0]
      ) ||
      hasDeclarators
    ) {
      let namespaceMarkerConsumer = consumers.find((c) =>
        c.assignment.editors.has(regionId(moduleHref, NamespaceMarker))
      );
      // favor merging into a namespace marker consumer
      for (let consumer of new Set([
        ...(namespaceMarkerConsumer ? [namespaceMarkerConsumer] : []),
        ...consumers,
      ])) {
        // we can merge with this consumer
        if (!hasDeclarators) {
          let assignment: EditorAssignment = {
            moduleHref,
            editors: consumer.assignment.editors,
          };
          this.assignmentMap.set(id, assignment);
          return assignment;
        }
        // We can't separate a declaration from a declarator, so we merge
        // declarations for declarators into _all_ of their consumer's editors
        if (!declarationAssignment) {
          declarationAssignment = {
            moduleHref,
            editors: new Set([...consumer.assignment.editors]),
          };
        } else {
          for (let editor of consumer.assignment.editors) {
            declarationAssignment.editors.add(editor);
          }
        }
      }
      if (hasDeclarators && declarationAssignment) {
        this.assignmentMap.set(id, declarationAssignment);
        return declarationAssignment;
      }
    }

    // we need to have our own editor
    let assignment: EditorAssignment = {
      moduleHref,
      editors: new Set([id]),
    };
    this.assignmentMap.set(id, assignment);
    return assignment;
  }

  private pruneEditors() {
    for (let [editorId, { editor }] of this.editorMap) {
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
        for (let [mergedId] of rest) {
          this.editorMap.delete(mergedId);
        }
      }
    }

    for (let { editor } of this.editorMap.values()) {
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
    }
  }
}

function regionId(
  module: Resolution | string,
  pointer: RegionPointer | NamespaceMarker
) {
  let _pointer = isNamespaceMarker(pointer) ? -1 : pointer;
  if (typeof module === "string") {
    return `${module}:${_pointer}`;
  }
  return `${module.url.href}:${_pointer}`;
}

function idParts(
  regionId: string
): { moduleHref: string; pointer: RegionPointer | NamespaceMarker } {
  let index = regionId.lastIndexOf(":");
  let moduleHref = regionId.slice(0, index);
  let pointer = parseInt(regionId.slice(index + 1)) as RegionPointer;
  if (pointer === -1) {
    return { moduleHref, pointer: NamespaceMarker };
  }
  return { moduleHref, pointer };
}

function getRegionFromId(
  regionId: string,
  ownAssignments: BundleAssignment[]
): {
  module: ModuleResolution;
  pointer: RegionPointer | NamespaceMarker;
  region: CodeRegion | undefined;
} {
  let { moduleHref, pointer } = idParts(regionId);
  let module = ownAssignments.find(({ module: m }) => m.url.href === moduleHref)
    ?.module;
  if (!module) {
    throw new Error(
      `cannot resolve regionId ${regionId}, unable to resolve the module ${moduleHref} to an assigned module for the bundle ${ownAssignments[0].bundleURL}`
    );
  }
  if (isNamespaceMarker(pointer)) {
    return { module, pointer, region: undefined };
  }

  return { module, pointer, region: module.desc.regions[pointer] };
}

function orderDependencies(
  deps: Set<RegionPointer>,
  module: Resolution
): RegionPointer[] {
  let regions = module.desc.regions;
  const aFirst = -1,
    bFirst = 1,
    same = 0;
  let sortedDeps = [...deps].sort((a, b) => {
    let typeA = regions[a].type;
    let typeB = regions[b].type;
    if (typeA === "reference" && typeB === "reference") {
      let declA = regions[[...regions[a].dependsOn][0]];
      let declB = regions[[...regions[b].dependsOn][0]];
      if (declA.type === "declaration" && declB.type === "declaration") {
        // references to local declarations go first
        if (
          declA.declaration.type === "import" &&
          declB.declaration.type === "local"
        ) {
          return bFirst;
        }
        if (
          declA.declaration.type === "local" &&
          declB.declaration.type === "import"
        ) {
          return aFirst;
        }
        // otherwise sort by import position (importIndex) in desc order
        if (
          declA.declaration.type === "import" &&
          declB.declaration.type === "import"
        ) {
          return declB.declaration.importIndex - declA.declaration.importIndex;
        }
      }
    }
    return same;
  });
  return sortedDeps;
}
