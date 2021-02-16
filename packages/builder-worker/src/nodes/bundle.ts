import { BuilderNode, Value } from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { ModuleDescription } from "../describe-file";
import { EntrypointsJSONNode, Entrypoint, Dependencies } from "./entrypoint";
import { getAssigner } from "../assigners";
import { Resolver } from "../resolver";
import { LockEntries } from "./lock-file";
import { CombineModulesNode } from "./combine-modules";
import { addDescriptionToSource } from "../description-encoder";

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
    this.cacheKey = `bundle-assignments:input=${projectInput.href},output=${projectOutput.href}`;
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
      entrypoints
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
    private testingOpts?: BundleOptions
  ) {
    this.cacheKey = `bundle-node:url=${this.bundle.href},inputRoot=${
      this.inputRoot.href
    },outputRoot=${this.outputRoot.href},dependencies=${JSON.stringify(
      dependencies
    )}`;
  }

  async deps() {
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
          this.testingOpts
        )
      ),
    };
  }

  async run({
    result: { code, desc },
  }: {
    result: { code: string; desc: ModuleDescription };
  }): Promise<Value<string>> {
    let value = addDescriptionToSource(desc, code);
    return { value };
  }
}
