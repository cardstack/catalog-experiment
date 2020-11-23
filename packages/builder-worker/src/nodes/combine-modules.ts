import { BuilderNode, NextNode } from "./common";
import { makeNonCyclic, ModuleResolution, Resolution } from "./resolution";
import { getExports, ModuleDescription } from "../describe-file";
import {
  documentPointer,
  isNamespaceMarker,
  LocalDeclarationDescription,
  RegionEditor,
  RegionPointer,
} from "../code-region";
import { BundleAssignment, BundleAssignmentsNode } from "./bundle";
import { HeadState, resolveDeclaration } from "../module-rewriter";
import { AppendModuleNode } from "./append-module";
import { Dependencies } from "./entrypoint";
import { pkgInfoFromCatalogJsURL } from "../resolver";
import { satisfies, coerce, minVersion, compare, rcompare } from "semver";
//@ts-ignore
import { intersect } from "semver-intersect";
export class CombineModulesNode implements BuilderNode {
  cacheKey: CombineModulesNode;
  constructor(
    private bundle: URL,
    private dependencies: Dependencies,
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
  }): Promise<NextNode<{ code: string; desc: ModuleDescription }>> {
    let moduleResolutions = resolutionsInDepOrder.filter(
      (module) =>
        assignments.find((a) => a.module.url.href === module.url.href)
          ?.bundleURL.href === this.bundle.href
    );
    let exposed = exposedRegions(this.bundle, assignments);

    let editors: Map<string, RegionEditor> = new Map();
    for (let module of moduleResolutions) {
      editors.set(
        module.url.href,
        new RegionEditor(module.source, module.desc)
      );
    }
    let ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );
    let consumptionResolver = new ConsumptionResolver(assignments, this.bundle);

    for (let { pointer, module } of exposed) {
      discoverIncludedRegions(
        this.bundle,
        module,
        pointer,
        editors,
        ownAssignments,
        consumptionResolver
      );
    }

    // TODO need to select most compatible version of duplicate code based on
    // consumed semver ranges. This means that we might need to adjust the
    // included code regions accordingly.

    let headState = new HeadState(
      moduleResolutions,
      consumptionResolver.consumptionResolutions
    );
    let firstModule = headState.nextModule();
    if (!firstModule) {
      throw new Error(`bug: there are no module resolutions in this bundle`);
    }
    return {
      node: new AppendModuleNode(
        headState,
        firstModule,
        this.bundle,
        editors,
        assignments,
        this.dependencies
      ),
    };
  }
}

class ConsumptionResolver {
  private consumptionRanges: ConsumptionRanges;
  private resolutionCache: Map<string, ResolvedDeclarationSource[]> = new Map();
  constructor(assignments: BundleAssignment[], private bundle: URL) {
    this.consumptionRanges = gatherConsumptionRanges(assignments, bundle);
    this.resolutionCache = new Map();
  }

  get consumptionResolutions(): Map<string, ResolvedDeclarationSource[]> {
    return this.resolutionCache;
  }

  resolutionsForPkg(pkgHref: string): ResolvedDeclarationSource[] {
    let cachedResolutions = this.resolutionCache.get(pkgHref);
    if (cachedResolutions) {
      return cachedResolutions;
    }

    let resolutions = this.consumptionRanges.get(pkgHref);
    if (!resolutions || resolutions.length === 0) {
      throw new Error(
        `Unable to get consumption range for package ${pkgHref}, this pkg does not appear to be consumed in the bundle ${this.bundle.href}`
      );
    }

    let rangeSatisfications = new Map<string, number[]>();
    for (let [rangeIndex, { range }] of resolutions.entries()) {
      let versionIndices = rangeSatisfications.get(range);
      if (!versionIndices) {
        versionIndices = [];
        rangeSatisfications.set(range, versionIndices);
      }
      for (let [versionIndex, { bundleHref }] of resolutions.entries()) {
        let { version: ver } = pkgInfoFromCatalogJsURL(new URL(bundleHref))!;
        let version = coerce(ver);
        if (!version) {
          throw new Error(
            `the version ${ver} for the bundle ${bundleHref} is not a valid version, while processing bundle ${this.bundle.href}`
          );
        }
        if (versionIndex === rangeIndex) {
          // the version used for a declaration should always match its own consumption range
          versionIndices.push(versionIndex);
          continue;
        }
        if (satisfies(version, range)) {
          versionIndices.push(versionIndex);
        }
      }
    }

    // Choose the range that maximizes the amount of reuse, and the resolved
    // version for that range will be the latest version matched in that range.
    // For the versions that were not satisfied, choose the next range that
    // maximizes the amount of reuse among the unsatisfied versions, and so on.
    // The determinations made will not look past local maxima when trying to
    // optimize for the greatest reuse. There are definitely improvements that
    // can be made to this algorithm. When there is a tie, select the index that
    // corresponds to the range that can match the lowest possible version
    // (using this to have a deterministic way to break ties that can cast the
    // widest net in terms of compatibility), and if there is still a tie, just
    // chose the smallest range alphabetically by the range's name. The
    // resulting range for each set will be an intersection of all the ranges
    // that correspond to the versions that were satisfied in the group.
    let resultingResolutions: ResolvedDeclarationSource[] = [];
    let unsatisfiedIndices = [...resolutions.entries()].map(([index]) => index);
    let sortedRanges = [...rangeSatisfications.entries()].sort(
      ([rangeA, aIndices], [rangeB, bIndices]) => {
        let diff = bIndices.length - aIndices.length;
        if (diff !== 0) {
          return diff;
        }
        let minVerA = minVersion(rangeA)!;
        let minVerB = minVersion(rangeB)!;
        diff = compare(minVerA, minVerB);
        if (diff !== 0) {
          return diff;
        }
        return rangeA.localeCompare(rangeB);
      }
    );
    while (unsatisfiedIndices.length > 0) {
      if (sortedRanges.length === 0) {
        throw new Error(
          `unable to determine range to satisfy versions: ${unsatisfiedIndices
            .map((i) => resolutions![i].bundleHref)
            .join()}`
        );
      }
      let [, indices] = sortedRanges.shift()!;
      let indicesSortedByVer = indices.sort((a, b) => {
        let pkgAInfo = pkgInfoFromCatalogJsURL(
          new URL(resolutions![a].bundleHref)
        );
        let pkgBInfo = pkgInfoFromCatalogJsURL(
          new URL(resolutions![b].bundleHref)
        );
        return rcompare(coerce(pkgAInfo!.version)!, coerce(pkgBInfo!.version)!);
      });
      let selected = resolutions[indicesSortedByVer[0]];
      let obviatedIndices = indicesSortedByVer.slice(1);
      let { bundleHref, consumedByModuleHref: moduleHref, pointer } = selected;
      let range = intersect(...indices.map((i) => resolutions![i].range));
      let obviatedRegions = obviatedIndices.map((i) => ({
        moduleHref: resolutions![i].consumedByModuleHref,
        pointer: resolutions![i].pointer,
      }));
      resultingResolutions.push({
        consumedByModuleHref: moduleHref,
        // capturing the region pointer is probably redundant since you could
        // never have duplicate declarations in the same consuming module
        pointer,
        bundleHref,
        range,
        obviatedRegions,
        importedAs: resolutions[indices[0]].importedAs,
      });
      unsatisfiedIndices = unsatisfiedIndices.filter(
        (i) => !indices.includes(i)
      );
    }

    this.resolutionCache.set(pkgHref, resultingResolutions);
    return resultingResolutions;
  }
}

interface OriginalDeclarationWithPointer
  extends NonNullable<LocalDeclarationDescription["original"]> {
  pointer: RegionPointer;
  consumedByModuleHref: string;
}

export interface ResolvedDeclarationSource
  extends OriginalDeclarationWithPointer {
  obviatedRegions: { moduleHref: string; pointer: RegionPointer }[];
}

type ConsumptionRanges = Map<string, OriginalDeclarationWithPointer[]>; // the key of the map is the pkgHref

function gatherConsumptionRanges(
  assignments: BundleAssignment[],
  bundle: URL
): ConsumptionRanges {
  let consumptionRanges: ConsumptionRanges = new Map();
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
        let consumed = consumptionRanges.get(pkgURL.href);
        if (!consumed) {
          consumed = [];
          consumptionRanges.set(pkgURL.href, consumed);
        }
        consumed.push({
          consumedByModuleHref: module.url.href,
          pointer,
          ...declaration.original,
        });
      }
    }
  }
  return consumptionRanges;
}

function discoverIncludedRegions(
  bundle: URL,
  module: Resolution,
  pointer: RegionPointer,
  editors: Map<string, RegionEditor>,
  ownAssignments: BundleAssignment[],
  consumptionResolver: ConsumptionResolver
) {
  if (editors.get(module.url.href)?.isRegionKept(pointer)) {
    return;
  }

  let region = module.desc.regions[pointer];
  if (region.type === "declaration" && region.declaration.type === "import") {
    let localDesc = region.declaration;
    let importedModule = makeNonCyclic(module).resolvedImports[
      localDesc.importIndex
    ];
    let importedName = localDesc.importedName;
    let source = resolveDeclaration(
      importedName,
      importedModule,
      module,
      ownAssignments
    );
    if (source.type === "resolved") {
      discoverIncludedRegions(
        bundle,
        source.module,
        source.pointer,
        editors,
        ownAssignments,
        consumptionResolver
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
      if (isNamespaceMarker(source.importedAs)) {
        // we mark the namespace import region as something we want to keep as a
        // signal to the Append nodes to manufacture a namespace object for this
        // consumed import--ultimately, though, we will not include this region.
        editors
          .get(source.consumingModule.url.href)!
          .keepRegion(importedPointer);
        discoverIncludedRegionsForNamespace(
          bundle,
          source.importedFromModule,
          editors,
          ownAssignments,
          consumptionResolver
        );
        return; // don't include the dependsOn in this signal
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        editors
          .get(source.consumingModule.url.href)!
          .keepRegion(importedPointer);
        return; // don't include the dependsOn in this signal
      }
    }
  } else if (
    region.type === "declaration" &&
    region.declaration.type === "local" &&
    region.declaration.original
  ) {
    // check for overlapping consumption ranges
    let bundleHref = region.declaration.original.bundleHref;
    let pkgURL = pkgInfoFromCatalogJsURL(new URL(bundleHref))?.pkgURL;
    if (!pkgURL) {
      throw new Error(
        `Cannot determine pkgURL that corresponds to the bundle URL: ${bundleHref}`
      );
    }
    let resolutions = consumptionResolver.resolutionsForPkg(pkgURL?.href);
    if (
      resolutions.find(
        (r) =>
          r.consumedByModuleHref === module.url.href && r.pointer === pointer
      )
    ) {
      editors.get(module.url.href)!.keepRegion(pointer);
    } else {
      // this region has been collapsed
      return;
    }
  } else {
    editors.get(module.url.href)!.keepRegion(pointer);
  }
  for (let depPointer of region.dependsOn) {
    discoverIncludedRegions(
      bundle,
      module,
      depPointer,
      editors,
      ownAssignments,
      consumptionResolver
    );
  }
}

function discoverIncludedRegionsForNamespace(
  bundle: URL,
  module: Resolution,
  editors: Map<string, RegionEditor>,
  ownAssignments: BundleAssignment[],
  consumptionResolver: ConsumptionResolver
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
      discoverIncludedRegions(
        bundle,
        source.module,
        source.pointer,
        editors,
        ownAssignments,
        consumptionResolver
      );
    } else {
      // we mark the namespace import region as something we want to keep as a
      // signal to the Append nodes to manufacture a namespace object for this
      // import--ultimately, though, we will not include this region.
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
      if (isNamespaceMarker(source.importedAs)) {
        editors.get(module.url.href)!.keepRegion(importedPointer);
        discoverIncludedRegionsForNamespace(
          bundle,
          source.importedFromModule,
          editors,
          ownAssignments,
          consumptionResolver
        );
      } else {
        // we mark the external bundle import region as something we want to keep
        // as a signal to the Append nodes that this import is consumed and to
        // include this region in the resulting bundle.
        editors
          .get(source.consumingModule.url.href)!
          .keepRegion(importedPointer);
      }
    }
  }
}
export interface ExposedRegionInfo {
  exposedAs: string | undefined;
  pointer: RegionPointer;
  module: Resolution;
}

function exposedRegions(
  bundle: URL,
  bundleAssignments: BundleAssignment[]
): ExposedRegionInfo[] {
  let results: ExposedRegionInfo[] = [];
  let ownAssignments = bundleAssignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );
  for (let assignment of ownAssignments) {
    let { module }: { module: Resolution } = assignment;
    let document = module.desc.regions[documentPointer];
    let moduleDependencies = document.dependsOn;
    if (moduleDependencies.size > 0) {
      for (let moduleDependency of moduleDependencies) {
        results.push({
          module,
          pointer: moduleDependency,
          exposedAs: undefined,
        });
      }
    }

    for (let [original, exposed] of assignment.exposedNames) {
      let source = resolveDeclaration(original, module, module, ownAssignments);
      if (source.type === "resolved") {
        results.push({
          module: source.module,
          exposedAs: exposed,
          pointer: source.pointer,
        });
      } else {
        // TODO deal with NamespaceMarkers and external bundles
        throw new Error("unimplemented");
      }
    }
  }
  return results;
}
