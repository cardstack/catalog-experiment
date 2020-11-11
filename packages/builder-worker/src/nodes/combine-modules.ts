import { BuilderNode, Value, NextNode, NodeOutput } from "./common";
import { makeNonCyclic, ModuleResolution, Resolution } from "./resolution";
import { getExports, getExportDesc } from "../describe-file";
import {
  documentPointer,
  isNamespaceMarker,
  NamespaceMarker,
  RegionEditor,
  RegionPointer,
  DeclarationCodeRegion,
  CodeRegion,
} from "../code-region";
import { BundleAssignment, BundleAssignmentsNode } from "./bundle";
import stringify from "json-stable-stringify";
import { MD5 as md5, enc } from "crypto-js";
import { setMapping } from "../utils";
import { maybeRelativeURL } from "../path";

export class CombineModulesNode implements BuilderNode {
  cacheKey: CombineModulesNode;
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
  }): Promise<NextNode<string>> {
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
        assignments
      ),
    };
  }
}

class HeadState {
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
  // this is a map of manufactured namespace objects' assigned names to their
  // corresponding code.
  readonly assignedNamespaces: Map<string, string> = new Map();

  private visitedModules: ModuleResolution[] = [];
  private moduleQueue: ModuleResolution[] = [];
  // TODO new bundle ModuleDescription is included in this state

  constructor(moduleResolutions: ModuleResolution[]) {
    // we reverse the order of the modules to append such that we first emit the
    // modules that are closest to the entrypoint and work our way towards the
    // deps. This way the bindings that are closest to the entrypoints have the
    // greatest chance of retaining their names and the bindings toward the
    // dependencies will more likely be renamed. This also means that we'll be
    // writing modules into the bundle in reverse order--from the bottom up.
    this.moduleQueue = [...moduleResolutions].reverse();
  }

  nextModule(): ModuleResolution | undefined {
    let nextModule = this.moduleQueue.shift();
    if (nextModule) {
      this.visitedModules.push(nextModule);
    }
    return nextModule;
  }

  hash(): string {
    let {
      usedNames,
      assignedImportedNames,
      visitedModules,
      assignedNamespaces,
      moduleQueue,
    } = this;
    let str = stringify(
      {
        usedNames,
        assignedImportedNames,
        visitedModules,
        assignedNamespaces,
        moduleQueue,
      },
      {
        replacer: (_, value) => {
          if (value instanceof Map) {
            return {
              dataType: "Map",
              value: value.entries(),
            };
          } else if (value instanceof Set) {
            return {
              dataType: "Set",
              value: value.entries(),
            };
          } else {
            return value;
          }
        },
      }
    );

    return md5(str).toString(enc.Base64);
  }
}

function discoverIncludedRegions(
  bundle: URL,
  module: Resolution,
  pointer: RegionPointer,
  editors: Map<string, RegionEditor>,
  ownAssignments: BundleAssignment[]
) {
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

class AppendModuleNode implements BuilderNode {
  cacheKey: string;
  private editor: RegionEditor;
  constructor(
    private state: HeadState,
    private module: ModuleResolution,
    private bundle: URL,
    private editors: Map<string, RegionEditor>,
    private bundleAssignments: BundleAssignment[],
    private rewriters: ModuleRewriter[] = []
  ) {
    this.cacheKey = `append-module-node:${this.bundle.href}:${
      this.module.url.href
    }:${this.state.hash()}`;
    this.editor = editors.get(module.url.href)!;
  }

  async deps() {}

  async run(): Promise<NodeOutput<string>> {
    let rewriter = new ModuleRewriter(
      this.bundle,
      this.module,
      this.state,
      this.bundleAssignments,
      this.editor
    );
    let rewriters = [rewriter, ...this.rewriters];
    let nextModule = this.state.nextModule();
    if (nextModule) {
      return {
        node: new AppendModuleNode(
          this.state,
          nextModule,
          this.bundle,
          this.editors,
          this.bundleAssignments,
          rewriters
        ),
      };
    } else {
      return {
        node: new AppendImportsAndExportsNode(
          this.state,
          this.bundle,
          this.editors,
          this.bundleAssignments,
          rewriters
        ),
      };
    }
  }
}

class AppendImportsAndExportsNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private state: HeadState,
    private bundle: URL,
    private editors: Map<string, RegionEditor>,
    private bundleAssignments: BundleAssignment[],
    private rewriters: ModuleRewriter[]
  ) {
    this.cacheKey = `append-imports-exports-node:${
      this.bundle.href
    }:${this.state.hash()}`;
  }

  async deps() {}

  async run(): Promise<Value<string>> {
    // add bundle imports
    let importDeclarations: string[] = [];
    let imports = assignedImports(
      this.bundle,
      this.bundleAssignments,
      this.state,
      this.editors
    );
    for (let [bundleHref, mapping] of imports.entries()) {
      let importDeclaration: string[] = [];
      if (!mapping) {
        importDeclarations.push(
          `import "${maybeRelativeURL(new URL(bundleHref), this.bundle)}";`
        );
        continue;
      }
      for (let [importedAs, localName] of mapping.entries()) {
        if (isNamespaceMarker(importedAs)) {
          if (importDeclaration.length > 0) {
            this.flushImportDeclaration(
              importDeclaration,
              importDeclarations,
              bundleHref
            );
          }
          importDeclarations.push(
            `import * as ${localName} from "${maybeRelativeURL(
              new URL(bundleHref),
              this.bundle
            )}";`
          );
        } else {
          importDeclaration.push(
            importedAs === localName
              ? importedAs
              : `${importedAs} as ${localName}`
          );
        }
        if (importDeclaration.length > 0) {
          this.flushImportDeclaration(
            importDeclaration,
            importDeclarations,
            bundleHref
          );
        }
      }
    }

    // handle bundle exports
    let { exports, reexports, exportAlls } = assignedExports(
      this.bundle,
      this.bundleAssignments,
      this.state
    );
    let exportDeclarations: string[] = [];
    if (exports.size > 0) {
      exportDeclarations.push("export {");
      exportDeclarations.push(
        [...exports]
          .map(([insideName, outsideName]) =>
            outsideName === insideName
              ? outsideName
              : `${insideName} as ${outsideName}`
          )
          .join(", ")
      );
      exportDeclarations.push("};");
    }

    // TODO add bundle reexports
    // TODO add bundle export-all's

    let code: string[] = [];
    for (let rewriter of this.rewriters) {
      // resolve namespace assignments
      if (rewriter.namespacesAssignments.length > 0) {
        for (let assignedName of rewriter.namespacesAssignments) {
          let namespaceCode = this.state.assignedNamespaces.get(assignedName);
          if (namespaceCode != null) {
            code.push(namespaceCode);
            this.state.assignedNamespaces.delete(assignedName);
          }
        }
      }
      code.push(rewriter.serialize().trim());
    }
    code.unshift(importDeclarations.join("\n"));
    code.push(exportDeclarations.join(" ").trim());

    if (imports.size === 0 && exports.size === 0) {
      code.push(`export {};`);
    }

    return { value: code.join("\n").trim() };
  }
  private flushImportDeclaration(
    importDeclaration: string[],
    importDeclarations: string[],
    bundleHref: string
  ) {
    importDeclaration.unshift(`import {`);
    importDeclaration.push(
      `} from "${maybeRelativeURL(new URL(bundleHref), this.bundle)}";`
    );
    importDeclarations.push(importDeclaration.join(" "));
    importDeclaration = [];
  }
}

class ModuleRewriter {
  private ownAssignments: BundleAssignment[];
  readonly namespacesAssignments: string[] = [];

  constructor(
    private bundle: URL,
    private module: ModuleResolution,
    private state: HeadState,
    bundleAssignments: BundleAssignment[],
    private editor: RegionEditor
  ) {
    this.ownAssignments = bundleAssignments.filter(
      (a) => a.bundleURL.href === this.bundle.href
    );
    this.rewriteScope();
    this.makeNamespaces();
  }

  serialize(): string {
    return this.editor.serialize();
  }

  rewriteScope(): void {
    let { declarations } = this.module.desc;
    if (declarations) {
      for (let [
        localName,
        { declaration: localDesc },
      ] of declarations.entries()) {
        let assignedName: string | undefined;
        if (localDesc.type === "import") {
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
        this.claimAndRename(localName, assignedName);
      }
    }
  }

  private makeNamespaces() {
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

      let namespaceDeclaration: string[] = [];
      let assignedName = this.state.assignedImportedNames
        .get(source.importedFromModule.url.href)
        ?.get(NamespaceMarker);
      if (!assignedName) {
        throw new Error(
          `There is no name assignment for the namespace import of ${source.importedFromModule.url.href} in module ${this.module.url.href}`
        );
      }
      namespaceDeclaration.push(`const ${assignedName} = {`);
      let declarators: string[] = [];
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
          // the module whose binding we are including in this manufactured
          // namespace object may not necessarily have had it's bindings
          // assigned yet, so we make sure to go through that process.
          let suggestedName =
            namespaceItemSource.declaredName === "default"
              ? "_default"
              : namespaceItemSource.declaredName;
          let assignedName = this.maybeAssignImportName(
            namespaceItemSource.module.url.href,
            namespaceItemSource.importedAs,
            suggestedName
          );
          // TODO don't forget to deal with situation where the declaration has an "original" property
          declarators.push(
            exportedName === assignedName
              ? exportedName
              : `${exportedName}: ${assignedName}`
          );
        } else if (isNamespaceMarker(namespaceItemSource.importedAs)) {
          declarators.push(exportedName);
        } else {
          // TODO deal with modules from external bundles--is this even possible?
          throw new Error("unimplemented");
        }
      }
      namespaceDeclaration.push(declarators.join(", "));
      namespaceDeclaration.push(`};`);
      let code = namespaceDeclaration.join(" ");
      this.namespacesAssignments.push(assignedName);
      this.state.assignedNamespaces.set(assignedName, code);
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

function assignedExports(
  bundle: URL,
  assignments: BundleAssignment[],
  state: HeadState
): {
  exports: Map<string, string>; // outside name -> inside name
  reexports: Map<string, Map<string, string>>; // bundle href -> [outside name => inside name]
  exportAlls: Set<string>; // bundle hrefs
} {
  let exports: Map<string, string> = new Map();
  let reexports: Map<string, Map<string, string>> = new Map();
  let exportAlls: Set<string> = new Set();
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );
  for (let assignment of ownAssignments) {
    let { module } = assignment;
    for (let [original, exposedAs] of assignment.exposedNames.entries()) {
      let source = resolveDeclaration(original, module, module, ownAssignments);
      if (source.type === "resolved") {
        let assignedName = state.nameAssignments
          .get(source.module.url.href)
          ?.get(source.declaredName);
        if (!assignedName) {
          throw new Error(
            `could not find assigned name for declaration '${source.declaredName} in ${source.module.url.href}`
          );
        }
        exports.set(assignedName, exposedAs);
      } else {
        // TODO deal with NamespaceMarkers and external bundles
        throw new Error("unimplemented");
      }
    }
  }
  return { exports, reexports, exportAlls };
}

function assignedImports(
  bundle: URL,
  assignments: BundleAssignment[],
  state: HeadState,
  editors: Map<string, RegionEditor>
): Map<string, Map<string | NamespaceMarker, string> | null> {
  // bundleHref => <exposedName => local name> if the inner map is null then
  // this is a side effect only import
  let results: Map<
    string,
    Map<string | NamespaceMarker, string> | null
  > = new Map();
  let ownAssignments = assignments.filter(
    (a) => a.bundleURL.href === bundle.href
  );
  for (let [moduleHref, editor] of [...editors.entries()].reverse()) {
    // reverse entries to get dep-first order
    let { module } = ownAssignments.find(
      (a) => a.module.url.href === moduleHref
    )!;
    // sort the regions by position in file to get correct order
    let regionInfo = editor
      .includedRegions()
      .map((pointer) => ({ pointer, region: module.desc.regions[pointer] }))
      .sort((a, b) => a.region.position - b.region.position);
    for (let { pointer, region } of regionInfo) {
      if (region.type !== "declaration" && region.type !== "import") {
        continue;
      }

      // check to see if this is a side-effect only import from another bundle
      if (region.type === "import") {
        let importedModule = module.resolvedImports[region.importIndex];
        let assignment = assignments.find(
          (a) => a.module.url.href === importedModule.url.href
        )!;
        if (
          !ownAssignments.find(
            (a) => a.bundleURL.href === assignment.bundleURL.href
          )
        ) {
          results.set(assignment.bundleURL.href, null);
        }
        // This is the region that we were using as a signal that this import
        // should be in the bundle, now let's actually remove it (because we are
        // going to refashion it).
        editor.removeRegionAndItsChildren(pointer);
        continue;
      }

      let { declaration: desc } = region;
      if (desc.type === "local") {
        continue;
      }

      let importedModule = module.resolvedImports[desc.importIndex];
      let source = resolveDeclaration(
        desc.importedName,
        importedModule,
        module,
        ownAssignments
      );
      if (source.type === "resolved") {
        continue;
      }
      let { importedFromModule, importedAs } = source;
      if (
        ownAssignments.find(
          (a) => a.module.url.href === importedFromModule.url.href
        )
      ) {
        continue;
      }

      // This is the region that we were using as a signal that this import
      // should be in the bundle, now let's actually remove it (because we are
      // going to refashion it).
      editor.removeRegionAndItsChildren(pointer);

      let assignment = assignments.find(
        (a) => a.module.url.href === importedFromModule.url.href
      );
      if (!assignment) {
        // this binding is actually a local binding with an "original" property
        // that originally was imported into a module that this bundle already
        // includes
        continue;
      }
      let importsFromBundle = results.get(assignment.bundleURL.href);
      if (!importsFromBundle) {
        importsFromBundle = new Map();
        results.set(assignment.bundleURL.href, importsFromBundle);
      }
      let assignedName = state.assignedImportedNames
        .get(importedFromModule.url.href)
        ?.get(importedAs);
      if (!assignedName) {
        throw new Error(
          `could not find assigned name for import of ${JSON.stringify(
            importedAs
          )} from ${importedFromModule.url.href} in module ${
            source.consumingModule.url.href
          }`
        );
      }
      if (isNamespaceMarker(importedAs)) {
        importsFromBundle.set(NamespaceMarker, assignedName);
      } else {
        let exposedName = assignment.exposedNames.get(importedAs);
        if (!exposedName) {
          throw new Error(
            `tried to import ${importedAs} from ${importedFromModule.url.href} in ${source.consumingModule.url.href} but it is not exposed`
          );
        }
        importsFromBundle.set(exposedName, assignedName);
      }
    }
  }

  return results;
}

interface ResolvedResult {
  type: "resolved";
  module: Resolution;
  declaredName: string;
  importedAs: string;
  region: DeclarationCodeRegion;
  pointer: RegionPointer;
}

interface UnresolvedResult {
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
function resolveDeclaration(
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
      `The module ${importedFromModule.url.href} has no export '${importedName}`
    );
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
    pointer,
  };
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
  return pointer;
}
