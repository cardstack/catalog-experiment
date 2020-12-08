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
import { setMapping, stringifyReplacer as replacer } from "./utils";
import { depAsURL, Dependencies } from "./nodes/entrypoint";
import {
  ResolvedDependency,
  DependencyResolver,
} from "./nodes/combine-modules";
import { pkgInfoFromCatalogJsURL } from "./resolver";

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
    let str = stringify(
      {
        usedNames,
        assignedImportedNames,
        assignedImportedDependencies,
        visited,
        assignedNamespaces,
        queue,
      },
      {
        replacer,
      }
    );

    return md5(str).toString(enc.Base64);
  }
}

export class ModuleRewriter {
  private ownAssignments: BundleAssignment[];
  readonly namespacesAssignments: string[] = [];

  constructor(
    private bundle: URL,
    readonly module: ModuleResolution,
    private state: HeadState,
    bundleAssignments: BundleAssignment[],
    private editor: RegionEditor,
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
      } else {
        // use recalculated/collapsed consumption ranges
        let declarationOrigin = resolveDeclarationOrigin(
          region.declaration,
          this.module,
          this.depResolver
        );
        if (declarationOrigin?.type === "included") {
          let {
            bundleHref: bundleHref,
            range,
            importedAs,
          } = declarationOrigin.source;
          region.declaration.original = { bundleHref, range, importedAs };
        } else {
          throw new Error(
            `bug: should never be here--obviated regions should not be included in serialized code region result`
          );
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
        { declaration: localDesc },
      ] of declarations.entries()) {
        let assignedName: string | undefined;
        if (
          localDesc.type === "import" ||
          (localDesc.type === "local" && localDesc.original)
        ) {
          let declarationOrigin = resolveDeclarationOrigin(
            localDesc,
            this.module,
            this.depResolver
          );
          if (declarationOrigin) {
            assignedName = this.maybeAssignImportName(
              declarationOrigin.source.bundleHref,
              isNamespaceMarker(declarationOrigin.source.importedAs)
                ? NamespaceMarker
                : declarationOrigin.source.importedAs,
              localName
            );
          } else if (localDesc.type === "import") {
            let importedModule = makeNonCyclic(this.module).resolvedImports[
              localDesc.importIndex
            ];
            let source = resolveDeclaration(
              localDesc.importedName,
              importedModule,
              this.module,
              this.ownAssignments
            );
            if (source.type === "resolved") {
              assignedName = this.maybeAssignImportName(
                source.module.url.href,
                source.importedAs,
                localName
              );
            } else if (isNamespaceMarker(source.importedAs)) {
              assignedName = this.maybeAssignImportName(
                source.importedFromModule.url.href,
                NamespaceMarker,
                localName
              );
            } else {
              assignedName = this.maybeAssignImportName(
                source.importedFromModule.url.href,
                source.importedAs,
                localName
              );
            }

            let dep = Object.values(this.dependencies).find((dep) =>
              importedModule.url.href.includes(depAsURL(dep).href)
            );
            if (dep) {
              // we deal with setting the namespace assigned import deps in the
              // makeNamespaceMappings()
              if (!isNamespaceMarker(localDesc.importedName)) {
                this.state.assignedImportedDependencies.set(assignedName, {
                  bundleHref: importedModule.url.href,
                  range: dep.range,
                  importedAs: localDesc.importedName,
                });
              }
            }
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
        this.ownAssignments
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
          this.ownAssignments
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
          let declarationOrigin = resolveDeclarationOrigin(
            namespaceItemSource.declaration,
            this.module,
            this.depResolver
          );
          if (declarationOrigin) {
            if (isNamespaceMarker(declarationOrigin.source.importedAs)) {
              assignedName = exportedName;
            } else {
              assignedName = this.maybeAssignImportName(
                declarationOrigin.source.bundleHref,
                declarationOrigin.source.importedAs,
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
    let alreadyAssignedName = this.state.assignedImportedNames
      .get(remoteModuleHref)
      ?.get(importedAs);
    if (alreadyAssignedName) {
      return alreadyAssignedName;
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

  private claimAndRename(originalName: string, assignedName: string) {
    this.state.usedNames.set(assignedName, {
      moduleHref: this.module.url.href,
      name: originalName,
    });
    setMapping(
      this.module.url.href,
      originalName,
      assignedName,
      this.state.nameAssignments
    );
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
}

export interface UnresolvedResult {
  type: "unresolved";
  importedFromModule: Resolution;
  consumingModule: Resolution;
  importedAs: string | NamespaceMarker;
  importedRegion: CodeRegion | undefined;
  importedPointer: RegionPointer | undefined;
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
  ownAssignments: BundleAssignment[]
): ResolvedResult | UnresolvedResult {
  if (isNamespaceMarker(importedName)) {
    let importedPointer = pointerForImport(
      importedName,
      importedFromModule,
      makeNonCyclic(consumingModule)
    );
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
    };
  }
  if (
    !ownAssignments.find(
      (a) => a.module.url.href === importedFromModule.url.href
    )
  ) {
    let importedPointer = pointerForImport(
      importedName,
      importedFromModule,
      makeNonCyclic(consumingModule)
    );
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
    };
  }

  let { module: sourceModule, desc: exportDesc } =
    getExportDesc(importedFromModule, importedName) ?? {};
  if (!sourceModule || !exportDesc) {
    throw new Error(
      `The module ${importedFromModule.url.href} has no export '${importedName}'`
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
        ownAssignments
      );
    } else {
      let { declaration } = declarations.get(exportDesc.name)!;
      if (declaration.type === "local") {
        throw new Error(
          `bug: should never get here, the only declaration descriptions left are imports that are manually exported`
        );
      }
      return resolveDeclaration(
        declaration.importedName,
        sourceModule!.resolvedImports[declaration.importIndex],
        sourceModule,
        ownAssignments
      );
    }
  }
  let { pointer, declaration } = declarations.get(exportDesc.name) ?? {};
  if (!declaration || pointer == null) {
    throw new Error(
      `The module ${sourceModule.url.href} exports '${importedName}' but there is no declaration region for the declaration of this export '${exportDesc.name}'`
    );
  }
  let region = sourceModule.desc.regions[pointer];
  if (region.type !== "declaration") {
    throw new Error(
      `bug: the resolved declaration for '${importedName}' from ${importedFromModule} in ${consumingModule} resulted in a non-declaration type code region: ${region.type}`
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
  };
}

export function resolutionForPkgDepDeclaration(
  module: ModuleResolution,
  bindingName: string,
  depResolver: DependencyResolver
): ResolvedDependency | undefined {
  let { declaration: desc, pointer } =
    module.desc.declarations.get(bindingName) ?? {};
  if (!desc) {
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
    return depResolver
      .resolutionsForPkg(pkgURL?.href)
      .find(
        (r) =>
          (r.consumedBy.url.href === module!.url.href &&
            r.consumedByPointer === pointer) ||
          r.obviatedDependencies.find(
            (o) => o.moduleHref === module!.url.href && o.pointer === pointer
          )
      );
  }
  return;
}

interface IncludedDeclarationOrigin {
  type: "included";
  source: ResolvedDependency;
}

interface ObviatedDeclarationOrigin {
  type: "obviated";
  source: ResolvedDependency;
}

type DeclarationOrigin = IncludedDeclarationOrigin | ObviatedDeclarationOrigin;

function resolveDeclarationOrigin(
  desc: DeclarationDescription,
  consumedByModule: ModuleResolution,
  depResolver: DependencyResolver
): DeclarationOrigin | undefined {
  let pkgURL: URL | undefined;
  if (desc.type === "local" && desc.original) {
    pkgURL = pkgInfoFromCatalogJsURL(new URL(desc.original.bundleHref))?.pkgURL;
    if (!pkgURL) {
      throw new Error(
        `Cannot determine pkgURL that corresponds to the bundle URL: ${desc.original.bundleHref}`
      );
    }
  } else if (desc.type === "import") {
    pkgURL = pkgInfoFromCatalogJsURL(
      consumedByModule.resolvedImports[desc.importIndex].url
    )?.pkgURL;
    if (!pkgURL) {
      return;
    }
  } else {
    return;
  }
  let resolvedSources = depResolver.resolutionsForPkg(pkgURL.href) ?? [];
  let obviatedSource = resolvedSources?.find((s) =>
    s.obviatedDependencies.find(
      (r) => r.moduleHref === consumedByModule.url.href
    )
  );
  if (obviatedSource) {
    // this region has been collapsed because it's consumption range
    // overlaps with the same declaration elsewhere
    return {
      type: "obviated",
      source: obviatedSource,
    };
  }
  let includedSource = resolvedSources.find(
    (s) => s.consumedBy.url.href === consumedByModule.url.href
  );
  if (includedSource) {
    return {
      type: "included",
      source: includedSource,
    };
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
