import { flatMap } from "lodash";
import {
  documentPointer,
  isNamespaceMarker,
  RegionEditor,
  RegionPointer,
  visitCodeRegions,
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
  readonly seenRegions: Set<string> = new Set();
  private assigner: EditorAssigner;
  constructor(
    exposed: ExposedRegionInfo[],
    private bundle: URL,
    private ownAssignments: BundleAssignment[],
    resolutionsInDepOrder: ModuleResolution[],
    private depResolver: DependencyResolver
  ) {
    // marry up the document regions to the exposed regions in dependency order
    for (let module of resolutionsInDepOrder) {
      // walks all the module side effects
      this.walk(module, documentPointer);

      // walks the exposed API of the module
      for (let pointer of exposed
        .filter(({ module: m }) => m.url.href === module.url.href)
        .map(({ pointer }) => pointer)) {
        this.walk(module, pointer);
      }
    }
    this.assigner = new EditorAssigner(
      this.keptRegions,
      this.ownAssignments,
      resolutionsInDepOrder,
      this.bundle,
      exposed
    );
  }

  get editors(): Editor[] {
    return this.assigner.editors;
  }

  private walk(module: Resolution, pointer: RegionPointer): string | undefined {
    let id = regionId(module, pointer);
    let region = module.desc.regions[pointer];

    if (this.seenRegions.has(id) || this.keptRegions.has(id)) {
      return;
    }

    this.seenRegions.add(id);

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
        // check to see if there is a declaration that uses this side effect (we
        // don't want to handle those here).
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
              ? this.depResolver.resolutionByConsumptionRegion(
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
          this.backOff(module, pointer);
          return;
        }
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
        return this.walk(source.module, source.pointer);
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
            source.resolution.consumedByPointer
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
        // the region we want to memorialize for this step in our "walk" is
        // probably different than the region that we entered this method with
        // due to how the declaration was resolved.
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
          this.keptRegions.set(id, new Set());
          let items = this.visitNamespace(
            source.resolution?.importedSource?.declaredIn ??
              source.importedFromModule
          );
          for (let item in items) {
            this.keptRegions.get(id)!.add(item);
          }
          return id;
        } else {
          // we mark the external bundle import region as something we want to keep
          // as a signal to the Append nodes that this import is consumed and to
          // include this region in the resulting bundle.
          this.keptRegions.set(id, new Set());
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

      // we may have already walked over side effects for this region before
      // we walked over the declaration--in that case we want to "unwalk" this
      // region and all of its children, since the "winning" resolution will
      // be responsible for this declaration and any side effects it was
      if (isRegionObviated) {
        this.backOff(module, pointer);
        return this.walk(resolvedConsumingModule, resolvedConsumingPointer);
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
        this.keptRegions.set(id, new Set());
        let items = this.visitNamespace(resolution.importedSource.declaredIn);
        for (let item in items) {
          this.keptRegions.get(id)!.add(item);
        }
        return id;
      }

      // In this case the region that we entered our walk with is actually the
      // winning resolution, so we keep this region and continue our journey.
      else {
        this.keptRegions.set(id, new Set());
        for (let depId of region.dependsOn) {
          let resolvedDepId = this.walk(module, depId);
          if (resolvedDepId != null) {
            this.keptRegions.get(id)!.add(resolvedDepId);
          }
        }
        return id;
      }
    }

    // This is an import for side-effects only.
    else if (region.type === "import" && !region.isDynamic) {
      let importedModule = makeNonCyclic(module).resolvedImports[
        region.importIndex
      ];
      if (this.moduleInOurBundle(importedModule)) {
        return this.walk(importedModule, documentPointer);
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        this.keptRegions.set(id, new Set());
        return id;
      }
    }

    // This is a plain jane region that has no pkg resolutions that we just want
    // to keep, and continue our journey for its deps
    else {
      this.keptRegions.set(id, new Set());

      // overlay our module resolutions on top of the code regions, such that
      // a document pointer region depends on the document pointers of the
      // modules reflected in its module resolution
      if (pointer === documentPointer) {
        let moduleDocumentDeps = makeNonCyclic(
          module
        ).resolvedImports.map((m) => regionId(m, documentPointer));
        for (let depId of moduleDocumentDeps) {
          this.keptRegions.get(id)?.add(depId);
        }
      }

      for (let depId of region.dependsOn) {
        let resolvedDepId = this.walk(module, depId);
        if (resolvedDepId != null) {
          this.keptRegions.get(id)!.add(resolvedDepId);
        }
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
        if (sourceModule.url.href !== module.url.href) {
          let itemId = this.walk(sourceModule, pointer);
          if (itemId) {
            namespaceItemIds.push(itemId);
          }
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
          this.keptRegions.set(itemId, new Set());
          let items = this.visitNamespace(source.importedFromModule);
          for (let item in items) {
            this.keptRegions.get(itemId)!.add(item);
          }
          namespaceItemIds.push(itemId);
        } else {
          let itemId = regionId(module, importedPointer);
          this.keptRegions.set(itemId, new Set());
          namespaceItemIds.push(itemId);
        }
      }
    }

    return namespaceItemIds;
  }

  // There are situations where we visit a region (e.g., a side effect), before
  // we visit the declaration that uses the side effect (because the side effect
  // is depended upon by a module--and that's the path we took to get to the
  // side effect). It's only after we have performed a pkg resolution on the
  // declaration that we realize that we actually want to use a different module
  // for this declaration, so we need to unwind the step that we initially took
  // when we visited the side effect. These become "forbidden regions".
  private backOff(module: Resolution, pointer: RegionPointer) {
    let region = module.desc.regions[pointer];
    let declaratorOf: RegionPointer | undefined;
    let canRemoveDeclaratorOf = false;
    if (region.type === "declaration" && region.declaration.type === "local") {
      declaratorOf = region.declaration.declaratorOfRegion;
      if (declaratorOf != null) {
        let siblingDeclarations = flatMap(module.desc.regions, (r, p) =>
          r.type === "declaration" &&
          r.declaration.type === "local" &&
          r.declaration.declaratorOfRegion === declaratorOf &&
          p !== pointer
            ? [p]
            : []
        );
        canRemoveDeclaratorOf =
          siblingDeclarations.length === 0 ||
          siblingDeclarations.every(
            (p) =>
              this.seenRegions.has(regionId(module, p)) &&
              !this.keptRegions.has(regionId(module, p))
          );
      }
    }
    visitCodeRegions(
      module.desc.regions,
      (_, p) => {
        let id = regionId(module, p);
        this.seenRegions.add(id);
        this.keptRegions.delete(id);
      },
      declaratorOf && canRemoveDeclaratorOf ? declaratorOf : pointer
    );
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
  private editorMap: Map<
    string,
    {
      editor: RegionEditor;
      module: ModuleResolution;
      sideEffectDeclarations: Set<RegionPointer>;
    }
  > = new Map();
  private dependenciesOf: RegionGraph;
  private exposedIds: string[];
  constructor(
    private keptRegions: RegionGraph,
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
    let { dependenciesOf, leaves } = this.invertCodeRegions(this.exposedIds);
    this.dependenciesOf = dependenciesOf;
    for (let leaf of leaves) {
      this.assignEditor(leaf);
    }

    for (let [regionId, { enclosingEditors }] of this.assignmentMap) {
      let { pointer } = idParts(regionId);
      for (let editorId of enclosingEditors) {
        let { editor } = this.editorMap.get(editorId) ?? {};
        if (!editor) {
          let { module } = getRegionFromId(regionId, this.ownAssignments);
          editor = new RegionEditor(module.source, module.desc, this.bundle);
          this.editorMap.set(editorId, {
            editor,
            module,
            sideEffectDeclarations: new Set(), // TODO
          });
        }
        editor.keepRegion(pointer);
      }
    }

    this.pruneEditors();
  }

  get editors(): Editor[] {
    return [...this.editorMap.values()];
  }

  private assignEditor(id: string): EditorAssignment {
    let alreadyAssigned = this.assignmentMap.get(id);
    if (alreadyAssigned) {
      return alreadyAssigned;
    }

    let { moduleHref } = idParts(id);

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

    let dependers = [...(this.dependenciesOf.get(id) ?? [])].map(
      (depender) => ({
        moduleHref: idParts(depender).moduleHref,
        assignment: this.assignEditor(depender),
      })
    );

    // test the things that depend on us to see if it can use the same editor
    for (let depender of dependers) {
      if (
        dependers.every(
          (otherDepender) => otherDepender.moduleHref === depender.moduleHref
        ) &&
        depender.moduleHref === moduleHref
      ) {
        // we can merge with this consumer
        let assignment: EditorAssignment = {
          moduleHref,
          enclosingEditors: depender.assignment.enclosingEditors,
        };
        this.assignmentMap.set(id, assignment);
        return assignment;
      }

      // If we have a depender that in turn depends on our module's document
      // pointer, when we can merge into the editor for our module's document
      // pointer
      else if (
        dependers.find((depender) =>
          [...depender.assignment.enclosingEditors].find((id) =>
            this.keptRegions.get(id)?.has(regionId(moduleHref, documentPointer))
          )
        )
      ) {
        let ourModuleDocumentAssignment = this.assignmentMap.get(
          regionId(moduleHref, documentPointer)
        );
        if (!ourModuleDocumentAssignment) {
          throw new Error(
            `we don't have an editor assignment for the region id ${regionId(
              moduleHref,
              documentPointer
            )} in the bundle ${this.bundle.href}`
          );
        }
        let assignment: EditorAssignment = {
          moduleHref,
          enclosingEditors: ourModuleDocumentAssignment.enclosingEditors,
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
    }, [] as [string, { editor: RegionEditor; module: ModuleResolution }][][]);

    for (let [[, { editor }], ...rest] of merges) {
      if (rest.length > 0) {
        editor.mergeWith(...rest.map(([, { editor }]) => editor));
        for (let [mergedId] of rest) {
          this.editorMap.delete(mergedId);
        }
      }
    }
  }

  private invertCodeRegions(
    regionIds: string[],
    dependenciesOf: RegionGraph = new Map(),
    leaves: Set<string> = new Set()
  ): { dependenciesOf: RegionGraph; leaves: Set<string> } {
    for (let depender of regionIds) {
      let dependsOn = [...(this.keptRegions.get(depender) ?? [])];
      if (dependsOn.length > 0) {
        this.invertCodeRegions(dependsOn, dependenciesOf, leaves);
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
