import { BuilderNode, NextNode, AllNode, ConstantNode, Value } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { WriteFileNode } from "./file";
import uniqBy from "lodash/uniqBy";
import flatten from "lodash/flatten";
import { BundleAssignmentsNode, BundleNode, BundleAssignment } from "./bundle";
import { Resolver } from "../resolver";
import { LockEntries } from "./lock-file";

export interface Options {
  // parsing a bundle can be a very expensive operation, if the bundle
  // does not appear to be meant for js consumption (because it is
  // being built for an HTML entrypoint), then we should skip parsing
  // it. Also, we should consider skipping parsing in a "rebuilder"
  // situation when the developer is actively modifying the code
  // within the bundle.
  skipAnnotationForHtmlConsumedBundles: boolean; // defaults to true
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
export class MakeProjectNode implements BuilderNode<LockEntries> {
  cacheKey: string;
  private lockEntries: LockEntries = new Map();
  private optsWithDefaults: Options;

  constructor(
    private inputRoot: URL,
    readonly projectOutputRoot: URL,
    private resolver: Resolver,
    options?: Partial<Options>
  ) {
    this.cacheKey = `project:input=${inputRoot.href},output=${projectOutputRoot.href}`;
    this.optsWithDefaults = {
      skipAnnotationForHtmlConsumedBundles: true,
      ...options,
    };
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
        this.lockEntries,
        this.optsWithDefaults
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
    private lockEntries: LockEntries = new Map(),
    private options: Options
  ) {
    this.cacheKey = `finish-project:input=${inputRoot.href},output=${projectOutputRoot.href}`;
  }

  async deps() {
    let htmlEntrypoints = uniqBy(
      flatten(this.entrypoints).filter((e) => e instanceof HTMLEntrypoint),
      "destURL"
    ) as HTMLEntrypoint[];
    let bundleHrefsConsumedByHtml: Set<string> = new Set();
    for (let htmlEntrypoint of htmlEntrypoints) {
      let bundleHrefs = [...htmlEntrypoint.jsEntrypoints.keys()]
        .map(
          (entrypointHref) =>
            this.bundleAssignments.find(
              (a) => a.module.url.href === entrypointHref
            )!
        )
        .map((b) => b.bundleURL.href);
      bundleHrefsConsumedByHtml = new Set([
        ...bundleHrefsConsumedByHtml,
        ...bundleHrefs,
      ]);
    }
    let htmls = htmlEntrypoints.map(
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
            this.lockEntries,
            this.options.skipAnnotationForHtmlConsumedBundles &&
              bundleHrefsConsumedByHtml.has(bundleURL.href)
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
