import { BuilderNode, NextNode, Value } from "./common";
import {
  makeNonCyclic,
  ModuleResolution,
  Resolution,
  ResolveFromLock,
} from "./resolution";
import { getExportDesc, getExports, ModuleDescription } from "../describe-file";
import {
  DeclarationCodeRegion,
  documentPointer,
  isNamespaceMarker,
  NamespaceMarker,
  RegionEditor,
  RegionPointer,
} from "../code-region";
import { BundleAssignment, BundleAssignmentsNode } from "./bundle";
import {
  HeadState,
  resolveDeclaration,
  UnresolvedResult,
  resolutionForPkgDepDeclaration,
} from "../module-rewriter";
import { AppendModuleNode, FinishAppendModulesNode } from "./append-module";
import { Dependencies } from "./entrypoint";
import { pkgInfoFromCatalogJsURL } from "../resolver";
import { satisfies, coerce, compare } from "semver";
//@ts-ignore
import { intersect } from "semver-intersect";
import { LockEntries } from "./lock-file";

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
        this.dependencies,
        this.lockEntries,
        this.bundleAssignmentsNode
      ),
    };
  }

  async run({
    info: { assignments, resolutionsInDepOrder, pkgResolutions },
  }: {
    info: {
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
      pkgResolutions: { [pkgName: string]: string };
    };
  }): Promise<NextNode<{ code: string; desc: ModuleDescription }>> {
    let ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );

    let depResolver = new DependencyResolver(
      this.dependencies,
      pkgResolutions,
      assignments,
      this.bundle
    );

    let exposed = exposedRegions(this.bundle, assignments, depResolver);

    let editors: { module: ModuleResolution; editor: RegionEditor }[] = [];
    let visitedRegions: Map<string, Set<RegionPointer>> = new Map();

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
        editor = new RegionEditor(module.source, module.desc);
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
    // filter out editors that have only retained solely their document regions,
    // these are no-ops
    editors = editors.filter(
      (e) =>
        !e.editor
          .includedRegions()
          .every((p) => e.editor.regions[p].type === "document")
    );

    let headState = new HeadState(editors);
    let { module, editor } = headState.next() ?? {};
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
        assignments,
        this.dependencies,
        depResolver
      ),
    };
  }
}

class PrepareCombineModulesNode implements BuilderNode {
  cacheKey: PrepareCombineModulesNode;
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
      pkgResolutions: { [pkgName: string]: string };
    }>
  > {
    return {
      node: new ResolvePkgDeps(
        this.bundle,
        this.dependencies,
        this.lockEntries,
        assignments,
        resolutionsInDepOrder
      ),
    };
  }
}

class ResolvePkgDeps implements BuilderNode {
  // caching is not ideal here--we are relying on the fact that the nodes that
  // this builder node kicks off are most likely all cached
  cacheKey: ResolvePkgDeps;
  private ownAssignments: BundleAssignment[];
  constructor(
    private bundle: URL,
    private dependencies: Dependencies,
    private lockEntries: LockEntries,
    private assignments: BundleAssignment[],
    private resolutionsInDepOrder: ModuleResolution[]
  ) {
    this.cacheKey = this;
    this.ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );
  }
  async deps() {
    let pkgs = Object.keys(this.dependencies).sort();
    let { entrypointModuleURL } = this.ownAssignments[0];
    return pkgs.map(
      (pkg) => new ResolveFromLock(pkg, entrypointModuleURL, this.lockEntries)
    );
  }
  async run(resolutions: {
    [pkgIndex: number]: URL | undefined;
  }): Promise<
    Value<{
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
      pkgResolutions: { [pkgName: string]: string };
    }>
  > {
    let pkgs = Object.keys(this.dependencies).sort();
    let pkgResolutions: { [pkgName: string]: string } = {};
    for (let [index, pkgName] of pkgs.entries()) {
      let bundleHref = resolutions[index]?.href;
      if (!bundleHref) {
        throw new Error(
          `could not find pkg '${pkgName}' in lockfile for ${this.ownAssignments[0].entrypointModuleURL.href} when building bundle ${this.bundle.href}`
        );
      }
      pkgResolutions[pkgName] = bundleHref;
    }
    return {
      value: {
        assignments: this.assignments,
        resolutionsInDepOrder: this.resolutionsInDepOrder,
        pkgResolutions,
      },
    };
  }
}

export class DependencyResolver {
  private consumedDeps: ConsumedDependencies;
  private resolutionCache: Map<string, ResolvedDependency[]> = new Map();
  constructor(
    dependencies: Dependencies,
    resolutions: { [pkgName: string]: string },
    assignments: BundleAssignment[],
    private bundle: URL
  ) {
    this.consumedDeps = gatherDependencies(
      dependencies,
      resolutions,
      assignments,
      bundle
    );
    this.resolutionCache = new Map();
  }

  resolutionsForPkg(pkgHref: string): ResolvedDependency[] {
    let cachedResolutions = this.resolutionCache.get(pkgHref);
    if (cachedResolutions) {
      return cachedResolutions;
    }

    let resolutions = this.consumedDeps.get(pkgHref);
    if (!resolutions || resolutions.length === 0) {
      return [];
    }

    // this is a map of bundleHrefs (which include the pkg version), to a set of
    // resolution indices (from the "resolutions" array) whose consumption range
    // satisfies the bundleHref version. The goal is to find the package that
    // has the most amount of range satisfications.
    let rangeSatisfications = new Map<string, Set<number>>();

    for (let [versionIndex, { bundleHref }] of resolutions.entries()) {
      let { version: ver } = pkgInfoFromCatalogJsURL(new URL(bundleHref))!;
      let version = coerce(ver);
      if (!version) {
        throw new Error(
          `the version ${ver} for the bundle ${bundleHref} is not a valid version, while processing bundle ${this.bundle.href}`
        );
      }
      let rangeIndices = rangeSatisfications.get(bundleHref);
      if (!rangeIndices) {
        rangeIndices = new Set();
        rangeSatisfications.set(bundleHref, rangeIndices);
      }
      for (let [rangeIndex, { range }] of resolutions.entries()) {
        if (versionIndex === rangeIndex) {
          // the version used for a declaration should always match its own consumption range
          rangeIndices.add(rangeIndex);
          continue;
        }
        if (satisfies(version, range)) {
          rangeIndices.add(rangeIndex);
        }
      }
    }

    // Choose the bundleHref (pkg ver) that is satisfied by the most amount of
    // consumption ranges. For the unsatisfied bundleHrefs, choose the bundle
    // href that has the next highest amount of satisfications, and so on, until
    // we have accounted for all the consumption points. The determinations made
    // using this algorithm will not look past local maxima when trying to
    // optimize for the greatest reuse, so there are definitely improvements
    // that can be made to this algorithm. When there is a tie, select the
    // bundleHref that is the highest version. The resulting range for each set
    // will be an intersection of all the ranges that correspond to the versions
    // that were satisfied in the group.
    let resultingResolutions: ResolvedDependency[] = [];
    let unsatisfiedConsumptionIndices = [...resolutions.entries()].map(
      ([index]) => index
    );
    let sortedBundleHrefs = [...rangeSatisfications.entries()].sort(
      ([bundleHrefA, aIndices], [bundleHrefB, bIndices]) => {
        let diff = bIndices.size - aIndices.size;
        if (diff !== 0) {
          return diff;
        }
        let { version: verA } = pkgInfoFromCatalogJsURL(new URL(bundleHrefA))!;
        let versionA = coerce(verA)!;
        let { version: verB } = pkgInfoFromCatalogJsURL(new URL(bundleHrefB))!;
        let versionB = coerce(verB)!;
        return compare(versionB, versionA);
      }
    );
    while (unsatisfiedConsumptionIndices.length > 0) {
      if (sortedBundleHrefs.length === 0) {
        throw new Error(
          `unable to determine bundleHref to satisfy consumption ranges: ${unsatisfiedConsumptionIndices
            .map((i) => resolutions![i].range)
            .join()}`
        );
      }
      let [selectedBundleHref, consumptionIndices] = sortedBundleHrefs.shift()!;
      let selectedIndex = resolutions.findIndex(
        (r) => r.bundleHref === selectedBundleHref
      )!;
      let selected = resolutions[selectedIndex];
      let obviatedIndices = [...consumptionIndices].filter(
        (i) => i != selectedIndex
      );
      let {
        bundleHref,
        importedSource,
        consumedBy,
        consumedByPointer,
      } = selected;
      let range = intersect(
        ...[...consumptionIndices].map((i) => resolutions![i].range)
      );
      let obviatedDependencies = obviatedIndices.map((i) => ({
        moduleHref: resolutions![i].consumedBy.url.href,
        pointer: resolutions![i].consumedByPointer,
      }));

      resultingResolutions.push({
        importedSource,
        consumedBy,
        consumedByPointer,
        bundleHref,
        range,
        obviatedDependencies,
        importedAs: resolutions[[...consumptionIndices][0]].importedAs,
      });
      unsatisfiedConsumptionIndices = unsatisfiedConsumptionIndices.filter(
        (i) => !consumptionIndices.has(i)
      );
    }

    this.resolutionCache.set(pkgHref, resultingResolutions);
    return resultingResolutions;
  }
}

interface ConsumedDependency {
  importedSource?: {
    pointer: RegionPointer;
    declaredIn: ModuleResolution;
  };
  importedAs: string | NamespaceMarker;
  consumedByPointer: RegionPointer;
  consumedBy: ModuleResolution;
  bundleHref: string;
  range: string;
}

export interface ResolvedDependency extends ConsumedDependency {
  obviatedDependencies: { moduleHref: string; pointer: RegionPointer }[];
}

type ConsumedDependencies = Map<string, ConsumedDependency[]>; // the key of the map is the pkgHref

function gatherDependencies(
  dependencies: Dependencies,
  resolutions: { [pkgName: string]: string },
  assignments: BundleAssignment[],
  bundle: URL
): ConsumedDependencies {
  let consumedDeps: ConsumedDependencies = new Map();
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );

  // first we gather up all the direct dependencies of the project
  for (let [pkgName, dependency] of Object.entries(dependencies)) {
    let bundleHref = resolutions[pkgName];
    if (!bundleHref) {
      throw new Error(
        `unable to determine resolution for pkg ${pkgName} in bundle ${bundle.href} from lock file.`
      );
    }
    let pkgAssignment = assignments.find(
      (a) => a.module.url.href === bundleHref
    );
    if (!pkgAssignment) {
      throw new Error(
        `unable to find bundle assignment for pkg ${pkgName} with url ${bundleHref} in bundle ${bundle.href}`
      );
    }
    let { pkgURL } = pkgInfoFromCatalogJsURL(new URL(bundleHref)) ?? {};
    if (!pkgURL) {
      throw new Error(
        `cannot derive pkgURL from bundle URL ${bundleHref} when building bundle ${bundle.href}`
      );
    }
    for (let { module } of ownAssignments) {
      for (let [pointer, region] of module.desc.regions.entries()) {
        // TODO don't forget about pure side effect imports...
        if (
          region.type !== "declaration" ||
          region.declaration.type !== "import" ||
          module.resolvedImports[region.declaration.importIndex].url.href !==
            bundleHref
        ) {
          continue;
        }
        let source = resolveDeclaration(
          region.declaration.importedName,
          module.resolvedImports[region.declaration.importIndex],
          module,
          ownAssignments
        );
        if (source.type === "resolved") {
          let consumed = consumedDeps.get(pkgURL.href);
          if (!consumed) {
            consumed = [];
            consumedDeps.set(pkgURL.href, consumed);
          }

          consumed.push({
            importedSource: {
              pointer: source.pointer,
              declaredIn: makeNonCyclic(source.module),
            },
            bundleHref,
            consumedBy: module,
            consumedByPointer: pointer,
            importedAs: region.declaration.importedName,
            range: dependency.range,
          });
        }
      }
    }
  }

  // then we gather up all the embedded deps in the included bundles via the
  // "original" property
  for (let { module } of assignments) {
    if (
      assignments.find((a) => a.module.url.href === module.url.href)?.bundleURL
        .href !== bundle.href
    ) {
      continue;
    }
    for (let [, { pointer, declaration }] of module.desc.declarations) {
      if (declaration.type === "import") {
        continue;
      }
      if (declaration.original) {
        let { pkgURL } =
          pkgInfoFromCatalogJsURL(new URL(declaration.original.bundleHref)) ??
          {};
        if (!pkgURL) {
          throw new Error(
            `cannot derive pkgURL from bundle URL ${declaration.original.bundleHref} when building bundle ${bundle.href}`
          );
        }
        let consumed = consumedDeps.get(pkgURL.href);
        if (!consumed) {
          consumed = [];
          consumedDeps.set(pkgURL.href, consumed);
        }

        consumed.push({
          consumedByPointer: pointer,
          consumedBy: module,
          importedAs: declaration.original.importedAs,
          range: declaration.original.range,
          bundleHref: declaration.original.bundleHref,
        });
      }
    }
  }
  return consumedDeps;
}

function discoverIncludedRegions(
  bundle: URL,
  module: Resolution,
  pointer: RegionPointer,
  editor: RegionEditor,
  editors: { module: ModuleResolution; editor: RegionEditor }[],
  ownAssignments: BundleAssignment[],
  depResolver: DependencyResolver,
  visitedRegions: Map<string, Set<RegionPointer>>
) {
  if (visitedRegions.get(module.url.href)?.has(pointer)) {
    return;
  }
  let visited = visitedRegions.get(module.url.href);
  if (!visited) {
    visited = new Set();
    visitedRegions.set(module.url.href, visited);
  }
  visited.add(pointer);

  let region = module.desc.regions[pointer];
  // collapse module side effects
  if (region.original) {
    let pkgURL = pkgInfoFromCatalogJsURL(new URL(region.original.bundleHref))
      ?.pkgURL;
    if (!pkgURL) {
      throw new Error(
        `Cannot determine pkgURL that corresponds to the bundle URL: ${region.original.bundleHref}`
      );
    }
    let resolutions = depResolver.resolutionsForPkg(pkgURL?.href);
    if (
      !resolutions.find((r) => r.bundleHref === region.original!.bundleHref)
    ) {
      return; // this region has been collapsed
    }
  }

  if (region.type === "declaration" && region.declaration.type === "import") {
    let localDesc = region.declaration;
    let importedModule = makeNonCyclic(module).resolvedImports[
      localDesc.importIndex
    ];
    let importedName = localDesc.importedName;
    ({ module, region, pointer, editor } = resolveDependency(
      importedModule.url.href,
      depResolver,
      makeNonCyclic(module),
      pointer,
      region,
      editor,
      editors
    ));
    if (region.declaration.type === "local") {
      discoverIncludedRegions(
        bundle,
        module,
        pointer,
        editor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions
      );
    } else {
      let source = resolveDeclaration(
        importedName,
        importedModule,
        module,
        ownAssignments
      );
      if (source.type === "resolved") {
        if (source.module.url.href !== module.url.href) {
          editor = addNewEditor(source.module, editor, editors);
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
          visitedRegions
        );
      } else {
        let consumingModule = makeNonCyclic(source.consumingModule);
        let { importedPointer } = source;
        if (importedPointer == null) {
          throw new Error(
            `bug: could not determine code region pointer for import of ${JSON.stringify(
              source.importedAs
            )} from ${source.importedFromModule.url.href} in module ${
              consumingModule.url.href
            }`
          );
        }
        if (source.consumingModule.url.href !== module.url.href) {
          editor = addNewEditor(source.consumingModule, editor, editors);
        }
        if (
          ownAssignments.find(
            (a) =>
              a.module.url.href ===
              (source as UnresolvedResult).importedFromModule.url.href
          ) &&
          isNamespaceMarker(source.importedAs)
        ) {
          // we mark the namespace import region as something we want to keep as a
          // signal to the Append nodes to manufacture a namespace object for this
          // consumed import--ultimately, though, we will not include this region.
          if (source.importedPointer == null) {
            throw new Error(
              `unable to determine the region for a namespace import '${region.declaration.declaredName}' of ${source.importedFromModule.url.href} from the consuming module ${source.consumingModule.url.href} in bundle ${bundle.href}`
            );
          }
          editor.keepRegion(source.importedPointer);

          let newEditor = addNewEditor(
            source.importedFromModule,
            editor,
            editors
          );
          discoverIncludedRegionsForNamespace(
            bundle,
            source.importedFromModule,
            newEditor,
            editors,
            ownAssignments,
            depResolver,
            visitedRegions
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
    }
  } else if (
    region.type === "declaration" &&
    region.declaration.type === "local" &&
    region.declaration.original
  ) {
    let bundleHref = region.declaration.original.bundleHref;
    let isRegionObviated: boolean;
    ({ module, region, pointer, editor, isRegionObviated } = resolveDependency(
      bundleHref,
      depResolver,
      makeNonCyclic(module),
      pointer,
      region,
      editor,
      editors
    ));
    if (!isRegionObviated) {
      // the region we entered this function with is the region that we actually
      // want to keep.
      editor.keepRegion(pointer);
    }
    discoverIncludedRegions(
      bundle,
      module,
      pointer,
      editor,
      editors,
      ownAssignments,
      depResolver,
      visitedRegions
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
      let newEditor = addNewEditor(importedModule, editor, editors);
      discoverIncludedRegions(
        bundle,
        importedModule,
        documentPointer,
        newEditor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions
      );
    }
    return; // don't include the dependsOn in this signal
  } else {
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
      visitedRegions
    );
  }
}

function resolveDependency(
  bundleURL: string,
  depResolver: DependencyResolver,
  consumingModule: ModuleResolution,
  pointer: RegionPointer,
  region: DeclarationCodeRegion,
  editor: RegionEditor,
  editors: { module: ModuleResolution; editor: RegionEditor }[]
): {
  isRegionObviated: boolean;
  module: ModuleResolution;
  editor: RegionEditor;
  region: DeclarationCodeRegion;
  pointer: RegionPointer;
} {
  let module: ModuleResolution = consumingModule;
  let pkgURL = pkgInfoFromCatalogJsURL(new URL(bundleURL))?.pkgURL;
  let isRegionObviated = false;
  if (!pkgURL) {
    // not all modules are packages
    return {
      isRegionObviated,
      module,
      editor,
      pointer,
      region,
    };
  }
  let resolution = depResolver
    .resolutionsForPkg(pkgURL?.href)
    .find(
      (r) =>
        (r.consumedBy.url.href === consumingModule.url.href &&
          r.consumedByPointer === pointer) ||
        r.obviatedDependencies.find(
          (o) =>
            o.moduleHref === consumingModule.url.href && o.pointer === pointer
        )
    );

  if (!resolution) {
    // not all modules have dep resolutions
    return {
      isRegionObviated,
      module,
      editor,
      pointer,
      region,
    };
  }
  if (
    resolution.consumedBy.url.href !== consumingModule.url.href ||
    resolution.consumedByPointer !== pointer
  ) {
    // region we entered this function with is actually obviated by a
    // different region
    isRegionObviated = true;
    if (resolution.importedSource) {
      editor = addNewEditor(
        resolution.importedSource.declaredIn,
        editor,
        editors
      );
      module = resolution.importedSource.declaredIn;
      region = editor.regions[
        resolution.importedSource.pointer
      ] as DeclarationCodeRegion;
      pointer = resolution.importedSource.pointer;
    } else {
      editor = addNewEditor(resolution.consumedBy, editor, editors);
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
  };
}

function discoverIncludedRegionsForNamespace(
  bundle: URL,
  module: Resolution,
  editor: RegionEditor,
  editors: { module: ModuleResolution; editor: RegionEditor }[],
  ownAssignments: BundleAssignment[],
  depResolver: DependencyResolver,
  visitedRegions: Map<string, Set<RegionPointer>>
) {
  let exports = getExports(module);
  for (let [exportName, { module: sourceModule }] of exports.entries()) {
    let source = resolveDeclaration(
      exportName,
      sourceModule,
      module,
      ownAssignments
    );
    if (source.type === "resolved") {
      let currentEditor = editor;
      if (source.module.url.href !== module.url.href) {
        currentEditor = addNewEditor(source.module, editor, editors);
      }
      discoverIncludedRegions(
        bundle,
        source.module,
        source.pointer,
        currentEditor,
        editors,
        ownAssignments,
        depResolver,
        visitedRegions
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
          editor = addNewEditor(source.consumingModule, editor, editors);
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
          editors
        );
        discoverIncludedRegionsForNamespace(
          bundle,
          source.importedFromModule,
          newEditor,
          editors,
          ownAssignments,
          depResolver,
          visitedRegions
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

function addNewEditor(
  moduleForNewEditor: Resolution,
  insertBefore: RegionEditor,
  editors: { module: ModuleResolution; editor: RegionEditor }[]
): RegionEditor {
  let nonCyclicModule = makeNonCyclic(moduleForNewEditor);
  let newEditor = new RegionEditor(
    nonCyclicModule.source,
    moduleForNewEditor.desc
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
    }
  );
  return newEditor;
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

      let source = resolveDeclaration(
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
