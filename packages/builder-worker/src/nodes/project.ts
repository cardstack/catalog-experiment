import { BuilderNode, NextNode, AllNode, ConstantNode, Value } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { WriteFileNode } from "./file";
import uniqBy from "lodash/uniqBy";
import flatten from "lodash/flatten";
import { BundleAssignmentsNode, BundleNode, BundleAssignment } from "./bundle";
import { Resolver } from "../resolver";
import { LockEntries } from "./lock-file";

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
export class MakeProjectNode implements BuilderNode<LockEntries> {
  cacheKey: string;
  private lockEntries: LockEntries = new Map();

  constructor(
    private inputRoot: URL,
    readonly projectOutputRoot: URL,
    private resolver: Resolver
  ) {
    this.cacheKey = `project:input=${inputRoot.href},output=${projectOutputRoot.href}`;
  }

  async deps() {
    let entrypoints = new EntrypointsJSONNode(
      this.inputRoot,
      this.projectOutputRoot
    );
    return {
      entrypoints,
      bundleAssignments: new BundleAssignmentsNode(
        this.inputRoot,
        this.projectOutputRoot,
        this.resolver,
        this.lockEntries
      ),
    };
  }

  async run({
    entrypoints,
    bundleAssignments,
  }: {
    entrypoints: Entrypoint[];
    bundleAssignments: BundleAssignment[];
  }): Promise<NextNode<LockEntries>> {
    return {
      node: new FinishProjectNode(
        this.inputRoot,
        this.projectOutputRoot,
        entrypoints,
        bundleAssignments,
        this.resolver,
        this.lockEntries
      ),
    };
  }
}

class FinishProjectNode implements BuilderNode<LockEntries> {
  cacheKey: string;

  constructor(
    private inputRoot: URL,
    readonly projectOutputRoot: URL,
    private entrypoints: Entrypoint[],
    private bundleAssignments: BundleAssignment[],
    private resolver: Resolver,
    private lockEntries: LockEntries = new Map()
  ) {
    this.cacheKey = `finish-project:input=${inputRoot.href},output=${projectOutputRoot.href}`;
  }

  async deps() {
    let htmls = (uniqBy(
      flatten(this.entrypoints).filter((e) => e instanceof HTMLEntrypoint),
      "destURL"
    ) as HTMLEntrypoint[]).map(
      (htmlEntrypoint) =>
        new WriteFileNode(
          new ConstantNode(htmlEntrypoint.render(this.bundleAssignments)),
          htmlEntrypoint.destURL
        )
    );

    let bundles = uniqBy(
      this.bundleAssignments.map((a) => a.bundleURL),
      (url) => url.href
    ).map(
      (bundleURL) =>
        new WriteFileNode(
          new BundleNode(
            bundleURL,
            this.inputRoot,
            this.projectOutputRoot,
            this.resolver,
            this.lockEntries
          ),
          bundleURL
        )
    );

    return { build: new AllNode([...htmls, ...bundles]) };
  }

  async run(): Promise<Value<LockEntries>> {
    return { value: this.lockEntries };
  }
}
