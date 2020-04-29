import { BuilderNode, Value } from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { combineModules } from "../combine-modules";

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: URL[]) {}

  deps() {
    return { resolutions: new ModuleResolutionsNode(this.projectRoots) };
  }

  async run({
    resolutions,
  }: {
    resolutions: ModuleResolution[];
  }): Promise<Value<BundleAssignments>> {
    return {
      value: new BundleAssignments(resolutions),
    };
  }
}

export class BundleNode {
  cacheKey: BundleNode;
  constructor(private bundle: Bundle, private assignments: BundleAssignments) {
    this.cacheKey = this;
  }

  deps() {
    // right now BundleNode is entirely volatile and gets constructed with all
    // the info it needs, so it has no deps. But this means we aren't saving any
    // of its work in between rebuilds. We plan to make it cache better, which
    // justifies keeping BundleNode as a separate node.
    return null;
  }

  async run(): Promise<Value<string>> {
    return {
      value: combineModules(this.bundle, this.assignments),
    };
  }
}

export interface Bundle {
  url: URL;
  exposedModules: ModuleResolution[];
}

export class BundleAssignments {
  // keys are js module hrefs
  private modules: Map<string, Bundle> = new Map();
  bundles: Bundle[] = [];

  constructor(rootResolutions: ModuleResolution[]) {
    if (rootResolutions.length === 0) {
      throw new Error(`need at least one rootResolution`);
    }
    let bundle = {
      url: new URL(`/dist/0.js`, rootResolutions[0].url.origin),
      exposedModules: rootResolutions,
    };
    this.traverse(rootResolutions, bundle);
    this.bundles.push(bundle);
  }

  private traverse(resolutions: ModuleResolution[], parentBundle: Bundle) {
    for (let module of resolutions) {
      this.modules.set(module.url.href, parentBundle);
      this.traverse(
        Object.values(module.imports).map(({ resolution }) => resolution),
        parentBundle
      );
    }
  }

  bundleFor(jsModule: URL): Bundle {
    let bundle = this.modules.get(jsModule.href);
    if (!bundle) {
      throw new Error(`unknown js modules ${jsModule.href}`);
    }
    return bundle;
  }
}
