import { BuilderNode, NextNode, RecipeGetter, Value } from "./common";
import { makeNonCyclic, ModuleResolution, Resolution } from "./resolution";
import { getExportDesc, ModuleDescription } from "../describe-file";
import { isNamespaceMarker, RegionPointer } from "../code-region";
import { BundleAssignment, BundleAssignmentsNode } from "./bundle";
import { HeadState } from "../module-rewriter";
import { AppendModuleNode, FinishAppendModulesNode } from "./append-module";
import { Dependencies } from "./entrypoint";
import {
  DependencyResolver,
  resolutionForPkgDepDeclaration,
  ResolvedDependency,
  ResolvedDeclarationDependency,
} from "../dependency-resolution";
import { GetLockFileNode, LockEntries, LockFile } from "./lock-file";
import { log } from "../logger";
import { RegionWalker } from "../region-walker";
import { pkgInfoFromCatalogJsURL } from "../resolver";

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

  async run(
    {
      info: { assignments, resolutionsInDepOrder, lockFile },
    }: {
      info: {
        assignments: BundleAssignment[];
        resolutionsInDepOrder: ModuleResolution[];
        lockFile: LockFile | undefined;
      };
    },
    getRecipe: RecipeGetter
  ): Promise<NextNode<{ code: string; desc: ModuleDescription }>> {
    let ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );
    let resolutionRecipes: { [specifier: string]: string } | undefined;
    let { pkgName: sourcePkgName, version: sourcePkgVersion } =
      pkgInfoFromCatalogJsURL(this.bundle) ?? {};
    if (sourcePkgName && sourcePkgVersion) {
      resolutionRecipes = (await getRecipe(sourcePkgName, sourcePkgVersion))
        ?.resolutions;
    }
    let depResolver = new DependencyResolver(
      this.dependencies,
      assignments,
      resolutionsInDepOrder,
      this.lockEntries,
      lockFile,
      resolutionRecipes,
      this.bundle
    );

    let exposed = exposedRegions(this.bundle, assignments, depResolver);
    let walker = new RegionWalker(
      exposed,
      this.bundle,
      ownAssignments,
      resolutionsInDepOrder,
      depResolver
    );

    let { editors } = walker;

    if (editors.length > 10) {
      let modules: Set<string> = new Set();
      for (let { module } of editors) {
        modules.add(module.url.href);
      }
      log(
        `  using ${editors.length} editors (${modules.size} unique modules) for bundle ${this.bundle.href}`
      );
    }

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
          if (isNamespaceMarker(resolution.name)) {
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
          original = resolution.name;
          module = resolution.consumedBy;
          importedFrom = resolution.importedSource.declaredIn;
        }
      }

      let source = depResolver.resolveDeclaration(
        original,
        importedFrom,
        sourceModule
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
