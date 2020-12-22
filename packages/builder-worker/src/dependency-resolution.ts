import {
  makeNonCyclic,
  ModuleResolution,
  Resolution,
} from "./nodes/resolution";
import {
  isNamespaceMarker,
  NamespaceMarker,
  RegionPointer,
} from "./code-region";
import { BundleAssignment } from "./nodes/bundle";
import { resolveDeclaration, UnresolvedResult } from "./module-rewriter";
import { Dependencies, Dependency } from "./nodes/entrypoint";
import { pkgInfoFromCatalogJsURL } from "./resolver";
import { satisfies, coerce, compare, validRange } from "semver";
import { LockEntries, LockFile } from "./nodes/lock-file";
import { setMapping, rangeIntersection } from "./utils";
import { getExports, isExportAllMarker } from "./describe-file";
import { difference, flatMap } from "lodash";

export class DependencyResolver {
  private consumedDeps: ConsumedDependencies;
  // pkgHref => consumingModuleHref => consumingRegion => ResolvedDependency
  private consumptionCache: Map<
    string,
    Map<string, Map<RegionPointer, ResolvedDependency>>
  >;
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
    this.consumptionCache = new Map();
  }

  resolutionsByConsumingModule(
    pkg: URL,
    consumedBy: Resolution
  ): ResolvedDependency[] {
    let pkgHref = pkg.href;
    let resolutionsForPkg = this.getResolutionsForPkg(pkgHref);
    return [...(resolutionsForPkg?.get(consumedBy.url.href)?.values() ?? [])];
  }

  resolutionByConsumptionPoint(
    pkg: URL,
    consumedBy: Resolution,
    consumedByPointer: RegionPointer
  ): ResolvedDependency | undefined {
    let pkgHref = pkg.href;
    let resolutionsForPkg = this.getResolutionsForPkg(pkgHref);
    return resolutionsForPkg?.get(consumedBy.url.href)?.get(consumedByPointer);
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

    for (let bundleVersion of pkgVersions.keys()) {
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

      for (let resolution of pkgVersions.get(selectedBundleVer)!) {
        let obviatedResolutions = obviatedVersions
          .map((ver) =>
            pkgVersions
              ?.get(ver)!
              .find(
                (r) =>
                  r.type === "declaration" &&
                  resolution.type === r.type &&
                  r.importedAs === resolution.importedAs
              )
          )
          .filter(Boolean) as ResolvedDependency[];
        let dupeResolutions = pkgVersions!
          .get(selectedBundleVer)!
          .filter(
            (r) =>
              r.type === "declaration" &&
              resolution.type === r.type &&
              resolution.importedAs === r.importedAs
          );
        if (dupeResolutions.length > 1) {
          range = rangeIntersection(
            range,
            ...dupeResolutions.map((r) => r.range)
          );
          dupeResolutions.sort(
            ({ consumedBy: consumedByA }, { consumedBy: consumedByB }) =>
              consumedByA.url.href.localeCompare(consumedByB.url.href)
          );
          // when there are duplicate resolutions, the first one
          // alphabetically by consumer href wins
          if (resolution !== dupeResolutions.shift()) {
            // you lost, we'll add you to the obviatedResolutions handle you there
            continue;
          }
          obviatedResolutions.push(...dupeResolutions);
        }
        let finalResolution = { ...resolution, range };
        setMapping(
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
          setMapping(
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
          setMapping(
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
    pointer: RegionPointer;
    declaredIn: ModuleResolution;
  };
  importedAs: string | NamespaceMarker;
}
export interface ResolvedSideEffectDependency extends DependencyBase {
  type: "side-effect";
}

type ConsumedDependencies = Map<string, Map<string, ResolvedDependency[]>>; // the outer key of the map is the pkgHref, the inner key is the bundle version

function gatherDependencies(
  dependencies: Dependencies,
  assignments: BundleAssignment[],
  lockEntries: LockEntries,
  lockFile: LockFile | undefined,
  bundle: URL
): ConsumedDependencies {
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
          addResolutionsForNamespace(
            pkgModule,
            dependency,
            bundleHref,
            ownAssignments,
            consumedDeps
          );
        } else {
          let source = resolveDeclaration(
            exportDesc.name,
            pkgModule,
            module,
            ownAssignments,
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
              range: dependency.range,
            },
            consumedDeps
          );
        }
      }
      for (let [pointer, region] of module.desc.regions.entries()) {
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
          ownAssignments,
          undefined
        );
        if (source.type === "resolved") {
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
          addResolutionsForNamespace(
            makeNonCyclic(source.importedFromModule),
            dependency,
            bundleHref,
            ownAssignments,
            consumedDeps
          );
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
  consumedDeps: ConsumedDependencies
) {
  let pkgURL = pkgInfoFromCatalogJsURL(new URL(bundleHref))!.pkgURL!;
  let exports = getExports(module);
  for (let [exportName, { module: sourceModule }] of exports.entries()) {
    let namespaceItemSource = resolveDeclaration(
      exportName,
      sourceModule,
      sourceModule,
      ownAssignments,
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
      addResolution(
        bundleHref,
        {
          type: "declaration",
          bundleHref,
          consumedBy: makeNonCyclic(namespaceItemSource.module),
          consumedByPointer: namespaceItemSource.pointer,
          importedAs: exportName,
          range: dependency.range,
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
        consumedDeps
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
    return depResolver.resolutionByConsumptionPoint(pkgURL, module, pointer) as
      | ResolvedDeclarationDependency
      | undefined;
  }
  return;
}
