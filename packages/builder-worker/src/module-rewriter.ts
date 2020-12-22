import {
  makeNonCyclic,
  ModuleResolution,
  Resolution,
} from "./nodes/resolution";
import {
  getExports,
  getExportDesc,
  isExportAllMarker,
  ExportAllExportDescription,
} from "./describe-file";
import {
  isNamespaceMarker,
  NamespaceMarker,
  RegionEditor,
  RegionPointer,
  DeclarationCodeRegion,
  CodeRegion,
  DeclarationDescription,
} from "./code-region";
import { BundleAssignment } from "./nodes/bundle";
import stringify from "json-stable-stringify";
import { MD5 as md5, enc } from "crypto-js";
import {
  setMapping,
  stringifyReplacer as replacer,
  stringifyReplacer,
} from "./utils";
import { depAsURL, Dependencies } from "./nodes/entrypoint";
import {
  DependencyResolver,
  ResolvedDeclarationDependency,
} from "./dependency-resolution";
import { pkgInfoFromCatalogJsURL } from "./resolver";
import { maybeRelativeURL } from "./path";

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
  // this is a map of manufactured namespace objects' assigned names to their a
  // map of the keys in the namespace object (the outside name) with values that
  // are the inside names for the corresponding keys
  readonly assignedNamespaces: Map<string, Map<string, string>> = new Map();
  readonly assignedImportedDependencies: Map<
    string,
    { bundleHref: string; range: string; importedAs: string | NamespaceMarker }
  > = new Map();
  // This is a map of the modules that export a single binding multiple times.
  // This is important info for the consumers of the exports to understand so that
  // we don't assign a binding to conflicting names when consumers use different
  // exports that resolve back to the same binding (since consumers drive the
  // assigned names for bindings). The outer key is the module that exports the
  // binding, the inner key is the export name, and the value are all the other
  // export names associated with the binding
  readonly multiExportedBindings: Map<string, Map<string, string[]>>;

  readonly visited: { module: ModuleResolution; editor: RegionEditor }[] = [];
  private queue: { module: ModuleResolution; editor: RegionEditor }[] = [];

  constructor(editors: { module: ModuleResolution; editor: RegionEditor }[]) {
    // we reverse the order of the modules to append such that we first emit the
    // modules that are closest to the entrypoint and work our way towards the
    // deps. This way the bindings that are closest to the entrypoints have the
    // greatest chance of retaining their names and the bindings toward the
    // dependencies will more likely be renamed. This also means that we'll be
    // writing modules into the bundle in reverse order--from the bottom up.
    this.queue = [...editors].reverse();
    this.multiExportedBindings = this.discoverMultipleExports();
  }

  next(): { module: ModuleResolution; editor: RegionEditor } | undefined {
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
      assignedImportedDependencies,
      visited,
      assignedNamespaces,
      queue,
    } = this;
    // creating summary objects, as otherwise the nesting nature of
    // ModuleResolutions makes the resulting object too large to stringify in V8
    // for big packages like lodash, resulting in memory issues
    let visitedSummary = visited.map(({ module, editor }) => ({
      url: module.url.href,
      desc: module.desc,
      dispositions: editor.dispositions,
    }));
    let queueSummary = queue.map(({ module, editor }) => ({
      url: module.url.href,
      desc: module.desc,
      dispositions: editor.dispositions,
    }));
    let str = stringify(
      {
        usedNames,
        assignedImportedNames,
        assignedImportedDependencies,
        visitedSummary,
        assignedNamespaces,
        queueSummary,
      },
      {
        replacer,
      }
    );

    return md5(str).toString(enc.Base64);
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
          setMapping(
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
    this.rewriteScope();
    this.makeNamespaceMappings();
  }

  serialize(): { code: string; regions: CodeRegion[] } {
    let { code, regions } = this.editor.serialize();
    for (let region of regions.filter(
      (r) => r.type === "declaration"
    ) as DeclarationCodeRegion[]) {
      if (region.declaration.type === "import") {
        continue;
      }
      if (!region.declaration.original) {
        // initialize the declaration origin from the entrypoints.json
        // dependencies
        let consumptionInfo = this.state.assignedImportedDependencies.get(
          region.declaration.declaredName
        );
        if (consumptionInfo) {
          region.declaration.original = { ...consumptionInfo };
        }
      }
    }
    return { code, regions };
  }

  rewriteScope(): void {
    let { declarations } = this.module.desc;
    if (declarations) {
      for (let [
        localName,
        { pointer, declaration: localDesc },
      ] of declarations.entries()) {
        let assignedName: string | undefined;
        if (
          localDesc.type === "import" ||
          (localDesc.type === "local" && localDesc.original)
        ) {
          if (localDesc.type === "import") {
            let source = resolveDeclaration(
              localDesc.importedName,
              makeNonCyclic(this.module).resolvedImports[localDesc.importIndex],
              this.module,
              this.ownAssignments,
              this.depResolver,
              pointer
            );
            if (source.type === "resolved") {
              assignedName = this.maybeAssignImportName(
                source.resolution
                  ? source.resolution.bundleHref
                  : source.module.url.href,
                source.resolution
                  ? source.resolution.importedAs
                  : source.importedAs,
                localName
              );
            } else {
              assignedName = this.maybeAssignImportName(
                source.resolution
                  ? source.resolution.bundleHref
                  : source.importedFromModule.url.href,
                source.resolution
                  ? source.resolution.importedAs
                  : source.importedAs,
                localName
              );
            }
            if (
              source.resolution &&
              assignedName &&
              source.resolution.type === "declaration" &&
              !isNamespaceMarker(source.resolution.importedAs)
            ) {
              // we deal with setting the namespace assigned import deps in the
              // makeNamespaceMappings()
              this.state.assignedImportedDependencies.set(assignedName, {
                bundleHref: source.resolution.bundleHref,
                range: source.resolution.range,
                importedAs: source.resolution.importedAs,
              });
            }
          } else if (localDesc.type === "local" && localDesc.original) {
            let resolution = resolutionByDeclaration(
              localDesc,
              this.module,
              pointer,
              this.depResolver
            )!; // this function actually throws when a local desc with an original does not have a resolution
            assignedName = this.maybeAssignImportName(
              resolution.bundleHref,
              resolution.importedAs,
              localName
            );
          }
        } else {
          // check to see if the binding was actually already assigned by a module
          // that imports it
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
          assignedName = assignedName ?? this.unusedNameLike(suggestedName);
        }
        if (!assignedName) {
          throw new Error(
            `unable to assign name to the binding '${localName}' in module ${this.module.url.href} when constructing bundle ${this.bundle.href}`
          );
        }
        this.claimAndRename(localName, assignedName);
      }
    }

    // rewrite dynamic imports to use bundle specifiers
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

  private makeNamespaceMappings() {
    // assign names for "export *" of external bundles that need to be converted
    // into namespace imports so as not to alter the bundle's API, which we only
    // consider in non-entrypoint modules
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

    // deal with bundle-internal namespace imports
    for (let pointer of this.editor.includedRegions()) {
      let region = this.module.desc.regions[pointer];
      if (
        region.type !== "declaration" ||
        region.declaration.type !== "import"
      ) {
        continue;
      }
      let { declaration: desc } = region;
      let importedModule = this.module.resolvedImports[desc.importIndex];
      let source = resolveDeclaration(
        desc.importedName,
        importedModule,
        this.module,
        this.ownAssignments,
        this.depResolver
      );

      if (source.type === "resolved") {
        continue;
      }
      let { importedFromModule } = source;
      if (
        !this.ownAssignments.find(
          (a) => a.module.url.href === importedFromModule.url.href
        )
      ) {
        continue;
      }

      // This is the region that we were using as a signal that this namespace
      // should be in the bundle, now let's actually remove it.
      this.editor.removeRegionAndItsChildren(pointer);

      let assignedName = this.state.assignedImportedNames
        .get(source.importedFromModule.url.href)
        ?.get(NamespaceMarker);
      if (!assignedName) {
        throw new Error(
          `There is no name assignment for the namespace import of ${source.importedFromModule.url.href} in module ${this.module.url.href}`
        );
      }
      let nameMap: Map<string, string> = new Map(); // outside name => inside name
      let dep = Object.values(this.dependencies).find((dep) =>
        importedModule.url.href.includes(depAsURL(dep).href)
      );
      for (let [
        exportedName,
        { desc: exportDesc, module: sourceModule },
      ] of getExports(source.importedFromModule).entries()) {
        if (isNamespaceMarker(exportDesc.name)) {
          continue;
        }
        let namespaceItemSource = resolveDeclaration(
          exportedName,
          sourceModule,
          sourceModule,
          this.ownAssignments,
          this.depResolver
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
          let resolution = resolutionByDeclaration(
            namespaceItemSource.declaration,
            makeNonCyclic(namespaceItemSource.module),
            namespaceItemSource.pointer,
            this.depResolver
          );
          if (resolution?.type === "declaration") {
            if (isNamespaceMarker(resolution.importedAs)) {
              assignedName = exportedName;
            } else {
              assignedName = this.maybeAssignImportName(
                resolution.bundleHref,
                resolution.importedAs,
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
              this.state.assignedImportedDependencies.set(assignedName, {
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
      this.state.assignedNamespaces.set(assignedName, nameMap);
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
        ?.get(name);
      if (alreadyAssignedName) {
        return alreadyAssignedName;
      }
    }
    let assignedName = this.unusedNameLike(suggestedName);
    setMapping(
      remoteModuleHref,
      importedAs,
      assignedName,
      this.state.assignedImportedNames
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
    setMapping(
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

// In this function, there are scenarios that it will not always fully resolve
// the import, and when it does not we return the imported name of the module
// that we stopped at. Otherwise we return the local declaration name (the
// inside name) of the module we resolved. The goal is that the return value is
// transparent about how fully it was able to perform the resolution so that
// callers can reason more clearly around how to handle the results instead of
// having to reconcile an ambiguous situation (i.e. local names will never be
// NamespaceMarkers, or you may resolve to a module that is not even in this
// bundle).
export function resolveDeclaration(
  importedName: string | NamespaceMarker,
  importedFromModule: Resolution,
  consumingModule: Resolution,
  ownAssignments: BundleAssignment[],
  depResolver: DependencyResolver | undefined,
  importedPointer?: RegionPointer // if you have this handy it saves work passing it in--otherwise we'll calculate it
): ResolvedResult | UnresolvedResult {
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
    let pkgURL = pkgInfoFromCatalogJsURL(importedFromModule.url)?.pkgURL;
    if (pkgURL && depResolver) {
      let _resolution = depResolver.resolutionByConsumptionPoint(
        pkgURL,
        consumingModule,
        importedPointer
      );
      if (_resolution?.type === "side-effect") {
        throw new Error(
          `the dependency resolution for ${JSON.stringify(
            importedName
          )}' in the module ${
            importedFromModule.url.href
          } was a "side-effect" type of resolution. Was expecting a "declaration" type of resolution. while building bundle ${
            bundle.href
          }`
        );
      }
      resolution = _resolution as ResolvedDeclarationDependency | undefined;
      if (resolution?.importedSource) {
        ({
          importedSource: { declaredIn: importedFromModule },
        } = resolution);
      } else if (resolution) {
        let pointer = resolution.consumedByPointer;
        let region = resolution.consumedBy.desc.regions[pointer];
        if (
          region.type !== "declaration" ||
          region.declaration.type !== "local"
        ) {
          throw new Error(
            `expected region to be a local declaration region for ${JSON.stringify(
              resolution.importedAs
            )} from module ${resolution?.consumedBy.url.href} region pointer ${
              resolution?.consumedByPointer
            } in bundle ${bundle.href}, but it was ${JSON.stringify(
              region,
              stringifyReplacer
            )}`
          );
        }
        let declaration = region.declaration;
        let declaredName = declaration.declaredName;
        if (isNamespaceMarker(resolution.importedAs)) {
          throw new Error("unimplemented");
        }
        return {
          type: "resolved",
          module: resolution.consumedBy,
          importedAs: resolution.importedAs,
          declaredName,
          region,
          declaration,
          pointer,
          resolution,
        };
      }
    }
  }

  if (isNamespaceMarker(importedName)) {
    return {
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
  }
  if (
    !ownAssignments.find(
      (a) => a.module.url.href === importedFromModule.url.href
    )
  ) {
    return {
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
  }

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
    return {
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
  }

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
        depResolver,
        pointer
      );
    }
  }
  let { pointer, declaration } = declarations.get(exportDesc.name) ?? {};
  if (!declaration || pointer == null) {
    throw new Error(
      `The module ${sourceModule.url.href} exports '${importedName}' but there is no declaration region for the declaration of this export '${exportDesc.name}' in bundle ${bundle.href}`
    );
  }

  if (depResolver && declaration.type === "local" && declaration.original) {
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
  }

  let region = sourceModule.desc.regions[pointer];
  if (region.type !== "declaration") {
    throw new Error(
      `bug: the resolved declaration for '${importedName}' from ${importedFromModule} in ${consumingModule} resulted in a non-declaration type code region: ${region.type} in bundle ${bundle.href}`
    );
  }
  return {
    type: "resolved",
    module: sourceModule,
    importedAs: importedName,
    declaredName: exportDesc.name,
    region,
    declaration,
    pointer,
    resolution,
  };
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

  let resolution = depResolver.resolutionByConsumptionPoint(
    pkgURL,
    module,
    pointer
  );
  if (resolution?.type !== "declaration") {
    throw new Error(
      `the dependency resolution for ${declaration.declaredName}' in the module ${module.url.href} was a "side-effect" type of resolution. Was expecting a "declaration" type of resolution.`
    );
  }
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
