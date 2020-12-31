import {
  makeNonCyclic,
  ModuleResolution,
  Resolution,
} from "./nodes/resolution";
import {
  CodeRegion,
  DeclarationCodeRegion,
  DeclarationDescription,
  documentPointer,
  isNamespaceMarker,
  LocalDeclarationDescription,
  NamespaceMarker,
  RegionPointer,
} from "./code-region";
import { BundleAssignment } from "./nodes/bundle";
import { Dependencies, Dependency } from "./nodes/entrypoint";
import { pkgInfoFromCatalogJsURL } from "./resolver";
import { satisfies, coerce, compare, validRange } from "semver";
import { LockEntries, LockFile } from "./nodes/lock-file";
import {
  setDoubleNestedMapping,
  rangeIntersection,
  stringifyReplacer,
  setTripleNestedMapping,
} from "./utils";
import { getExportDesc, getExports, isExportAllMarker } from "./describe-file";
import { difference, flatMap, groupBy } from "lodash";

export type ResolvedDependency =
  | ResolvedDeclarationDependency
  | ResolvedSideEffectDependency;
interface DependencyBase {
  consumedByPointer: RegionPointer;
  consumedBy: ModuleResolution;
  bundleHref: string;
  range: string;
}

export interface ResolvedDeclarationDependency extends DependencyBase {
  type: "declaration";
  importedSource?: {
    pointer: RegionPointer | undefined;
    declaredIn: ModuleResolution;
  };
  importedAs: string | NamespaceMarker;
  source: string;
}
export interface ResolvedSideEffectDependency extends DependencyBase {
  type: "side-effect";
}

export interface ResolvedResult {
  type: "resolved";
  module: Resolution;
  declaredName: string;
  importedAs: string;
  region: DeclarationCodeRegion;
  pointer: RegionPointer;
  declaration: DeclarationDescription;
  resolution?: ResolvedDeclarationDependency;
}

export interface UnresolvedResult {
  type: "unresolved";
  importedFromModule: Resolution;
  consumingModule: Resolution;
  importedAs: string | NamespaceMarker;
  importedRegion: CodeRegion | undefined;
  importedPointer: RegionPointer | undefined;
  resolution?: ResolvedDeclarationDependency;
}

type DeclarationResolutionCache = Map<
  string,
  Map<string, Map<string | NamespaceMarker, ResolvedResult | UnresolvedResult>>
>;

export class DependencyResolver {
  private consumedDeps: ConsumedDependencies;
  private pkgHrefs: string[];
  // pkgHref => consumingModuleHref => consumingRegion => ResolvedDependency
  private consumptionCache: Map<
    string,
    Map<string, Map<RegionPointer, ResolvedDependency>>
  >;
  // consumingModuleHref => importedFromModuleHref => importedName => ResolvedResult | UnresolvedResult
  private declarationResolutionCache: DeclarationResolutionCache = new Map();
  constructor(
    dependencies: Dependencies,
    assignments: BundleAssignment[],
    lockEntries: LockEntries,
    lockFile: LockFile | undefined,
    private bundle: URL
  ) {
    this.consumedDeps = gatherDependencies(
      dependencies,
      assignments,
      lockEntries,
      lockFile,
      bundle
    );
    this.pkgHrefs = [...this.consumedDeps.keys()];
    this.consumptionCache = new Map();
  }

  resolveDeclaration(
    importedName: string | NamespaceMarker,
    importedFromModule: Resolution,
    consumingModule: Resolution,
    ownAssignments: BundleAssignment[],
    importedPointer?: RegionPointer // if you have this handy it saves work passing it in--otherwise we'll calculate it
  ): ResolvedResult | UnresolvedResult {
    return resolveDeclaration(
      importedName,
      importedFromModule,
      consumingModule,
      ownAssignments,
      this.declarationResolutionCache,
      this,
      importedPointer
    );
  }

  resolutionByDeclaration(
    declaration: DeclarationDescription,
    module: ModuleResolution,
    pointer: RegionPointer
  ): ResolvedDeclarationDependency | undefined {
    return resolutionByDeclaration(declaration, module, pointer, this);
  }

  resolutionByConsumptionRegion(
    consumedBy: Resolution,
    consumedByPointer: RegionPointer,
    pkg?: URL
  ): ResolvedDependency | undefined {
    if (pkg) {
      let pkgHref = pkg.href;
      return this.getResolutionsForPkg(pkgHref)
        ?.get(consumedBy.url.href)
        ?.get(consumedByPointer);
    } else {
      for (let pkgHref of this.pkgHrefs) {
        let resolution = this.getResolutionsForPkg(pkgHref)
          .get(consumedBy.url.href)
          ?.get(consumedByPointer);
        if (resolution) {
          return resolution;
        }
      }
      return;
    }
  }

  resolutionsByConsumingModule(
    pkg: URL,
    consumedBy: Resolution
  ): ResolvedDependency[] {
    let pkgHref = pkg.href;
    let resolutionsForPkg = this.getResolutionsForPkg(pkgHref);
    return [...(resolutionsForPkg?.get(consumedBy.url.href)?.values() ?? [])];
  }

  private getResolutionsForPkg(
    pkgHref: string
  ): Map<string, Map<RegionPointer, ResolvedDependency>> {
    if (!this.consumptionCache.has(pkgHref)) {
      this.buildResolutionsForPkg(pkgHref);
    }
    return this.consumptionCache.get(pkgHref)!;
  }

  private buildResolutionsForPkg(pkgHref: string) {
    let pkgVersions = this.consumedDeps.get(pkgHref);
    if (!pkgVersions || pkgVersions.size === 0) {
      this.consumptionCache.set(pkgHref, new Map());
      return;
    }

    // this is a map of bundleHrefs (which include the pkg version), to a set of
    // bundle versions whose consumption range satisfies the bundleHref version.
    // The goal is to find the package that has the most amount of range
    // satisfications.
    let rangeSatisfications = new Map<string, Set<string>>();

    let bundleVersions = [...pkgVersions.keys()];
    if (bundleVersions.length === 1) {
      rangeSatisfications.set(bundleVersions[0], new Set([bundleVersions[0]]));
    } else {
      for (let bundleVersion of bundleVersions) {
        let [ver] = bundleVersion.split("/");
        let version = coerce(ver);
        if (!version) {
          throw new Error(
            `the version ${ver} for the bundle ${pkgHref}/${bundleVersion} is not a valid version, while processing bundle ${this.bundle.href}`
          );
        }
        let bindings = flatMap(pkgVersions.get(bundleVersion)!, (r) =>
          r.type === "declaration"
            ? !isNamespaceMarker(r.importedAs)
              ? [r.importedAs]
              : ["{NamespaceMarker}"]
            : []
        );
        let satisfiedVersions = rangeSatisfications.get(bundleVersion);
        if (!satisfiedVersions) {
          satisfiedVersions = new Set();
          rangeSatisfications.set(bundleVersion, satisfiedVersions);
        }
        for (let [otherBundleVersion, resolutions] of pkgVersions.entries()) {
          let { range } = resolutions[0]; // the resolutions all come from the same version, so just grab the first one
          // the version used for a declaration should always match its own consumption range
          if (bundleVersion === otherBundleVersion) {
            // npm allows non-semver range strings in the right hand side of the
            // dependency (e.g. URLs, tags, branches, etc)
            if (!validRange(range)) {
              satisfiedVersions.add(otherBundleVersion);
              continue;
            }
            if (!satisfies(version, range)) {
              throw new Error(
                `The version of the package ${pkgHref}/${bundleVersion} does not satisfy it's own consumer's specified range: ${range}. Are you specifying a custom "dependency" recipe? If so, check to make sure the range you are specifying satisfies the version of the package that is actually consumed (as denoted in the catalogjs.lock file).`
              );
            }
            satisfiedVersions.add(otherBundleVersion);
            continue;
          }

          if (satisfies(version, range)) {
            // in additional to ensuring that the version is satisfied by the
            // range, we also need to check if the all of the resolutions'
            // bindings are available (in the process of rolling up pkgs, we may
            // have pruned unconsumed bindings)
            let otherBundleBindings = flatMap(
              pkgVersions.get(otherBundleVersion)!,
              (r) =>
                r.type === "declaration"
                  ? !isNamespaceMarker(r.importedAs)
                    ? [r.importedAs]
                    : ["{NamespaceMarker}"]
                  : []
            );
            if (difference(otherBundleBindings, bindings).length === 0) {
              satisfiedVersions.add(otherBundleVersion);
            }
          }
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
    let resolutionsForPkg: Map<
      string,
      Map<RegionPointer, ResolvedDependency>
    > = new Map();
    let unsatisfiedVersions = new Set([...pkgVersions.keys()]);
    let sortedBundleVersions = [...rangeSatisfications.entries()].sort(
      ([bundleVerA, aIndices], [bundleVerB, bIndices]) => {
        let diff = bIndices.size - aIndices.size;
        if (diff !== 0) {
          return diff;
        }
        let [verA] = bundleVerA.split("/");
        let versionA = coerce(verA)!;
        let [verB] = bundleVerB.split("/");
        let versionB = coerce(verB)!;
        return compare(versionB, versionA);
      }
    );
    while (unsatisfiedVersions.size > 0) {
      if (sortedBundleVersions.length === 0) {
        throw new Error(
          `unable to determine bundleHref to satisfy consumption ranges: ${[
            ...unsatisfiedVersions,
          ]
            .map((ver) => (pkgVersions?.get(ver))![0].range)
            .join()}`
        );
      }
      let [selectedBundleVer, consumedVersions] = sortedBundleVersions.shift()!;
      if (!unsatisfiedVersions.has(selectedBundleVer)) {
        continue; // we've already satisfied this, keep going
      }

      let verWithInvalidSemverRange = [...consumedVersions].find(
        (ver) => !validRange(pkgVersions?.get(ver)![0].range)
      );
      let invalidSemverRange = verWithInvalidSemverRange
        ? pkgVersions.get(verWithInvalidSemverRange)![0].range
        : undefined;
      if (invalidSemverRange && consumedVersions.size > 1) {
        throw new Error(
          `a non semver range '${invalidSemverRange}' satisfied more than one pkg version--this should be impossible. the satisfied packages are: ${[
            ...consumedVersions,
          ]
            .map((ver) => pkgHref + "/" + ver)
            .join(", ")}`
        );
      }

      let range: string;
      let obviatedVersions = [...consumedVersions].filter(
        (ver) => ver !== selectedBundleVer
      );
      if (invalidSemverRange) {
        range = invalidSemverRange;
      } else {
        range = rangeIntersection(
          ...[...consumedVersions].map((ver) => pkgVersions!.get(ver)![0].range)
        );
      }
      let bundleHrefs = Object.keys(
        groupBy(
          pkgVersions.get(selectedBundleVer)!,
          (resolution) => resolution.bundleHref
        )
      );
      let dupeSideEffectResolutions = groupBy(
        pkgVersions
          .get(selectedBundleVer)!
          .filter(
            (r) => r.type === "side-effect"
          ) as ResolvedSideEffectDependency[],
        (r) => r.consumedBy.url.href
      );
      // when there are duplicate resolutions, first we try to find the
      // resolution whose consumedBy is actually the bundleHref, if there
      // are none, then first one alphabetically by consumer href wins
      let winningSideEffectConsumer: string | undefined;
      let consumerHrefs = Object.keys(dupeSideEffectResolutions);
      if (consumerHrefs.length > 1) {
        winningSideEffectConsumer = consumerHrefs.find((consumerHref) =>
          bundleHrefs.includes(consumerHref)
        );
        // our own bundle as a consumer has the lowest priority
        consumerHrefs = consumerHrefs.filter((h) => h !== this.bundle.href);
        if (!winningSideEffectConsumer) {
          consumerHrefs.sort((a, b) => a.localeCompare(b));
          winningSideEffectConsumer = consumerHrefs.shift()!;
        }
      } else {
        winningSideEffectConsumer = consumerHrefs[0];
      }

      for (let resolution of pkgVersions.get(selectedBundleVer)!) {
        let obviatedResolutions = obviatedVersions
          .map((ver) =>
            pkgVersions?.get(ver)!.find((r) => {
              if (
                r.type !== "declaration" ||
                resolution.type !== "declaration"
              ) {
                return;
              }
              if (r.importedAs === "default") {
                return (
                  pkgInfoFromCatalogJsURL(new URL(r.source))?.modulePath &&
                  pkgInfoFromCatalogJsURL(new URL(resolution.source))
                    ?.modulePath
                );
              } else {
                return resolution.importedAs === r.importedAs;
              }
            })
          )
          .filter(Boolean) as ResolvedDependency[];
        let dupeResolutions = pkgVersions!
          .get(selectedBundleVer)!
          .filter(
            (r) =>
              r.type === "declaration" &&
              resolution.type === r.type &&
              resolution.source === r.source &&
              resolution.importedAs === r.importedAs
          );
        if (dupeResolutions.length > 1) {
          let rawRanges = [range, ...dupeResolutions.map((r) => r.range)];
          if (!rawRanges.some((r) => !validRange(r))) {
            // TODO need a more graceful way to deal with this
            range = rangeIntersection(
              range,
              ...dupeResolutions.map((r) => r.range)
            );
          }
          // when there are duplicate resolutions, first we try to find the
          // resolution whose consumedBy is actually the bundleHref, if there
          // are none, then first one alphabetically by consumer href wins
          let winningResolution = dupeResolutions.find(
            (r) => r.bundleHref === r.consumedBy.url.href
          );
          if (!winningResolution) {
            dupeResolutions.sort(
              ({ consumedBy: consumedByA }, { consumedBy: consumedByB }) =>
                consumedByA.url.href.localeCompare(consumedByB.url.href)
            );
            winningResolution = dupeResolutions.shift()!;
          }
          if (resolution !== winningResolution) {
            // you lost, we'll add you to the obviatedResolutions handle you there
            continue;
          }
          obviatedResolutions.push(...dupeResolutions);
        }
        if (
          resolution.type === "side-effect" &&
          resolution.consumedBy.url.href !== winningSideEffectConsumer
        ) {
          // you lost, we only keep track of the winning side effect resolutions
          // (there is no identity map for side effects)
          continue;
        }
        let finalResolution = { ...resolution, range };
        setDoubleNestedMapping(
          finalResolution.consumedBy.url.href,
          finalResolution.consumedByPointer,
          finalResolution,
          resolutionsForPkg
        );
        // also set resolution for the local declaration of imports
        if (
          finalResolution.type === "declaration" &&
          finalResolution.importedSource
        ) {
          setDoubleNestedMapping(
            finalResolution.importedSource.declaredIn.url.href,
            finalResolution.importedSource.pointer,
            {
              ...finalResolution,
              importedSource: undefined,
            },
            resolutionsForPkg
          );
        }
        for (let obviatedResolution of obviatedResolutions) {
          setDoubleNestedMapping(
            obviatedResolution.consumedBy.url.href,
            obviatedResolution.consumedByPointer,
            finalResolution,
            resolutionsForPkg
          );
        }
      }

      for (let ver of consumedVersions) {
        unsatisfiedVersions.delete(ver);
      }
    }

    this.consumptionCache.set(pkgHref, resolutionsForPkg);
  }
}

// In this function, there are scenarios that it will not always fully resolve
// the import, and when it does not we return the imported name of the module
// that we stopped at. Otherwise we return the local declaration name (the
// inside name) of the module we resolved. The goal is that the return value is
// transparent about how fully it was able to perform the resolution so that
// callers can reason more clearly around how to handle the results instead of
// having to reconcile an ambiguous situation (i.e. local names will never be
// NamespaceMarkers, or you may resolve to a module that is not even in this
// bundle).
function resolveDeclaration(
  importedName: string | NamespaceMarker,
  importedFromModule: Resolution,
  consumingModule: Resolution,
  ownAssignments: BundleAssignment[],
  declarationResolutionCache: DeclarationResolutionCache,
  depResolver: DependencyResolver | undefined,
  importedPointer?: RegionPointer // if you have this handy it saves work passing it in--otherwise we'll calculate it
): ResolvedResult | UnresolvedResult {
  let cacheKey = {
    importedName,
    importedFromModule: importedFromModule.url.href,
    consumingModule: consumingModule.url.href,
  };
  let cachedResult = declarationResolutionCache
    .get(cacheKey.consumingModule)
    ?.get(cacheKey.importedFromModule)
    ?.get(cacheKey.importedName);
  if (cachedResult) {
    return cachedResult;
  }

  function cacheResult(result: ResolvedResult | UnresolvedResult) {
    setTripleNestedMapping(
      cacheKey.consumingModule,
      cacheKey.importedFromModule,
      cacheKey.importedName,
      result,
      declarationResolutionCache
    );
  }

  let bundle = ownAssignments[0].bundleURL;
  importedPointer =
    importedPointer ??
    pointerForImport(
      importedName,
      importedFromModule,
      makeNonCyclic(consumingModule)
    );
  let resolution: ResolvedDeclarationDependency | undefined;
  if (importedPointer != null) {
    // if an import is performed, try to resolve the imported module to the
    // preferred pkg dep version
    let pkgURL = pkgInfoFromCatalogJsURL(importedFromModule.url)?.pkgURL;
    if (pkgURL && depResolver) {
      let _resolution = depResolver.resolutionByConsumptionRegion(
        consumingModule,
        importedPointer,
        pkgURL
      );
      assertDeclarationResolution(
        _resolution,
        importedName,
        importedFromModule,
        bundle
      );
      resolution = _resolution as ResolvedDeclarationDependency | undefined;
      if (resolution?.importedSource) {
        // the resolution is an import of a specific pkg version, use that
        // module as the basis for the importFrom module in the subsequent logic
        ({
          importedSource: { declaredIn: importedFromModule },
        } = resolution);
      } else if (resolution) {
        // the resolution is a local declaration from an incorporated bundle
        // (the actual import is the preferred pkg ver)
        let pointer = resolution.consumedByPointer;
        let region = resolution.consumedBy.desc.regions[pointer];
        assertLocalDeclarationRegion(region, resolution, bundle);
        let declaration = region.declaration;
        let declaredName = declaration.declaredName;
        let bindingName = isNamespaceMarker(resolution.importedAs)
          ? declaredName
          : resolution.importedAs;
        let result: ResolvedResult = {
          type: "resolved",
          module: resolution.consumedBy,
          importedAs: bindingName,
          declaredName,
          region,
          declaration,
          pointer,
          resolution,
        };
        cacheResult(result);
        return result;
      }
    }
  }

  if (isNamespaceMarker(importedName)) {
    // if the import is a namespace, we stop and return what we have
    let result: UnresolvedResult = {
      type: "unresolved",
      importedAs: importedName,
      importedFromModule: importedFromModule,
      consumingModule,
      importedPointer,
      importedRegion:
        importedPointer != null
          ? consumingModule.desc.regions[importedPointer]
          : undefined,
      resolution,
    };
    cacheResult(result);
    return result;
  }
  if (
    !ownAssignments.find(
      (a) => a.module.url.href === importedFromModule.url.href
    )
  ) {
    // if the import comes from another bundle, then stop and return what we
    // have, we are not crossing bundle boundaries
    let result: UnresolvedResult = {
      type: "unresolved",
      importedAs: importedName,
      importedFromModule: importedFromModule,
      consumingModule,
      importedPointer,
      importedRegion:
        importedPointer != null
          ? consumingModule.desc.regions[importedPointer]
          : undefined,
      resolution,
    };
    cacheResult(result);
    return result;
  }

  // follow the imported binding in its imported module
  let { module: sourceModule, desc: exportDesc } =
    getExportDesc(importedFromModule, importedName) ?? {};
  if (!sourceModule || !exportDesc) {
    throw new Error(
      `The module ${importedFromModule.url.href} has no export '${importedName}' while building bundle ${bundle.href}`
    );
  }
  if (
    !ownAssignments.find((a) => a.module.url.href === sourceModule!.url.href)
  ) {
    // In this case the imported module is actually in a different bundle.
    // because of export-all, we were not able to realize that until we tried to
    // resolve the export-all specifiers in getExportDesc().

    // TODO we could do better here at figuring out the consuming module--in
    // this case we only look one level deep in the "export *"" chain. this should
    // really be a stack...
    consumingModule =
      importedFromModule.url.href !== sourceModule.url.href
        ? importedFromModule
        : consumingModule;
    let importedPointer = pointerForImport(
      importedName,
      sourceModule,
      makeNonCyclic(consumingModule)
    );
    let result: UnresolvedResult = {
      type: "unresolved",
      importedAs: importedName,
      importedFromModule: sourceModule,
      consumingModule,
      importedPointer,
      importedRegion:
        importedPointer != null
          ? consumingModule.desc.regions[importedPointer]
          : undefined,
      resolution,
    };
    cacheResult(result);
    return result;
  }

  // check for pkg resolution as a merit of performing a reexport. reexports are
  // kind special because they have no local module scope--but we do capture
  // these code regions as possible consumption points for pkgs.
  if (depResolver && exportDesc.type === "reexport") {
    let pkgURL = pkgInfoFromCatalogJsURL(
      sourceModule.resolvedImports[exportDesc.importIndex].url
    )?.pkgURL;
    if (pkgURL) {
      let resolution = depResolver.resolutionByConsumptionRegion(
        sourceModule,
        exportDesc.exportRegion,
        pkgURL
      );
      assertDeclarationResolution(
        resolution,
        importedName,
        importedFromModule,
        bundle
      );
      if (resolution?.importedSource) {
        return resolveDeclaration(
          resolution.importedAs,
          resolution.importedSource.declaredIn,
          sourceModule,
          ownAssignments,
          declarationResolutionCache,
          depResolver,
          resolution.consumedByPointer
        );
      } else if (resolution) {
        let pointer = resolution.consumedByPointer;
        let region = resolution.consumedBy.desc.regions[pointer];
        assertLocalDeclarationRegion(region, resolution, bundle);
        let declaration = region.declaration;
        let declaredName = declaration.declaredName;
        if (isNamespaceMarker(resolution.importedAs)) {
          throw new Error("unimplemented");
        }
        let result: ResolvedResult = {
          type: "resolved",
          module: resolution.consumedBy,
          importedAs: resolution.importedAs,
          declaredName,
          region,
          declaration,
          pointer,
          resolution,
        };
        cacheResult(result);
        return result;
      }
    }
  }

  // Follow the reexports. we follow both the "export blah from x" and a more
  // verbose "import blah from x; export blah;" that introduces the binding into
  // the module scope.
  let { declarations } = sourceModule.desc;
  if (
    exportDesc?.type === "reexport" ||
    (exportDesc?.type === "local" &&
      declarations.get(exportDesc.name)?.declaration.type === "import")
  ) {
    if (exportDesc.type === "reexport") {
      return resolveDeclaration(
        exportDesc.name,
        sourceModule!.resolvedImports[exportDesc.importIndex],
        sourceModule,
        ownAssignments,
        declarationResolutionCache,
        depResolver,
        exportDesc.exportRegion
      );
    } else {
      let { declaration, pointer } = declarations.get(exportDesc.name)!;
      if (declaration.type === "local") {
        throw new Error(
          `bug: should never get here, the only declaration descriptions left are imports that are manually exported, in bundle ${bundle.href}`
        );
      }
      return resolveDeclaration(
        declaration.importedName,
        sourceModule!.resolvedImports[declaration.importIndex],
        sourceModule,
        ownAssignments,
        declarationResolutionCache,
        depResolver,
        pointer
      );
    }
  }

  // At this point we are narrowing in on a module's local declaration
  let { pointer, declaration } = declarations.get(exportDesc.name) ?? {};
  if (!declaration || pointer == null) {
    throw new Error(
      `The module ${sourceModule.url.href} exports '${importedName}' but there is no declaration region for the declaration of this export '${exportDesc.name}' in bundle ${bundle.href}`
    );
  }

  if (depResolver && declaration.type === "local" && declaration.original) {
    // if the local declaration has an original property, then there _must_ be a
    // pkg resolution for this declaration, so look it up and use the pkg
    // resolution for the results
    resolution = resolutionByDeclaration(
      declaration,
      sourceModule,
      pointer,
      depResolver
    )!; // this function will actually throw when a local desc that has an "original" is missing a resolution
    if (resolution.importedSource) {
      throw new Error(
        `was expecting the resolution for '${declaration.declaredName}' in the module ${sourceModule.url.href} while building bundle ${bundle.href} to _not_ have a "importedSource" property but it did.`
      );
    }
    let _module: Resolution;
    ({ consumedBy: _module, consumedByPointer: pointer } = resolution);
    sourceModule = makeNonCyclic(_module);
  } else if (depResolver) {
    // otherwise check to see if this consumption point has a pkg declaration
    let pkgURL = pkgInfoFromCatalogJsURL(sourceModule.url)?.pkgURL;
    if (pkgURL) {
      let maybeResolution = depResolver.resolutionByConsumptionRegion(
        sourceModule,
        pointer,
        pkgURL
      );
      assertDeclarationResolution(
        maybeResolution,
        exportDesc.name,
        sourceModule,
        bundle
      );
      if (maybeResolution) {
        resolution = maybeResolution;
      }
    }
  }

  // finally we can return the module's local declaration
  let region = sourceModule.desc.regions[pointer];
  if (region.type !== "declaration") {
    throw new Error(
      `bug: the resolved declaration for '${importedName}' from ${importedFromModule} in ${consumingModule} resulted in a non-declaration type code region: ${region.type} in bundle ${bundle.href}`
    );
  }
  let result: ResolvedResult = {
    type: "resolved",
    module: sourceModule,
    importedAs: importedName,
    declaredName: exportDesc.name,
    region,
    declaration,
    pointer,
    resolution,
  };
  cacheResult(result);
  return result;
}

function resolutionByDeclaration(
  declaration: DeclarationDescription,
  module: ModuleResolution,
  pointer: RegionPointer,
  depResolver: DependencyResolver
): ResolvedDeclarationDependency | undefined {
  let pkgURL: URL | undefined;
  if (declaration.type === "local" && declaration.original) {
    pkgURL = pkgInfoFromCatalogJsURL(new URL(declaration.original.bundleHref))
      ?.pkgURL;
    if (!pkgURL) {
      throw new Error(
        `Cannot determine pkgURL that corresponds to the bundle URL: ${declaration.original.bundleHref}`
      );
    }
  } else if (declaration.type === "import") {
    if (isNamespaceMarker(declaration.importedName)) {
      // namespaces are dealt with at the individual binding level
      return;
    }
    pkgURL = pkgInfoFromCatalogJsURL(
      module.resolvedImports[declaration.importIndex].url
    )?.pkgURL;
  }
  if (!pkgURL) {
    return undefined;
  }

  let resolution = depResolver.resolutionByConsumptionRegion(
    module,
    pointer,
    pkgURL
  );
  assertDeclarationResolution(resolution, declaration.declaredName, module);
  if (!resolution && declaration.type === "local" && declaration.original) {
    throw new Error(
      `cannot resolve "original" property of the declaration '${
        declaration.declaredName
      }' in the module ${
        module.url.href
      } to a dependency for a declaration (that is not imported), this should never happen. The "original" property is ${JSON.stringify(
        declaration.original
      )}`
    );
  }

  return resolution;
}

// the outer key of the map is the pkgHref, the inner key is the bundle version
type ConsumedDependencies = Map<string, Map<string, ResolvedDependency[]>>;

function gatherDependencies(
  dependencies: Dependencies,
  assignments: BundleAssignment[],
  lockEntries: LockEntries,
  lockFile: LockFile | undefined,
  bundle: URL
): ConsumedDependencies {
  // we use a separate cache here because we have not yet setup the dependency
  // resolution (that is actually the purpose of this function), so these
  // answers will be different than after the dependency resolution is ready
  let declarationResolutionCache: DeclarationResolutionCache = new Map();
  let consumedDeps: ConsumedDependencies = new Map();
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );
  let locks: Map<string, string> = new Map([
    ...Object.entries(lockFile ?? {}),
    ...new Map([...lockEntries.entries()].map(([k, v]) => [k, v.href])),
  ]);

  // first we gather up all the direct dependencies of the project from the lock
  // file--this has the benefit of listing out all the direct dependencies of
  // the project and their resolutions
  for (let [specifier, bundleHref] of locks) {
    let [pkgName, ...bundleParts] = specifier.split("/");
    if (pkgName.startsWith("@")) {
      pkgName = `${pkgName}/${bundleParts.shift()}`;
    }
    pkgName = pkgName.replace(/\$cjs\$$/, "");
    let pkgAssignment = assignments.find(
      (a) => a.module.url.href === bundleHref
    );
    if (!pkgAssignment) {
      continue;
    }
    let dependency = dependencies[pkgName];
    if (!dependency) {
      throw new Error(
        `unable to determine entrypoints.json dependency from the specifier '${specifier}' with resolution ${bundleHref} in bundle ${bundle.href}. Are you missing a dependency for '${pkgName}' in your entrypoints.json file?`
      );
    }
    for (let { module } of ownAssignments) {
      for (let pointer of module.desc.regions[documentPointer].dependsOn) {
        let region = module.desc.regions[pointer];
        if (region.type === "general") {
          addResolution(
            bundleHref,
            {
              type: "side-effect",
              consumedByPointer: pointer,
              consumedBy: module,
              range: dependency.range,
              bundleHref: bundleHref,
            },
            consumedDeps
          );
        }
      }
      for (let [exportName, exportDesc] of module.desc.exports) {
        if (exportDesc.type !== "reexport" || isExportAllMarker(exportName)) {
          continue;
        }
        // reexports are a form of consumption point for deps which you will not
        // find by scanning for declaration regions since reexported bindings
        // are not scoped to the module so we'll look in the export desc
        // specifically for them
        if (
          module.resolvedImports[exportDesc.importIndex].url.href !== bundleHref
        ) {
          continue;
        }
        let pkgModule = makeNonCyclic(
          module.resolvedImports[exportDesc.importIndex]
        );
        if (isNamespaceMarker(exportDesc.name)) {
          addResolution(
            bundleHref,
            {
              type: "declaration",
              importedSource: {
                pointer: undefined,
                declaredIn: pkgModule,
              },
              bundleHref,
              consumedBy: module,
              consumedByPointer: exportDesc.exportRegion,
              importedAs: NamespaceMarker,
              source: pkgModule.url.href,
              range: dependency.range,
            },
            consumedDeps
          );
          addResolutionsForNamespace(
            pkgModule,
            dependency,
            bundleHref,
            ownAssignments,
            consumedDeps,
            declarationResolutionCache
          );
        } else {
          let source = resolveDeclaration(
            exportDesc.name,
            pkgModule,
            module,
            ownAssignments,
            declarationResolutionCache,
            undefined
          );
          if (source.type === "unresolved") {
            throw new Error(
              `could not resolve declaration ${JSON.stringify(
                exportDesc.name
              )} in ${pkgModule.url.href} while assembling bundle ${
                bundle.href
              }`
            );
          }
          if (source.module.url.href !== pkgModule.url.href) {
            throw new Error(
              `the declaration ${JSON.stringify(exportDesc.name)} from ${
                pkgModule.url.href
              } resolved to an unexpected module ${
                source.module.url
              }. Expected this be declared in the module ${pkgModule.url.href}`
            );
          }
          if (source.declaration.type !== "local") {
            throw new Error(
              `the declaration region for ${source.declaration.declaredName} in module ${source.module.url.href} while making bundle ${bundle.href} was expected to be a local declaration, but it was an import`
            );
          }
          addResolution(
            bundleHref,
            {
              type: "declaration",
              importedSource: {
                pointer: source.pointer,
                declaredIn: pkgModule,
              },
              bundleHref,
              consumedBy: module,
              consumedByPointer: exportDesc.exportRegion,
              importedAs: exportDesc.name,
              source: source.declaration.source,
              range: dependency.range,
            },
            consumedDeps
          );
        }
      }
      for (let [pointer, region] of module.desc.regions.entries()) {
        if (region.type !== "declaration") {
          continue;
        }
        if (
          module.url.href === bundleHref &&
          region.declaration.type === "local" &&
          !region.declaration.original
        ) {
          addResolution(
            bundleHref,
            {
              type: "declaration",
              bundleHref,
              consumedBy: module,
              consumedByPointer: pointer,
              importedAs: region.declaration.declaredName,
              source: region.declaration.source,
              range: dependency.range,
            },
            consumedDeps
          );
        } else if (
          region.declaration.type === "import" &&
          module.resolvedImports[region.declaration.importIndex].url.href ===
            bundleHref
        ) {
          let source = resolveDeclaration(
            region.declaration.importedName,
            module.resolvedImports[region.declaration.importIndex],
            module,
            ownAssignments,
            declarationResolutionCache,
            undefined
          );
          if (source.type === "resolved") {
            if (source.declaration.type !== "local") {
              throw new Error(
                `the declaration region for ${source.declaration.declaredName} in module ${source.module.url.href} while making bundle ${bundle.href} was expected to be a local declaration, but it was an import`
              );
            }
            addResolution(
              bundleHref,
              {
                type: "declaration",
                importedSource: {
                  pointer: source.pointer,
                  declaredIn: makeNonCyclic(source.module),
                },
                bundleHref,
                consumedBy: module,
                consumedByPointer: pointer,
                importedAs: region.declaration.importedName,
                range: dependency.range,
                source: source.declaration.source,
              },
              consumedDeps
            );
          } else if (
            isNamespaceMarker(source.importedAs) &&
            ownAssignments.find(
              (a) =>
                a.module.url.href &&
                (source as UnresolvedResult).importedFromModule.url.href
            )
          ) {
            let importedFrom = makeNonCyclic(source.importedFromModule);
            addResolution(
              bundleHref,
              {
                type: "declaration",
                importedSource: {
                  pointer: undefined,
                  declaredIn: importedFrom,
                },
                bundleHref,
                consumedBy: module,
                consumedByPointer: pointer,
                importedAs: NamespaceMarker,
                range: dependency.range,
                source: importedFrom.url.href,
              },
              consumedDeps
            );
            addResolutionsForNamespace(
              importedFrom,
              dependency,
              bundleHref,
              ownAssignments,
              consumedDeps,
              declarationResolutionCache
            );
          }
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
    for (let [pointer, region] of module.desc.regions.entries()) {
      if (region.type !== "declaration" && region.original) {
        addResolution(
          region.original.bundleHref,
          {
            type: "side-effect",
            consumedByPointer: pointer,
            consumedBy: module,
            range: region.original.range,
            bundleHref: region.original.bundleHref,
          },
          consumedDeps
        );
      } else if (region.type === "declaration") {
        let { declaration } = region;
        if (declaration.type === "import") {
          continue;
        }
        if (declaration.original) {
          addResolution(
            declaration.original.bundleHref,
            {
              type: "declaration",
              consumedByPointer: pointer,
              consumedBy: module,
              importedAs: declaration.original.importedAs,
              range: declaration.original.range,
              bundleHref: declaration.original.bundleHref,
              source: declaration.source,
            },
            consumedDeps
          );
        }
      }
    }
  }

  return consumedDeps;
}

function addResolutionsForNamespace(
  module: ModuleResolution,
  dependency: Dependency,
  bundleHref: string,
  ownAssignments: BundleAssignment[],
  consumedDeps: ConsumedDependencies,
  declarationResolutionCache: DeclarationResolutionCache
) {
  let pkgURL = pkgInfoFromCatalogJsURL(new URL(bundleHref))!.pkgURL!;
  let exports = getExports(module);
  for (let [exportName, { module: sourceModule }] of exports.entries()) {
    let namespaceItemSource = resolveDeclaration(
      exportName,
      sourceModule,
      sourceModule,
      ownAssignments,
      declarationResolutionCache,
      undefined
    );
    if (namespaceItemSource.type === "resolved") {
      if (!namespaceItemSource.module.url.href.startsWith(pkgURL.href)) {
        // We have crossed a package boundary when trying to resolve the
        // individual consumption points for all the items in the
        // namespace.
        throw new Error(
          `unimplemented: crossed pkg boundary when trying to derive all the individual consumption points for the items of a namespace imported from ${module.url.href} of pkg ${pkgURL.href} consumed by bundle ${bundleHref}. The namespace object includes a declaration that originates from '${namespaceItemSource.declaredName}' of ${namespaceItemSource.module}`
        );
      }
      if (namespaceItemSource.declaration.type !== "local") {
        throw new Error(
          `the declaration region for ${namespaceItemSource.declaredName} in module ${namespaceItemSource.module.url.href} while making bundle ${ownAssignments[0].bundleURL.href} was expected to be a local declaration, but it was an import`
        );
      }
      addResolution(
        bundleHref,
        {
          type: "declaration",
          bundleHref,
          consumedBy: makeNonCyclic(namespaceItemSource.module),
          consumedByPointer: namespaceItemSource.pointer,
          importedAs: exportName,
          range: dependency.range,
          source: namespaceItemSource.declaration.source,
        },
        consumedDeps
      );
    } else if (
      isNamespaceMarker(namespaceItemSource.importedAs) &&
      ownAssignments.find(
        (a) =>
          a.module.url.href &&
          (namespaceItemSource as UnresolvedResult).importedFromModule.url.href
      )
    ) {
      addResolutionsForNamespace(
        makeNonCyclic(namespaceItemSource.importedFromModule),
        dependency,
        bundleHref,
        ownAssignments,
        consumedDeps,
        declarationResolutionCache
      );
    }
  }
}

function addResolution(
  bundleHref: string,
  resolution: ResolvedDependency,
  consumedDeps: ConsumedDependencies
) {
  let { pkgURL, version, hash } =
    pkgInfoFromCatalogJsURL(new URL(bundleHref)) ?? {};
  if (!pkgURL || !version || !hash) {
    throw new Error(
      `cannot derive pkgURL, version, and/or hash from bundle URL ${bundleHref}`
    );
  }
  let bundleVersion = `${version}/${hash}`;
  let consumedVersions = consumedDeps.get(pkgURL.href);
  if (!consumedVersions) {
    consumedVersions = new Map();
    consumedDeps.set(pkgURL.href, consumedVersions);
  }

  let consumed = consumedVersions.get(bundleVersion);
  if (!consumed) {
    consumed = [];
    consumedVersions.set(bundleVersion, consumed);
  }
  consumed.push(resolution);
}

export function resolutionForPkgDepDeclaration(
  module: ModuleResolution,
  bindingName: string,
  depResolver: DependencyResolver
): ResolvedDeclarationDependency | undefined {
  let { declaration: desc, pointer } =
    module.desc.declarations.get(bindingName) ?? {};
  if (!desc || pointer == null) {
    return;
  }
  let pkgURL: URL | undefined;
  if (desc.type === "local" && desc.original) {
    pkgURL = pkgInfoFromCatalogJsURL(new URL(desc.original.bundleHref))?.pkgURL;
  } else if (desc.type === "import") {
    pkgURL = pkgInfoFromCatalogJsURL(
      module.resolvedImports[desc.importIndex].url
    )?.pkgURL;
  }
  if (pkgURL) {
    return depResolver.resolutionByConsumptionRegion(
      module,
      pointer,
      pkgURL
    ) as ResolvedDeclarationDependency | undefined;
  }
  return;
}

function pointerForImport(
  importedAs: string | NamespaceMarker,
  importedFromModule: Resolution,
  consumingModule: ModuleResolution
): RegionPointer | undefined {
  let { declarations } = consumingModule.desc;
  let { pointer } =
    [...declarations.values()].find(
      ({ declaration }) =>
        declaration.type === "import" &&
        declaration.importedName === importedAs &&
        consumingModule.resolvedImports[declaration.importIndex].url.href ===
          importedFromModule.url.href
    ) ?? {};
  if (pointer == null) {
    ({ exportRegion: pointer } =
      [...consumingModule.desc.exports.values()].find(
        (e) =>
          ((e.type === "reexport" && e.name === importedAs) ||
            e.type === "export-all") &&
          consumingModule.resolvedImports[e.importIndex].url.href ===
            importedFromModule.url.href
      ) ?? {});
  }
  return pointer;
}

export function assertDeclarationResolution(
  resolution:
    | ResolvedSideEffectDependency
    | ResolvedDeclarationDependency
    | undefined,
  name: string | NamespaceMarker,
  module: Resolution
): asserts resolution is ResolvedDeclarationDependency | undefined;
export function assertDeclarationResolution(
  resolution:
    | ResolvedSideEffectDependency
    | ResolvedDeclarationDependency
    | undefined,
  name: string | NamespaceMarker,
  module: Resolution,
  bundle?: URL
): asserts resolution is ResolvedDeclarationDependency | undefined;
export function assertDeclarationResolution(
  resolution:
    | ResolvedSideEffectDependency
    | ResolvedDeclarationDependency
    | undefined,
  name: string | NamespaceMarker,
  module: Resolution,
  bundle?: URL
): asserts resolution is ResolvedDeclarationDependency | undefined {
  if (resolution?.type === "side-effect") {
    throw new Error(
      `the dependency resolution for ${JSON.stringify(name)}' in the module ${
        module.url.href
      } was a "side-effect" type of resolution. Was expecting a "declaration" type of resolution.${
        bundle ? " while building bundle " + bundle.href : ""
      }`
    );
  }
}

function assertLocalDeclarationRegion(
  region: CodeRegion,
  resolution: ResolvedDeclarationDependency,
  bundle: URL
): asserts region is DeclarationCodeRegion {
  if (region.type !== "declaration") {
    throw new Error(
      `expected region to be a declaration region for ${JSON.stringify(
        resolution.importedAs
      )} from module ${resolution?.consumedBy.url.href} region pointer ${
        resolution?.consumedByPointer
      } in bundle ${bundle.href}, but it was ${JSON.stringify(
        region,
        stringifyReplacer
      )}`
    );
  }
  assertLocalDeclarationDescription(
    region.declaration,
    region,
    resolution,
    bundle
  );
}

function assertLocalDeclarationDescription(
  desc: DeclarationDescription,
  region: CodeRegion,
  resolution: ResolvedDeclarationDependency,
  bundle: URL
): asserts desc is LocalDeclarationDescription {
  if (desc.type !== "local") {
    throw new Error(
      `expected declaration region to have a local declaration type for ${JSON.stringify(
        resolution.importedAs
      )} from module ${resolution?.consumedBy.url.href} region pointer ${
        resolution?.consumedByPointer
      } in bundle ${bundle.href}, but it was ${JSON.stringify(
        region,
        stringifyReplacer
      )}`
    );
  }
}
