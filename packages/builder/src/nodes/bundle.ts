import {
  BuilderNode,
  Value,
  NextNode,
  AllNode,
  ConstantNode,
  BundleAssignments,
  BundleAssignmentMapping,
} from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint } from "./html";
import { WriteFileNode } from "./file";
import { ModuleResolutionsNode, ModuleResolution } from "./resolution";
import uniqBy from "lodash/uniqBy";

export class MakeBundledModulesNode implements BuilderNode {
  cacheKey = this;
  constructor(private projectRoots: URL[]) {}

  deps() {
    let htmlEntrypoints = new AllNode(
      this.projectRoots.map((root) => new EntrypointsJSONNode(root))
    );
    return {
      htmlEntrypoints,
      bundleAssignments: new BundleAssignmentsNode(this.projectRoots),
    };
  }

  async run({
    htmlEntrypoints,
    bundleAssignments,
  }: {
    htmlEntrypoints: HTMLEntrypoint[];
    bundleAssignments: BundleAssignments;
  }): Promise<NextNode<void[]>> {
    let writeNodes = uniqBy(htmlEntrypoints.flat(), "destURL").map(
      (htmlEntrypoint) =>
        new WriteFileNode(
          new ConstantNode(htmlEntrypoint.render(bundleAssignments)),
          htmlEntrypoint.destURL
        )
    );

    // TODO need to write bundle files too
    return { node: new AllNode(writeNodes) };
  }
}

export class BundleAssignmentsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: URL[]) {}

  deps() {
    return { resolutions: new ModuleResolutionsNode(this.projectRoots) };
  }

  private makeBundleMapping(
    resolutions: ModuleResolution[],
    bundleAssignments: BundleAssignmentMapping = {}
  ): BundleAssignmentMapping {
    for (let module of resolutions) {
      // This just trivially makes a single bundle of all your modules for now,
      // eventually we'll expand this to bundle in a much more sophisticated manner
      bundleAssignments[module.url.href] = new URL(
        `/dist/0.js`,
        module.url.origin
      );
      for (let n of Object.values(module.imports)) {
        this.makeBundleMapping([n], bundleAssignments);
      }
    }
    return bundleAssignments;
  }

  async run({
    resolutions,
  }: {
    resolutions: ModuleResolution[];
  }): Promise<Value<BundleAssignments>> {
    return {
      value: new BundleAssignments(this.makeBundleMapping(resolutions)),
    };
  }
}
