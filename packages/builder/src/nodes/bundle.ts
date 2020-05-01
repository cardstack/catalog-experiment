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

// This is how we assign various sub-graphs of the module resolution graph to
// different bundles
export interface AssignmentConfig {
  [bundleHref: string]: {
    exposedModuleURLs: URL[];
  };
}

export class BundleAssignments {
  // keys are js module hrefs
  private modules: Map<string, Bundle> = new Map();
  bundles: Bundle[] = [];

  constructor(
    rootResolutions: ModuleResolution[],
    private config: AssignmentConfig = {}
  ) {
    if (rootResolutions.length > 0) {
      if (Object.keys(config).length === 0) {
        this.config[
          new URL("/dist/0.js", rootResolutions[0].url.origin).href
        ] = {
          exposedModuleURLs: rootResolutions.map((r) => r.url),
        };
      }

      this.traverse(rootResolutions);
    }
  }

  private discoverExposedModule(module: ModuleResolution): Bundle | undefined {
    for (let [bundleHref, { exposedModuleURLs }] of Object.entries(
      this.config
    )) {
      if (exposedModuleURLs.map((u) => u.href).includes(module.url.href)) {
        let bundle = this.bundles.find((b) => b.url.href === bundleHref);
        if (!bundle) {
          bundle = {
            url: new URL(bundleHref),
            exposedModules: [module],
          };
          this.bundles.push(bundle);
        }
        return bundle;
      }
    }
  }

  private traverse(resolutions: ModuleResolution[], parentBundle?: Bundle) {
    for (let module of resolutions) {
      parentBundle = this.discoverExposedModule(module) ?? parentBundle;
      if (!parentBundle) {
        throw new Error(
          `cannot determine parent bundle for module ${module.url.href}`
        );
      }
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

  importFor(
    _jsModule: URL,
    _originalName: string
  ): { bundle: Bundle; newName: string } {
    throw new Error(`unimplemented`);
  }
}
