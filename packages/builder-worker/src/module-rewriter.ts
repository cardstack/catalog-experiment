import {
  isCyclicModuleResolution,
  makeNonCyclic,
  ModuleResolution,
  Resolution,
} from "./nodes/resolution";
import {
  getExports,
  isExportAllMarker,
  ExportAllExportDescription,
} from "./describe-file";
import {
  isNamespaceMarker,
  NamespaceMarker,
  DeclarationCodeRegion,
  CodeRegion,
  RegionPointer,
  DeclarationDescription,
  documentPointer,
} from "./code-region";
import { RegionEditor } from "./region-editor";
import { BundleAssignment } from "./nodes/bundle";
import stringify from "json-stable-stringify";
// @ts-ignore
import fastStringify from "fast-stable-stringify";
import {
  setDoubleNestedMapping,
  stringifyReplacer as replacer,
  stringifyReplacer,
} from "./utils";
import { depAsURL, Dependencies } from "./nodes/entrypoint";
import {
  DependencyResolver,
  ResolvedDeclarationDependency,
  ResolvedResult,
  UnresolvedResult,
} from "./dependency-resolution";
import { maybeRelativeURL } from "./path";
import { pkgInfoFromCatalogJsURL } from "./resolver";
import MurmurHash from "imurmurhash";

export interface Editor {
  editor: RegionEditor;
  module: ModuleResolution;
}

export class HeadState {
  readonly usedNames: Map<
    string,
    { moduleHref: string; name: string }
  > = new Map();
  // this is an inverted usedNames, where the outer key is the moduleHref, the
  // inner key is the old name and the inner value is the assigned name
  readonly nameAssignments: Map<string, Map<string, string>> = new Map();
  // outer map is the href of the exported module. the inner map goes from
  // exported name to our name. our name also must appear in usedNames.
  readonly assignedImportedNames: Map<
    string,
    Map<string | NamespaceMarker, string>
  > = new Map();
  // because module regions may be splatted across a bundle due to the way we
  // discover and assign editors for regions a local declaration may be
  // separated from its reference in multiple editors for the same module. To
  // make sure everything lines up, we track local declarations in the same way
  // that we track imported declarations. This structure is moduleHref =>
  // originalName => assignedName
  readonly assignedLocalNames: Map<string, Map<string, string>> = new Map();
  // this is a map of manufactured namespace objects' assigned names to their a
  // map of the keys in the namespace object (the outside name) with values that
  // are the inside names for the corresponding keys
  readonly assignedNamespaces: Map<
    string,
    {
      nameMap: Map<string, string>;
      importedModule: Resolution;
      resolution: ResolvedDeclarationDependency | undefined;
    }
  > = new Map();
  // this is a map of the module in which to perform the namespace member
  // assignments. Normally the namespace members are assigned right before the
  // module in which they are consumed as part of the namespace declaration.
  // However, if the namespace is part of a cyclic module resolution, then we'll
  // assign the namespace members after the module that consumes the cycle. The
  // key is the module in which we perform the namespace member assignments, and
  // the value is the a map of assigned names for names space objects to a map of
  // inner and outer names for that namespace assignment.
  // assignmentModuleHref => assignedName => outer member name => inner member value
  readonly namespaceMemberAssignment: Map<
    string,
    Map<string, Map<string, string>>
  > = new Map();
  readonly assignedDependencyBindings: Map<
    string,
    {
      bundleHref: string;
      range: string;
      importedAs: string | NamespaceMarker;
    }
  > = new Map();
  // This is a map of the modules that export a single binding multiple times.
  // This is important info for the consumers of the exports to understand so that
  // we don't assign a binding to conflicting names when consumers use different
  // exports that resolve back to the same binding (since consumers drive the
  // assigned names for bindings). The outer key is the module that exports the
  // binding, the inner key is the export name, and the value are all the other
  // export names associated with the binding
  readonly multiExportedBindings: Map<string, Map<string, string[]>>;

  // Because there can be multiple editors per module, we really only want to
  // perform name assignment just once per module, so we use this set to keep
  // track of the modules that have already had name assignment performed.
  readonly assignedModules: Set<string> = new Set();

  // This is a map of all the initializedBy regions so that we can marry up the
  // regions to their declarations in the resulting bundle.
  // moduleHref =>  assignedName => initializers
  readonly assignedDeclarationInitializers: Map<
    string,
    Map<string, RegionPointer[]>
  > = new Map();

  readonly visited: Editor[] = [];
  private queue: Editor[] = [];
  private regionHashes: Map<string, number> = new Map();
  readonly editorCount: number;

  constructor(editors: Editor[]) {
    // we reverse the order of the modules to append such that we first emit the
    // modules that are closest to the entrypoint and work our way towards the
    // deps. This way the bindings that are closest to the entrypoints have the
    // greatest chance of retaining their names and the bindings toward the
    // dependencies will more likely be renamed. This also means that we'll be
    // writing modules into the bundle in reverse order--from the bottom up.
    this.queue = [...editors].reverse();
    this.multiExportedBindings = this.discoverMultipleExports();
    this.editorCount = editors.length;
  }

  next(): Editor | undefined {
    let next = this.queue.shift();
    if (next) {
      this.visited.unshift(next);
    }
    return next;
  }

  hash(): string {
    let {
      usedNames,
      assignedImportedNames,
      assignedDependencyBindings,
      assignedLocalNames,
      visited,
      assignedNamespaces,
      assignedModules,
      namespaceMemberAssignment,
      assignedDeclarationInitializers,
      queue,
    } = this;
    // Creating summary objects, as otherwise the nesting nature of
    // ModuleResolutions makes the resulting object too large to stringify in V8
    // for big packages like lodash, resulting in memory issues.
    // fast-stable-stringify is much faster than stable-stringify, however, it
    // has no replacer capability. So we use fast-stable-stringify to stringify
    // the largest part of the state (CodeRegions), which fortunately have no
    // crucial state that needs stringify replacers. We also hash as we go,
    // since there are issues when you try to hash too large of an object--we
    // are using the fastest hashing algorithm available--it's 32 bytes, which
    // should be adequate for our needs. For everything else, the replacers are
    // crucial in order to represent the state, so we use the slower stable
    // stringify.
    //
    let visitedSummary = visited.map(({ module, editor }) => ({
      url: module.url.href,
      regions: this.getRegionsHash(module),
      dispositions: MurmurHash(fastStringify(editor.dispositions)).result(),
    }));
    let queueSummary = queue.map(({ module, editor }) => ({
      url: module.url.href,
      regions: this.getRegionsHash(module),
      dispositions: MurmurHash(fastStringify(editor.dispositions)).result(),
    }));
    let assignedNamespacesSummary = [...assignedNamespaces].map(([k, v]) => [
      k,
      v.nameMap,
    ]);
    let str = stringify(
      {
        usedNames,
        assignedImportedNames,
        assignedDependencyBindings,
        assignedLocalNames,
        visitedSummary,
        assignedNamespacesSummary,
        assignedModules,
        namespaceMemberAssignment,
        assignedDeclarationInitializers,
        queueSummary,
      },
      {
        replacer,
      }
    );

    let hash = MurmurHash(str).result().toString();
    return hash;
  }

  private getRegionsHash(module: ModuleResolution): number {
    let hash = this.regionHashes.get(module.url.href);
    if (hash != null) {
      return hash;
    }
    hash = module.desc.regions
      .reduce((hashState, r) => hashState.hash(fastStringify(r)), MurmurHash())
      .result();
    this.regionHashes.set(module.url.href, hash);
    return hash;
  }

  private discoverMultipleExports() {
    let multipleExports: Map<string, Map<string, string[]>> = new Map();
    for (let { module } of this.queue) {
      let exportedBindings = [...getExports(module)].reduce(
        (
          exportedBindings,
          [
            exportName,
            {
              desc: { name: scopedName },
            },
          ]
        ) => {
          if (isNamespaceMarker(scopedName)) {
            return exportedBindings;
          }
          let exportedNames = exportedBindings.get(scopedName);
          if (!exportedNames) {
            exportedNames = [];
            exportedBindings.set(scopedName, exportedNames);
          }
          exportedNames.push(exportName);
          return exportedBindings;
        },
        new Map<string, string[]>()
      );
      for (let exportedNames of exportedBindings.values()) {
        if (exportedNames.length < 2) {
          continue;
        }
        for (let exportedName of exportedNames) {
          setDoubleNestedMapping(
            module.url.href,
            exportedName,
            exportedNames,
            multipleExports
          );
        }
      }
    }
    return multipleExports;
  }
}

export class ModuleRewriter {
  private ownAssignments: BundleAssignment[];
  readonly namespacesAssignments: string[] = [];

  constructor(
    private bundle: URL,
    readonly module: ModuleResolution,
    private state: HeadState,
    private bundleAssignments: BundleAssignment[],
    readonly editor: RegionEditor,
    private dependencies: Dependencies,
    private depResolver: DependencyResolver
  ) {
    this.ownAssignments = bundleAssignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );

    if (!this.state.assignedModules.has(this.module.url.href)) {
      this.rewriteScope();
      this.assignInternalExportAllNames();
      this.state.assignedModules.add(this.module.url.href);
    } else {
      this.setAssignedNames();
    }

    // This is based on included regions in the editor, so we need to always
    // invoke this even if names for this module have been assigned.
    this.makeNamespaceMappings();
    this.assignSpecifiersForDynamicImports();
  }

  serialize(): {
    code: string;
    regions: CodeRegion[];
    regionMapping: Map<RegionPointer, RegionPointer>;
  } {
    let { code, regions, regionMapping } = this.editor.serialize();
    for (let region of regions.filter(
      (r) => r.type === "declaration"
    ) as DeclarationCodeRegion[]) {
      if (region.declaration.type === "import") {
        continue;
      }
      if (!region.declaration.original) {
        // initialize the declaration origin from the entrypoints.json
        // dependencies
        let consumptionInfo = this.state.assignedDependencyBindings.get(
          region.declaration.declaredName
        );
        if (consumptionInfo) {
          region.declaration.original = { ...consumptionInfo };
        }
      }
    }
    return { code, regions, regionMapping };
  }

  setAssignedNames(): void {
    if (!this.state.assignedModules.has(this.module.url.href)) {
      throw new Error(
        `cannot set assigned names for a module if rewriteScope() has not yet been invoked for this module, ${this.module.url.href} in the bundle ${this.bundle.href}`
      );
    }

    let assignments = this.state.nameAssignments.get(this.module.url.href);
    if (assignments?.size === 0) {
      return;
    }

    for (let region of this.module.desc.regions) {
      if (region.type !== "declaration") {
        continue;
      }
      let {
        declaration: { declaredName: originalName },
      } = region;
      let assignedName = assignments?.get(originalName);
      if (!assignedName) {
        throw new Error(
          `name assignment has already been performed for this module, but can not find name assignment for ${JSON.stringify(
            originalName
          )} in module ${this.module.url.href} for bundle ${this.bundle.href}`
        );
      }
      this.editor.rename(originalName, assignedName);
    }
  }

  rewriteScope(): void {
    let { declarations } = this.module.desc;
    if (!declarations) {
      return;
    }

    for (let [localName, { pointer, declaration: localDesc }] of declarations) {
      let assignedName: string | undefined;
      if (
        localDesc.type === "import" ||
        (localDesc.type === "local" && localDesc.original)
      ) {
        if (localDesc.type === "import") {
          let importedModule = makeNonCyclic(this.module).resolvedImports[
            localDesc.importIndex
          ];
          let pkgURL = pkgInfoFromCatalogJsURL(importedModule.url)?.pkgURL;
          let outerResolution = pkgURL
            ? this.depResolver.resolutionByConsumptionRegion(
                this.module,
                pointer,
                pkgURL
              )
            : undefined;
          let source = this.depResolver.resolveDeclaration(
            localDesc.importedName,
            importedModule,
            this.module,
            pointer
          );
          assignedName = this.maybeAssignImportNameFromResolution(
            source,
            localName
          );
          if (
            (source.type === "resolved" ||
              (this.ownAssignments.find(
                (a) =>
                  a.module.url.href ===
                  (source as UnresolvedResult).importedFromModule.url.href
              ) &&
                isNamespaceMarker(source.importedAs))) &&
            outerResolution?.type === "declaration"
          ) {
            setDoubleNestedMapping(
              outerResolution.source,
              isNamespaceMarker(outerResolution.name)
                ? NamespaceMarker
                : outerResolution.name,
              assignedName,
              this.state.assignedImportedNames
            );
          }
          if (
            source.resolution &&
            assignedName &&
            source.resolution.type === "declaration" &&
            !isNamespaceMarker(source.resolution.name)
          ) {
            // we deal with setting the namespace assigned import deps in the
            // makeNamespaceMappings()
            this.state.assignedDependencyBindings.set(assignedName, {
              bundleHref: source.resolution.bundleHref,
              range: source.resolution.range,
              importedAs: source.resolution.name,
            });
          }
        } else if (localDesc.type === "local" && localDesc.original) {
          let resolution = this.depResolver.resolutionByDeclaration(
            localDesc,
            this.module,
            pointer
          )!; // this function actually throws when a local desc with an original does not have a resolution
          assignedName = this.maybeAssignImportName(
            resolution.source,
            resolution.name,
            localName
          );
        }
      } else {
        // check to see if the binding was actually already assigned by a module
        // that imports it
        let resolution = this.depResolver.resolutionByConsumptionRegion(
          this.module,
          pointer
        );
        if (
          resolution &&
          resolution.type === "declaration" &&
          !isNamespaceMarker(resolution.name)
        ) {
          let { bundleHref, range, name: importedAs, source } = resolution;
          assignedName = this.maybeAssignImportName(
            source,
            resolution.name,
            localName
          );
          this.state.assignedDependencyBindings.set(assignedName, {
            bundleHref,
            range,
            importedAs,
          });
        } else {
          let [exportName, { module: sourceModule }] = [
            ...getExports(this.module),
          ].find(
            ([_, { desc }]) => desc.type === "local" && desc.name === localName
          ) ?? [undefined, {}];
          let suggestedName = localName === "default" ? "_default" : localName;
          if (exportName && sourceModule) {
            assignedName = this.maybeAssignImportName(
              sourceModule.url.href,
              exportName,
              suggestedName
            );
          }
          if (!assignedName) {
            if (
              this.module.desc.regions[documentPointer].dependsOn.has(
                pointer
              ) &&
              this.isUnconsumed(localDesc, pointer)
            ) {
              assignedName = this.maybeAssignLocalName(
                localName,
                `unused_${localName}`
              );
            } else {
              // this is just a plain jane local internal declaration. it may or
              // may not actually be a region that we keep, as there could be
              // multiple module rewriters for the same module. To keep everything
              // straight, check our state to see if we have already assigned a
              // name for this binding.
              assignedName = this.maybeAssignLocalName(localName);
            }
          }
        }
      }
      if (!assignedName) {
        throw new Error(
          `unable to assign name to the binding '${localName}' in module ${this.module.url.href} when constructing bundle ${this.bundle.href}`
        );
      }
      this.claimAndRename(localName, assignedName);
      if (localDesc.type === "local") {
        setDoubleNestedMapping(
          this.module.url.href,
          assignedName,
          localDesc.initializedBy,
          this.state.assignedDeclarationInitializers
        );
      }
    }
  }

  private assignSpecifiersForDynamicImports() {
    let myAssignment = this.ownAssignments.find(
      (a) => a.module.url.href === this.module.url.href
    )!;
    for (let [pointer, region] of this.module.desc.regions.entries()) {
      if (region.type !== "import" || !region.isDynamic) {
        continue;
      }
      let specifierPointer = [...region.dependsOn][0]; // all dynamic import regions depend solely on their specifier region
      if (specifierPointer == null) {
        throw new Error(
          `the specifier pointer for the dynamic import region is not specified. '${pointer}' in ${
            this.module.url.href
          } within bundle ${this.bundle.href}: region=${JSON.stringify(
            region,
            stringifyReplacer
          )}`
        );
      }
      let importedModule = this.module.resolvedImports[region.importIndex];
      let importAssignment = this.bundleAssignments.find(
        (a) => a.module.url.href === importedModule.url.href
      );
      if (!importAssignment) {
        throw new Error(
          `could not find bundle assignment for dynamically imported module ${importedModule.url.href} in ${this.module.url.href} within bundle ${this.bundle.href}`
        );
      }
      let specifier = `"${maybeRelativeURL(
        importAssignment.bundleURL,
        myAssignment?.bundleURL
      )}"`;
      this.editor.replace(specifierPointer, specifier);
    }
  }

  // assign names for "export *" of external bundles that need to be converted
  // into namespace imports so as not to alter the bundle's API, which we only
  // consider in non-entrypoint modules
  private assignInternalExportAllNames() {
    if (
      this.ownAssignments[0].entrypointModuleURL.href !== this.module.url.href
    ) {
      let externalExportAlls = [...this.module.desc.exports]
        .filter(
          ([exportName, exportDesc]) =>
            isExportAllMarker(exportName) &&
            exportDesc.type === "export-all" &&
            !this.ownAssignments.find(
              (a) =>
                a.module.url.href ===
                this.module.resolvedImports[exportDesc.importIndex].url.href
            )
        )
        .map(([, exportDesc]) => exportDesc) as ExportAllExportDescription[];
      for (let [index, exportAll] of externalExportAlls.entries()) {
        let importedModule = this.module.resolvedImports[exportAll.importIndex];
        this.maybeAssignImportName(
          importedModule.url.href,
          NamespaceMarker,
          `_namespace${index}`
        );
      }
    }
  }

  private makeNamespaceMappings() {
    for (let pointer of this.editor.includedRegions()) {
      let region = this.module.desc.regions[pointer];
      let importedModule: Resolution | undefined;
      let resolvedImportedModule: Resolution | undefined;
      let assignedName: string | undefined;

      if (
        region.type === "declaration" &&
        region.declaration.type === "import"
      ) {
        let { declaration: desc } = region;
        importedModule = this.module.resolvedImports[desc.importIndex];
        let source = this.depResolver.resolveDeclaration(
          desc.importedName,
          importedModule,
          this.module
        );

        if (source.type === "resolved") {
          continue;
        }
        resolvedImportedModule = source.importedFromModule;
        if (
          !this.ownAssignments.find(
            (a) => a.module.url.href === resolvedImportedModule!.url.href
          )
        ) {
          continue;
        }
        assignedName = this.state.assignedImportedNames
          .get(resolvedImportedModule.url.href)
          ?.get(NamespaceMarker);
      } else if (region.type === "import" && region.exportType === "reexport") {
        let [exportName, exportDesc] =
          [...this.module.desc.exports].find(
            ([, exportDesc]) =>
              exportDesc.type === "reexport" &&
              exportDesc.exportRegion === pointer
          ) ?? [];
        if (!exportName || !exportDesc || exportDesc.type !== "reexport") {
          throw new Error(
            `cannot identify export description for the reexport region ${pointer} in module ${this.module.url.href} when making bundle ${this.bundle.href}`
          );
        }
        if (
          !isNamespaceMarker(exportDesc.name) ||
          isExportAllMarker(exportName)
        ) {
          continue;
        }
        importedModule = this.module.resolvedImports[exportDesc.importIndex];
        resolvedImportedModule = importedModule;
        if (
          !this.ownAssignments.find(
            (a) => a.module.url.href === importedModule!.url.href
          )
        ) {
          continue;
        }
        assignedName = this.maybeAssignImportName(
          importedModule.url.href,
          NamespaceMarker,
          exportName
        );
      } else {
        continue;
      }

      // This is the region that we were using as a signal that this namespace
      // should be in the bundle, now let's actually remove it.
      this.editor.removeRegionAndItsChildren(pointer);

      if (!assignedName) {
        throw new Error(
          `There is no name assignment for the namespace import of ${resolvedImportedModule.url.href} in module ${this.module.url.href}`
        );
      }
      let nameMap: Map<string, string> = new Map(); // outside name => inside name
      let dep = Object.values(this.dependencies).find((dep) =>
        importedModule!.url.href.includes(depAsURL(dep).href)
      );
      let resolution: ResolvedDeclarationDependency | undefined;
      let pkgURL = pkgInfoFromCatalogJsURL(importedModule.url)?.pkgURL;
      if (pkgURL) {
        let _resolution = this.depResolver.resolutionByConsumptionRegion(
          this.module,
          pointer,
          pkgURL
        );
        if (_resolution?.type === "declaration") {
          resolution = _resolution;
        }
      }

      // generally we'll serialize the namespace object's member assignments right
      // before we serialize the module in which they are consumed. However, if
      // the module is part of a cycle, we'll serialize the assignments right
      // after the module that consumes the cycle.
      let namespaceAssignmentHref: string;
      if (isCyclicModuleResolution(resolvedImportedModule)) {
        let stack = [...resolvedImportedModule.hrefStack];
        for (let {
          url: { href },
        } of resolvedImportedModule.cyclicGroup) {
          stack.splice(
            stack.findIndex((h) => h === href),
            1
          );
        }
        let [cycleConsumer] = stack.slice(-1);
        if (!cycleConsumer) {
          // if there is no consumer left, that means that the entrypoint is
          // part of the cycle
          cycleConsumer = resolvedImportedModule.hrefStack[0];
        }
        namespaceAssignmentHref = cycleConsumer;
      } else {
        namespaceAssignmentHref = this.module.url.href;
      }
      setDoubleNestedMapping(
        namespaceAssignmentHref,
        assignedName,
        nameMap,
        this.state.namespaceMemberAssignment
      );

      for (let [
        exportedName,
        { desc: exportDesc, module: sourceModule },
      ] of getExports(resolvedImportedModule).entries()) {
        if (isNamespaceMarker(exportDesc.name)) {
          continue;
        }
        let namespaceItemSource = this.depResolver.resolveDeclaration(
          exportedName,
          sourceModule,
          sourceModule
        );
        if (namespaceItemSource.type === "resolved") {
          let assignedName: string;
          // the module whose binding we are including in this manufactured
          // namespace object may not necessarily have had it's bindings
          // assigned yet, so we make sure to go through that process.
          let suggestedName =
            namespaceItemSource.declaredName === "default"
              ? "_default"
              : namespaceItemSource.declaredName;
          if (namespaceItemSource.resolution?.type === "declaration") {
            if (isNamespaceMarker(namespaceItemSource.resolution.name)) {
              assignedName = exportedName;
            } else {
              assignedName = this.maybeAssignImportName(
                namespaceItemSource.resolution.source,
                namespaceItemSource.resolution.name,
                suggestedName
              );
            }
          } else {
            assignedName = this.maybeAssignImportName(
              namespaceItemSource.module.url.href,
              namespaceItemSource.importedAs,
              suggestedName
            );
            if (dep) {
              this.state.assignedDependencyBindings.set(assignedName, {
                bundleHref: namespaceItemSource.module.url.href,
                range: dep.range,
                importedAs: namespaceItemSource.importedAs,
              });
            }
          }
          // no need to rename since the namespace hides all that (the actual
          // rename occurs when the module we namespace import is processed)
          this.claim(
            suggestedName,
            assignedName,
            namespaceItemSource.module.url.href
          );
          nameMap.set(exportedName, assignedName);
        } else if (isNamespaceMarker(namespaceItemSource.importedAs)) {
          nameMap.set(exportedName, exportedName);
        } else {
          // TODO deal with modules from external bundles--is this even possible?
          throw new Error("unimplemented");
        }
      }
      this.namespacesAssignments.push(assignedName);
      this.state.assignedNamespaces.set(assignedName, {
        nameMap,
        importedModule,
        resolution,
      });
    }
  }

  private maybeAssignImportNameFromResolution(
    source: ResolvedResult | UnresolvedResult,
    suggestedName: string
  ): string {
    if (source.type === "resolved") {
      if (!source.resolution) {
        return this.maybeAssignImportName(
          source.module.url.href,
          source.importedAs,
          suggestedName
        );
      }
      return this.maybeAssignImportName(
        source.resolution.source,
        source.resolution.name,
        suggestedName
      );
    } else {
      if (!source.resolution) {
        return this.maybeAssignImportName(
          source.importedFromModule.url.href,
          source.importedAs,
          suggestedName
        );
      }
      return this.maybeAssignImportName(
        source.resolution.source,
        source.resolution.name,
        suggestedName
      );
    }
  }

  private maybeAssignImportName(
    remoteModuleHref: string,
    importedAs: string | NamespaceMarker,
    suggestedName: string
  ): string {
    let exportedNames = new Set([
      importedAs,
      ...(!isNamespaceMarker(importedAs)
        ? this.state.multiExportedBindings
            .get(remoteModuleHref)
            ?.get(importedAs) ?? []
        : []),
    ]);

    let alreadyAssignedName: string | undefined;
    for (let name of exportedNames) {
      alreadyAssignedName = this.state.assignedImportedNames
        .get(remoteModuleHref)
        ?.get(isNamespaceMarker(name) ? NamespaceMarker : name);
      if (alreadyAssignedName) {
        return alreadyAssignedName;
      }
    }
    let assignedName = this.unusedNameLike(suggestedName);
    setDoubleNestedMapping(
      remoteModuleHref,
      isNamespaceMarker(importedAs) ? NamespaceMarker : importedAs,
      assignedName,
      this.state.assignedImportedNames
    );
    return assignedName;
  }

  private maybeAssignLocalName(
    name: string,
    suggestedName: string = name
  ): string {
    let alreadyAssignedName = this.state.assignedLocalNames
      .get(this.module.url.href)
      ?.get(name);
    if (alreadyAssignedName) {
      return alreadyAssignedName;
    }
    let assignedName = this.unusedNameLike(suggestedName);
    setDoubleNestedMapping(
      this.module.url.href,
      name,
      assignedName,
      this.state.assignedLocalNames
    );
    return assignedName;
  }

  // it's understood that `name` can be in this module's own description's names
  // and that is not a collision because it's not conflicting with itself.
  private unusedNameLike(name: string): string {
    let candidate = name;
    let counter = 0;
    let { declarations } = this.module.desc;
    while (
      (candidate !== name && declarations.has(candidate)) ||
      this.state.usedNames.has(candidate)
    ) {
      candidate = `${name}${counter++}`;
    }
    return candidate;
  }

  private claim(
    originalName: string,
    assignedName: string,
    moduleHref: string
  ) {
    this.state.usedNames.set(assignedName, {
      moduleHref,
      name: originalName,
    });
    setDoubleNestedMapping(
      moduleHref,
      originalName,
      assignedName,
      this.state.nameAssignments
    );
  }

  private claimAndRename(originalName: string, assignedName: string) {
    this.claim(originalName, assignedName, this.module.url.href);
    if (originalName !== assignedName) {
      this.editor.rename(originalName, assignedName);
    }
  }

  private isUnconsumed(
    desc: DeclarationDescription,
    pointer: RegionPointer
  ): boolean {
    let references = [...desc.references];
    let { dependsOn } = this.module.desc.regions[pointer];
    // remove the self-reference
    for (let p of dependsOn) {
      let i = references.findIndex((r) => r === p);
      if (i > -1) {
        references.splice(i, 1);
        break; // only remove the first one, so we don't mess up recursive functions
      }
    }
    return references.every(
      (p) => this.editor.dispositions[p].state === "removed"
    );
  }
}
