import { BuilderNode, Value } from "./common";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import { combineModules } from "../combine-modules";
import { NamespaceMarker } from "../describe-module";

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
      value: new SimpleBundleAssignments(resolutions),
    };
  }
}

export class BundleNode {
  cacheKey: BundleNode;
  constructor(private bundle: URL, private assignments: BundleAssignments) {
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

export interface BundleAssignments {
  bundles: URL[];

  // which bundle represents this js entrypoint?
  bundleForEntrypoint(jsEntry: URL): URL;

  // does this bundle represent a JS entrypoint, if so, which one?
  entrypointInBundle(bundle: URL): ModuleResolution | undefined;

  exportsFromBundle(
    bundle: URL
  ): Map<string, { module: ModuleResolution; name: string | NamespaceMarker }>;

  // locate(
  //   module: URL,
  //   exportedName: string | NamespaceMarker
  // ): { bundle: URL; exportedName: string };
}

export class SimpleBundleAssignments implements BundleAssignments {
  // keys are js module hrefs
  private modules: Map<string, URL> = new Map();
  bundles: URL[];

  constructor(private entryResolutions: ModuleResolution[]) {
    this.bundles = entryResolutions.map((res, index) => {
      let url = new URL(`/dist/${index}.js`, entryResolutions[0].url.origin);
      this.traverse(res, url);
      return url;
    });
  }

  private traverse(resolution: ModuleResolution, parentBundle: URL) {
    this.modules.set(resolution.url.href, parentBundle);
    for (let child of Object.values(resolution.imports)) {
      this.traverse(child.resolution, parentBundle);
    }
  }

  bundleForEntrypoint(jsModule: URL): URL {
    let bundle = this.modules.get(jsModule.href);
    if (!bundle) {
      throw new Error(`unknown js entrypoint ${jsModule.href}`);
    }
    return bundle;
  }

  entrypointInBundle(bundle: URL) {
    let found = this.bundles.find((b) => b.href === bundle.href);
    if (found) {
      return this.entryResolutions[this.bundles.indexOf(found)];
    }
  }

  exportsFromBundle(_bundle: URL) {
    return new Map();
  }
}
