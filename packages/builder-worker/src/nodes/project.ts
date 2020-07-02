import { BuilderNode, NextNode, AllNode, ConstantNode } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { WriteFileNode } from "./file";
import uniqBy from "lodash/uniqBy";
import flatten from "lodash/flatten";
import { BundleAssignmentsNode, BundleNode, BundleAssignment } from "./bundle";

export class MakeProjectsNode implements BuilderNode {
  cacheKey = this;
  constructor(private projectRoots: [URL, URL][]) {}

  deps() {
    return {
      bundleAssignments: new BundleAssignmentsNode(this.projectRoots),
    };
  }

  async run({
    bundleAssignments,
  }: {
    bundleAssignments: BundleAssignment[];
  }): Promise<NextNode<void[][]>> {
    return {
      node: new AllNode(
        this.projectRoots.map(
          ([inputRoot, outputRoot]) =>
            new MakeProjectNode(inputRoot, outputRoot, bundleAssignments)
        )
      ),
    };
  }
}

// This can leverage global bundle assignments (that spans all projects), or it
// can derive bundle assignments for just its own project. The latter is
// necessary in the scenario where you have a project that depends on the build
// of another project. We don't want to get trapped in a cycle when determining
// the global bundle assignments and encounter an import of an unbuilt bundle.
// Unbuilt bundles will be encountered during bundle assignment, but the cycle
// occurs because you need to do a bundle assignment in order to build the
// unbuilt bundle. Performing an individual project build without global
// assignments is how we break the cycle. This is analogous to a project that
// has a declared dependency on another project, and allowing the dependent
// project to build its specific bundle, which can then be consumed by the
// global bundle assignment effort.
export class MakeProjectNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private inputRoot: URL,
    private outputRoot: URL,
    private bundleAssignments?: BundleAssignment[]
  ) {
    this.cacheKey = `project:input=${inputRoot.href},output=${outputRoot.href}`;
  }

  deps() {
    let entrypoints = new EntrypointsJSONNode(this.inputRoot, this.outputRoot);
    let deps: {
      entrypoints: EntrypointsJSONNode;
      bundleAssignments?: BundleAssignmentsNode;
    } = {
      entrypoints,
    };
    if (!this.bundleAssignments) {
      deps.bundleAssignments = new BundleAssignmentsNode([
        [this.inputRoot, this.outputRoot],
      ]);
    }
    return deps;
  }

  async run({
    entrypoints,
    bundleAssignments,
  }: {
    entrypoints: Entrypoint[];
    bundleAssignments?: BundleAssignment[];
  }): Promise<NextNode<void[]>> {
    if (!bundleAssignments && !this.bundleAssignments) {
      throw new Error(
        `bug: there are no bundle assignments for the project ${this.cacheKey}`
      );
    }
    let assignments = (this.bundleAssignments ?? bundleAssignments)!;
    let htmls = (uniqBy(
      flatten(entrypoints).filter((e) => e instanceof HTMLEntrypoint),
      "destURL"
    ) as HTMLEntrypoint[]).map(
      (htmlEntrypoint) =>
        new WriteFileNode(
          new ConstantNode(htmlEntrypoint.render(assignments)),
          htmlEntrypoint.destURL
        )
    );

    let bundles = uniqBy(
      assignments.map((a) => a.bundleURL),
      (url) => url.href
    ).map(
      (bundleURL) =>
        new WriteFileNode(new BundleNode(bundleURL, assignments), bundleURL)
    );

    return { node: new AllNode([...htmls, ...bundles]) };
  }
}
