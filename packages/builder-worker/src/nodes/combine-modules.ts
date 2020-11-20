import { BuilderNode, NextNode } from "./common";
import { makeNonCyclic, ModuleResolution, Resolution } from "./resolution";
import { getExports, ModuleDescription } from "../describe-file";
import {
  documentPointer,
  isNamespaceMarker,
  RegionEditor,
  RegionPointer,
} from "../code-region";
import { BundleAssignment, BundleAssignmentsNode } from "./bundle";
import { HeadState, resolveDeclaration } from "../module-rewriter";
import { AppendModuleNode } from "./append-module";
import { Dependencies } from "./entrypoint";

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
    let headState = new HeadState(moduleResolutions);
    for (let module of moduleResolutions) {
      editors.set(
        module.url.href,
        new RegionEditor(module.source, module.desc)
      );
    }
    let ownAssignments = assignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );
    for (let { pointer, module } of exposed) {
      discoverIncludedRegions(
        this.bundle,
        module,
        pointer,
        editors,
        ownAssignments
      );
    }

    // TODO need to select most compatible version of duplicate code based on
    // consumed semver ranges. This means that we might need to adjust the
    // included code regions accordingly.

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

function discoverIncludedRegions(
  bundle: URL,
  module: Resolution,
  pointer: RegionPointer,
  editors: Map<string, RegionEditor>,
  ownAssignments: BundleAssignment[]
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
        ownAssignments
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
          ownAssignments
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
  } else {
    editors.get(module.url.href)!.keepRegion(pointer);
  }
  for (let depPointer of region.dependsOn) {
    discoverIncludedRegions(
      bundle,
      module,
      depPointer,
      editors,
      ownAssignments
    );
  }
}

function discoverIncludedRegionsForNamespace(
  bundle: URL,
  module: Resolution,
  editors: Map<string, RegionEditor>,
  ownAssignments: BundleAssignment[]
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
        ownAssignments
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
          ownAssignments
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
