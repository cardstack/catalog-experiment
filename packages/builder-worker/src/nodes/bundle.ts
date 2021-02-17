import { BuilderNode, Value } from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { ModuleDescription } from "../describe-file";
import { EntrypointsJSONNode, Entrypoint, Dependencies } from "./entrypoint";
import { getAssigner } from "../assigners";
import { catalogjsHref, Resolver } from "../resolver";
import { LockEntries } from "./lock-file";
import { CombineModulesNode } from "./combine-modules";
import { addDescriptionToSource } from "../description-encoder";
import { RegionEditor } from "../region-editor";
import { stringifyReplacer } from "../utils";
import { inputToOutput } from "../assigners/default";

export interface BundleAssignment {
  // which bundle are we in
  bundleURL: URL;

  // the bundle's entrypoint module
  entrypointModuleURL: URL;

  // which module are we talking about
  module: ModuleResolution;

  // from name-as-originally exported to name-as-exposed-in-this-bundle, if any.
  // Not every export from every module will be publicly exposed by a bundle.
  exposedNames: Map<string, string>;

  // the assigner controls how aggressively we inline modules into
  // bundles.

  // "default": The default assigner, which will be used if "assigner" is not
  // specified. This is an optimizing bundle assignment strategy in which each
  // module is assigned to only 1 bundle, where there is a bundle for each
  // entrypoint (so a module does not appear duplicated across different
  // bundles). Entrypoint bundles that share common modules would have the
  // common modules assigned to a common bundle that is shared by both
  // entrypoint bundles. In the case of dynamic imports, these modules will
  // always be segregated into separate bundles, along with any of the
  // dynamically imported module's static dependencies.

  // "maximum": In this assigner each module effectively is a
  // bundle (aka "snowpack" style). This mode is meant for a development
  // environment. This is not an optimizing bundle strategy.

  // "minimum": This is also an optimizing bundle strategy. In this assigner we
  // endeavor to have just a single bundle for each entrypoint and there are no
  // shared statically imported bundles. We can only use this mode when all
  // module imports within a project are static. This means that modules may be
  // assigned to multiple bundles (if these bundles are later combined, the
  // overlapping portions would be removed). No common bundles would be used for
  // static imports. Note that if there are any dynamic imports within the
  // project, then we fallback to the "default" assigner, since for correctness
  // reasons, separate bundles need to be maintained.

  // TODO consider a 4th assigner where there a tunable minimum bundle
  // size. If a bundle ends up smaller than that, it gets inlined into its
  // consumers
  assigner: "default" | "maximum" | "minimum";
}
export interface BundleOptions {
  assigner?: BundleAssignment["assigner"];
  mountedPkgSource?: URL;
  testing?: {
    origin: string;
    exports?: {
      [outsideName: string]: { file: string; name: string };
    };
  };
}

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    private resolver: Resolver,
    private seededResolutions: LockEntries,
    private opts?: BundleOptions
  ) {
    this.cacheKey = `bundle-assignments:input=${projectInput.href},output=${
      projectOutput.href
    },assigner=${opts?.assigner ?? "default"}`;
  }

  async deps() {
    return {
      entrypoints: new EntrypointsJSONNode(
        this.projectInput,
        this.projectOutput
      ),
      results: new ModuleResolutionsNode(
        this.projectInput,
        this.projectOutput,
        this.resolver,
        this.seededResolutions
      ),
    };
  }

  async run({
    results: { resolutions, lockEntries },
    entrypoints,
  }: {
    results: { resolutions: ModuleResolution[]; lockEntries: LockEntries };
    entrypoints: Entrypoint[];
  }): Promise<
    Value<{
      assignments: BundleAssignment[];
      resolutionsInDepOrder: ModuleResolution[];
      lockEntries: LockEntries;
    }>
  > {
    let assigner = getAssigner(
      this.opts?.assigner ?? "default",
      this.projectInput,
      this.projectOutput,
      resolutions,
      entrypoints,
      this.opts?.mountedPkgSource ?? new URL(catalogjsHref)
    );
    let { assignments, resolutionsInDepOrder } = assigner;

    if (this.opts?.testing?.exports) {
      for (let [outsideName, { file, name }] of Object.entries(
        this.opts.testing?.exports
      )) {
        let fileURL = new URL(file, this.opts.testing?.origin);
        let assignment = assignments.find(
          (a) => a.module.url.href === fileURL.href
        );
        if (!assignment) {
          throw new Error(
            `invalid test setup, you tried to set an export for the module ${fileURL.href}}, but there is no assignment for that module`
          );
        }
        assignment.exposedNames.set(name, outsideName);
      }
    }
    return {
      value: { assignments, resolutionsInDepOrder, lockEntries },
    };
  }
}

export class BundleNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private bundle: URL,
    private inputRoot: URL,
    private outputRoot: URL,
    private resolver: Resolver,
    private lockEntries: LockEntries,
    private dependencies: Dependencies,
    private opts?: BundleOptions
  ) {
    this.cacheKey = `bundle-node:url=${this.bundle.href},inputRoot=${
      this.inputRoot.href
    },outputRoot=${this.outputRoot.href},dependencies=${JSON.stringify(
      dependencies
    )},assigner=${opts?.assigner ?? "default"}`;
  }

  async deps() {
    if (this.opts?.assigner === "maximum") {
      // there there is a 1:1 relationship between modules and bundles, we can
      // skip the build tree related to combining modules, and just emit the
      // code of our bundle's sole module
      return {
        optimizedResult: new BundleAssignmentsNode(
          this.inputRoot,
          this.outputRoot,
          this.resolver,
          this.lockEntries,
          this.opts
        ),
      };
    }

    return {
      result: new CombineModulesNode(
        this.bundle,
        this.dependencies,
        this.lockEntries,
        new BundleAssignmentsNode(
          this.inputRoot,
          this.outputRoot,
          this.resolver,
          this.lockEntries,
          this.opts
        )
      ),
    };
  }

  async run({
    result,
    optimizedResult,
  }: {
    result?: { code: string; desc: ModuleDescription };
    optimizedResult?: {
      assignments: BundleAssignment[];
    };
  }): Promise<Value<string>> {
    let value: string;
    if (result) {
      value = addDescriptionToSource(result.desc, result.code);
    } else if (optimizedResult) {
      let ourAssignments = optimizedResult.assignments.filter(
        (a) => a.bundleURL.href === this.bundle.href
      );
      if (ourAssignments.length !== 1) {
        throw new Error(
          `should never get here: the maximum assigner should only ever have one module per bundle for the bundle. The bundle: ${
            this.bundle.href
          } contains ${ourAssignments.map((a) => a.module.url.href).join(", ")}`
        );
      }
      let [{ module }] = ourAssignments;
      value = rewriteImportURLs(
        module,
        this.opts?.mountedPkgSource ?? new URL(catalogjsHref),
        this.inputRoot,
        this.outputRoot
      );
    } else {
      throw new Error(
        `should never get here: there was no BundleNode dep resolution for ${this.cacheKey}`
      );
    }
    return { value };
  }
}

function rewriteImportURLs(
  module: ModuleResolution,
  mountedPkgSource: URL,
  projectInput: URL,
  projectOutput: URL
): string {
  if (module.desc.imports.length === 0) {
    return module.source;
  }

  let editor = new RegionEditor(module.source, module.desc, module.url.href);
  for (let [pointer, region] of module.desc.regions.entries()) {
    if (editor.dispositions[pointer].state === "removed") {
      editor.keepRegion(pointer);
    }
    if (region.type !== "import") {
      continue;
    }
    // all the import regions depend on their source region, which will be the
    // only "general" region they depend on
    let sourcePointer = [...region.dependsOn].find(
      (p) => module.desc.regions[p].type === "general"
    );
    if (sourcePointer == null) {
      throw new Error(
        `the source pointer for the import region is not specified. '${pointer}' in ${
          module.url.href
        }: region=${JSON.stringify(region, stringifyReplacer)}`
      );
    }
    let sourceURL = module.resolvedImports[region.importIndex].url;
    let outputSourceURL = inputToOutput(
      sourceURL.href,
      mountedPkgSource,
      projectInput,
      projectOutput
    );
    editor.keepRegion(sourcePointer);
    editor.replace(sourcePointer, `"${outputSourceURL.href}"`);
  }
  return editor.serialize().code;
}
