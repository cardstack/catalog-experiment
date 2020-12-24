import { makeNonCyclic, ModuleResolution } from "./nodes/resolution";
import {
  getExports,
  isExportAllMarker,
  ExportAllExportDescription,
} from "./describe-file";
import {
  isNamespaceMarker,
  NamespaceMarker,
  RegionEditor,
  DeclarationCodeRegion,
  CodeRegion,
  RegionPointer,
  DeclarationDescription,
} from "./code-region";
import { BundleAssignment } from "./nodes/bundle";
import stringify from "json-stable-stringify";
import { MD5 as md5, enc } from "crypto-js";
import {
  setDoubleNestedMapping,
  stringifyReplacer as replacer,
  stringifyReplacer,
} from "./utils";
import { depAsURL, Dependencies } from "./nodes/entrypoint";
import { DependencyResolver } from "./dependency-resolution";
import { maybeRelativeURL } from "./path";

export interface Editor {
  editor: RegionEditor;
  module: ModuleResolution;
  sideEffectDeclarations: Set<RegionPointer>;
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

  readonly visited: Editor[] = [];
  private queue: Editor[] = [];

  constructor(editors: Editor[]) {
    // we reverse the order of the modules to append such that we first emit the
    // modules that are closest to the entrypoint and work our way towards the
    // deps. This way the bindings that are closest to the entrypoints have the
    // greatest chance of retaining their names and the bindings toward the
    // dependencies will more likely be renamed. This also means that we'll be
    // writing modules into the bundle in reverse order--from the bottom up.
    this.queue = [...editors].reverse();
    this.multiExportedBindings = this.discoverMultipleExports();
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
      assignedImportedDependencies,
      assignedLocalNames,
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
        assignedLocalNames,
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
    private sideEffectDeclarations: Set<RegionPointer>,
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
      ] of declarations) {
        let assignedName: string | undefined;
        if (
          localDesc.type === "import" ||
          (localDesc.type === "local" && localDesc.original)
        ) {
          if (localDesc.type === "import") {
            let source = this.depResolver.resolveDeclaration(
              localDesc.importedName,
              makeNonCyclic(this.module).resolvedImports[localDesc.importIndex],
              this.module,
              this.ownAssignments,
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
            // TODO if we allow NamespaceMappings here, then we could use the
            // value to help set the "original" property on namespace object
            // declarations (needs to also be paired with resolution entries
            // that contain a NamespaceMarker consumption points)
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
            let resolution = this.depResolver.resolutionByDeclaration(
              localDesc,
              this.module,
              pointer
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
          if (!assignedName) {
            if (
              this.sideEffectDeclarations.has(pointer) &&
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
      let source = this.depResolver.resolveDeclaration(
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
        let namespaceItemSource = this.depResolver.resolveDeclaration(
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
          let resolution = this.depResolver.resolutionByDeclaration(
            namespaceItemSource.declaration,
            makeNonCyclic(namespaceItemSource.module),
            namespaceItemSource.pointer
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
    setDoubleNestedMapping(
      remoteModuleHref,
      importedAs,
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
