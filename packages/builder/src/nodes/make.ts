import { BuilderNode, NextNode, AllNode, ConstantNode } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint } from "./html";
import { WriteFileNode } from "./file";
import uniqBy from "lodash/uniqBy";
import { BundleAssignmentsNode, BundleNode, BundleAssignments } from "./bundle";

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
    let htmls = uniqBy(htmlEntrypoints.flat(), "destURL").map(
      (htmlEntrypoint) =>
        new WriteFileNode(
          new ConstantNode(htmlEntrypoint.render(bundleAssignments)),
          htmlEntrypoint.destURL
        )
    );

    let bundles = bundleAssignments.bundles.map(
      (bundle) =>
        new WriteFileNode(new BundleNode(bundle, bundleAssignments), bundle.url)
    );

    return { node: new AllNode([...htmls, ...bundles]) };
  }
}
