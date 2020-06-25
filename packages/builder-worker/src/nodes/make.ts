import { BuilderNode, NextNode, AllNode, ConstantNode } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { WriteFileNode } from "./file";
import uniqBy from "lodash/uniqBy";
import flatten from "lodash/flatten";
import { BundleAssignmentsNode, BundleNode, BundleAssignment } from "./bundle";

export class MakeBundledModulesNode implements BuilderNode {
  cacheKey = this;
  constructor(private projectRoots: [URL, URL][]) {}

  deps() {
    let entrypoints = new AllNode(
      this.projectRoots.map(
        ([inputRoot, outputRoot]) =>
          new EntrypointsJSONNode(inputRoot, outputRoot)
      )
    );
    return {
      entrypoints,
      bundleAssignments: new BundleAssignmentsNode(this.projectRoots),
    };
  }

  async run({
    entrypoints,
    bundleAssignments,
  }: {
    entrypoints: Entrypoint[];
    bundleAssignments: BundleAssignment[];
  }): Promise<NextNode<void[]>> {
    let htmls = (uniqBy(
      flatten(entrypoints).filter((e) => e instanceof HTMLEntrypoint),
      "destURL"
    ) as HTMLEntrypoint[]).map(
      (htmlEntrypoint) =>
        new WriteFileNode(
          new ConstantNode(htmlEntrypoint.render(bundleAssignments)),
          htmlEntrypoint.destURL
        )
    );

    let bundles = uniqBy(
      bundleAssignments.map((a) => a.bundleURL),
      (url) => url.href
    ).map(
      (bundleURL) =>
        new WriteFileNode(
          new BundleNode(bundleURL, bundleAssignments),
          bundleURL
        )
    );

    return { node: new AllNode([...htmls, ...bundles]) };
  }
}
