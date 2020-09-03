import { FileSystem, isFileEvent, ListingEntry } from "./filesystem";
import { addEventListener, Event, dispatchEvent } from "./event-bus";
import bind from "bind-decorator";
import {
  OutputTypes,
  BuilderNode,
  NodeOutput,
  debugName,
} from "./nodes/common";
import {
  FileNode,
  WriteFileNode,
  MountNode,
  FileExistsNode,
  FileListingNode,
} from "./nodes/file";
import { MakeProjectNode } from "./nodes/project";
import {
  FileDescriptor,
  FileSystemDriver,
} from "./filesystem-drivers/filesystem-driver";
import { Deferred } from "./deferred";
import { assertNever } from "@catalogjs/shared/util";
import { error } from "./logger";
import sortBy from "lodash/sortBy";
import { Resolver } from "./resolver";

type BoolForEach<T> = {
  [P in keyof T]: boolean;
};

// nodes are allowed to use any type as their cacheKey, we use this alias to
// make our own types more readable
type CacheKey = unknown;

type InternalResult =
  | { node: BuilderNode; changed: boolean }
  | { value: unknown; changed: boolean };

type CurrentState =
  | InitialState
  | ReusedState
  | EvaluatingState
  | CompleteState;

interface InitialState {
  name: "initial";
  node: BuilderNode;
}

interface ReusedState {
  name: "reused";
  node: BuilderNode;
  deps: { [name: string]: BuilderNode } | null;
}

interface EvaluatingState {
  name: "evaluating";
  node: BuilderNode;
  deps: { [name: string]: BuilderNode } | null;
  output: Promise<InternalResult>;
}

interface CompleteState {
  name: "complete";
  node: BuilderNode;
  deps: { [name: string]: BuilderNode } | null;
  output: InternalResult;
  didChange: boolean;
}

type Explanation = Map<
  string,
  {
    // this is the set of nodes that the given node asked for as dependencies
    dependencies: Set<string>;

    // these are the actual results that were returned, which can differ because
    // a node can return another node as its output
    inputs: Set<string>;

    // this is the node returned by the given node, if any
    created: string | undefined;

    // did this node change in the most recent build
    didChange: boolean;
  }
>;

class CurrentContext {
  nodeStates: Map<string, CurrentState> = new Map();
  constructor(public changedFiles: Set<string>) {}
}

class BuildRunner<Input> {
  private nodeStates: Map<CacheKey, CompleteState> = new Map();
  private watchedFiles: Set<string> = new Set();
  private recentlyChangedFiles: Set<string> = new Set();
  private currentContext: CurrentContext | undefined;

  constructor(
    private fs: FileSystem,
    private roots: Input,
    private inputDidChange?: () => void
  ) {}

  explain(): Explanation {
    let explanation: Explanation = new Map();
    for (let state of this.nodeStates.values()) {
      let dependencies = new Set<string>();
      let inputs = new Set<string>();
      if (state.deps) {
        for (let dep of Object.values(state.deps)) {
          dependencies.add(debugName(dep));

          let entry = this.nodeStates.get(dep.cacheKey)!;
          while ("node" in entry.output) {
            // keep following output.node, because that is what actually
            // provides our inputs.
            dep = entry.output.node;
            entry = this.nodeStates.get(dep.cacheKey)!;
          }
          inputs.add(debugName(dep));
        }
      }
      let created: string | undefined;
      if ("node" in state.output) {
        created = debugName(state.output.node);
      }
      explanation.set(debugName(state.node), {
        dependencies,
        inputs,
        created,
        didChange: state.didChange,
      });
    }
    return explanation;
  }

  async build(): Promise<OutputTypes<Input>> {
    let context = new CurrentContext(this.recentlyChangedFiles);
    this.currentContext = context;
    this.recentlyChangedFiles = new Set();
    let result = await this.evalNodes(this.roots);
    assertAllComplete(context.nodeStates);
    this.nodeStates = context.nodeStates;
    this.currentContext = undefined;
    return result.values;
  }

  @bind
  private getCurrentContext(): CurrentContext {
    if (this.currentContext) {
      return this.currentContext;
    }
    throw new Error(`bug: tried to access currentContext outside of a build`);
  }

  private async evalNodes<LocalInput>(
    nodes: LocalInput,
    stack: BuilderNode[] = []
  ): Promise<{
    values: OutputTypes<LocalInput>;
    changes: BoolForEach<LocalInput>;
  }> {
    let values = {} as OutputTypes<LocalInput>;
    let changes = {} as BoolForEach<LocalInput>;
    for (let [name, node] of Object.entries(nodes)) {
      let { value, changed } = await this.evalNode(node, stack);
      (values as any)[name] = value;
      (changes as any)[name] = changed;
    }
    return { values, changes };
  }

  private getNodeState(node: BuilderNode): CurrentState {
    let state = this.getCurrentContext().nodeStates.get(node.cacheKey);
    if (state) {
      return state;
    }

    // if we had the same cacheKey in the previous build, reuse the Node
    // instance. This lets nodes do stateful optimizations.
    let lastState = this.nodeStates.get(node.cacheKey);
    if (lastState) {
      return {
        name: "reused",
        node: lastState.node,
        deps: lastState.deps,
      };
    }

    return {
      name: "initial",
      node,
    };
  }

  private async evalNode(
    node: BuilderNode,
    stack: BuilderNode[]
  ): Promise<{ value: unknown; changed: boolean }> {
    let state = this.getNodeState(node);

    switch (state.name) {
      case "initial":
        let realNode = this.internalize(state.node);
        return this.handleNextNode(
          await this.evaluate(realNode, realNode.deps(), stack),
          stack
        );
      case "reused":
        return this.handleNextNode(
          await this.evaluate(state.node, state.deps, stack),
          stack
        );
      case "evaluating":
      case "complete":
        return this.handleNextNode(await state.output, stack);
      default:
        throw assertNever(state);
    }
  }

  private internalize(node: BuilderNode) {
    if (FileNode.isFileNode(node)) {
      return new InternalFileNode(
        node.url,
        this.fs,
        this.getCurrentContext,
        this.roots,
        this.ensureWatching
      );
    }

    if (WriteFileNode.isWriteFileNode(node)) {
      return new InternalWriteFileNode(node, this.fs);
    }

    if (MountNode.isMountNode(node)) {
      return new InternalMountNode(node, this.fs);
    }

    if (FileExistsNode.isFileExistsNode(node)) {
      return new InternalFileExistsNode(node, this.fs);
    }

    if (FileListingNode.isFileListingNode(node)) {
      return new InternalFileListingNode(node, this.fs);
    }

    return node;
  }

  private async evaluate(
    node: BuilderNode,
    maybeDeps: unknown,
    stack: BuilderNode[]
  ) {
    let state = this.startEvaluating(node, maybeDeps, stack);
    let result = await state.output;
    this.getCurrentContext().nodeStates.set(node.cacheKey, {
      name: "complete",
      node,
      deps: state.deps,
      output: result,
      didChange: result.changed,
    });
    return result;
  }

  private startEvaluating(
    node: BuilderNode,
    maybeDeps: unknown,
    stack: BuilderNode[]
  ): EvaluatingState {
    let deps: EvaluatingState["deps"];

    if (hasDeps(maybeDeps)) {
      let deduplicatedDeps: typeof maybeDeps = {};
      for (let [key, depNode] of Object.entries(maybeDeps)) {
        let existing = this.getNodeState(depNode);
        if (existing) {
          deduplicatedDeps[key] = existing.node;
        } else {
          this.getCurrentContext().nodeStates.set(depNode.cacheKey, {
            name: "initial",
            node: depNode,
          });
          deduplicatedDeps[key] = depNode;
        }
      }
      deps = deduplicatedDeps;
    } else {
      deps = null;
    }

    let output = this.runNode(node, deps, stack);
    let state: EvaluatingState = {
      name: "evaluating",
      node,
      deps,
      output,
    };
    this.getCurrentContext().nodeStates.set(node.cacheKey, state);
    return state;
  }

  private async handleNextNode(
    result: InternalResult,
    stack: BuilderNode[]
  ): Promise<{ value: unknown; changed: boolean }> {
    if ("node" in result) {
      if (stack.map((n) => n.cacheKey).includes(result.node.cacheKey)) {
        throw new Error(
          `cycle in builder: ${stack
            .map((n) =>
              typeof n.cacheKey === "string" ? n.cacheKey : n.constructor.name
            )
            .join(" => ")} => ${
            typeof result.node.cacheKey === "string"
              ? result.node.cacheKey
              : result.node.constructor.name
          }`
        );
      }
      return this.evalNode(result.node, stack);
    } else {
      return result;
    }
  }

  private async runNode(
    node: BuilderNode,
    deps: EvaluatingState["deps"],
    stack: BuilderNode[]
  ): Promise<InternalResult> {
    let inputs = deps ? await this.evalNodes(deps, [...stack, node]) : null;
    let previous = this.nodeStates.get(node.cacheKey);
    if (previous && !node.volatile) {
      let stableInputs: boolean;
      if (inputs) {
        stableInputs = Object.values(inputs.changes).every(
          (didChange) => !didChange
        );
      } else {
        stableInputs = true;
      }
      if (stableInputs) {
        return makeInternalResult(previous.output, false);
      }
    }

    if (inputs) {
      return this.handleUnchanged(node, await node.run(inputs.values));
    } else {
      return this.handleUnchanged(
        node,
        await (node as BuilderNode<unknown, void>).run()
      );
    }
  }

  @bind
  private ensureWatching(url: URL) {
    if (!this.watchedFiles.has(url.href)) {
      addEventListener(this.fileDidChange);
      this.watchedFiles.add(url.href);
    }
  }

  @bind
  private fileDidChange(event: Event) {
    if (isFileEvent(event) && this.watchedFiles.has(event.filesystem!.href)) {
      this.recentlyChangedFiles.add(event.filesystem!.href);
      this.inputDidChange?.();
    }
  }

  private handleUnchanged(
    node: BuilderNode,
    result: NodeOutput<unknown>
  ): InternalResult {
    if ("unchanged" in result) {
      let previous = this.nodeStates.get(node.cacheKey);
      if (!previous) {
        throw new Error(
          `Node ${node.cacheKey} returned { unchanged: true } from its first run()`
        );
      }
      return makeInternalResult(previous.output, false);
    }
    return makeInternalResult(result, true);
  }
}

export class Builder<Input> {
  private runner: BuildRunner<Input>;

  constructor(fs: FileSystem, roots: Input) {
    this.runner = new BuildRunner(fs, roots);
  }

  // roots lists [inputRoot, outputRoot]
  static forProjects(fs: FileSystem, roots: [URL, URL][]) {
    return new this(fs, projectsToNodes(roots, fs));
  }

  async build(): ReturnType<BuildRunner<Input>["build"]> {
    return this.runner.build();
  }

  explain(): Explanation {
    return this.runner.explain();
  }
}

type RebuilderState =
  | {
      name: "created";
    }
  | {
      name: "working";
    }
  | {
      name: "idle";
      lastBuildSucceeded: true;
    }
  | {
      name: "idle";
      lastBuildSucceeded: false;
      error: Error;
    }
  | {
      name: "shutdown-requested";
    }
  | {
      name: "rebuild-requested";
    }
  | {
      name: "shutdown";
    };

export class Rebuilder<Input> {
  private runner: BuildRunner<Input>;
  private state: RebuilderState = {
    name: "created",
  };
  private nextState: Deferred<RebuilderState> = new Deferred();

  constructor(fs: FileSystem, roots: Input) {
    this.runner = new BuildRunner(fs, roots, this.inputDidChange);
  }

  // roots lists [inputRoot, outputRoot]
  static forProjects(fs: FileSystem, roots: [URL, URL][]) {
    for (let [input, output] of roots) {
      if (input.origin === output.origin) {
        throw new Error(
          `The input root origin ${input.href} cannot be the same as the output root origin ${output}. This situation triggers a run away rebuild.`
        );
      }
    }
    return new this(fs, projectsToNodes(roots, fs));
  }

  get status():
    | { name: "not started" }
    | { name: "succeeded" }
    | { name: "failed"; exception: Error }
    | { name: "running" } {
    if (this.state.name === "idle") {
      return this.state.lastBuildSucceeded
        ? { name: "succeeded" }
        : { name: "failed", exception: this.state.error };
    } else if (this.state.name === "created") {
      return { name: "not started" };
    } else {
      return { name: "running" };
    }
  }

  start() {
    if (this.state.name === "created") {
      this.run();
    }
  }

  // used to manually request a build
  async build() {
    if (this.status.name === "not started") {
      this.start();
    } else {
      await this.isIdle();
      this.setState({ name: "rebuild-requested" });
    }
    await this.isIdle();
  }

  @bind
  private inputDidChange() {
    switch (this.state.name) {
      case "shutdown-requested":
      case "shutdown":
        // shutdown takes precedence
        break;
      default:
        this.setState({ name: "rebuild-requested" });
    }
  }

  private setState(newState: RebuilderState): void {
    this.state = newState;
    let nextState = this.nextState;
    this.nextState = new Deferred();
    nextState.resolve(newState);
  }

  private async run(): Promise<void> {
    while (true) {
      switch (this.state.name) {
        case "created":
          this.setState({ name: "working" });
          break;
        case "working":
          try {
            await this.runner.build();
            if (this.state.name === "working") {
              this.setState({ name: "idle", lastBuildSucceeded: true });
              dispatchEvent({ reload: true } as Event);
            }
          } catch (err) {
            if (this.state.name === "working") {
              this.setState({
                name: "idle",
                lastBuildSucceeded: false,
                error: err,
              });
            }
            error(`Exception while building`, err);
          }
          break;
        case "idle":
          await this.nextState.promise;
          break;
        case "rebuild-requested":
          this.setState({ name: "working" });
          break;
        case "shutdown-requested":
          this.setState({ name: "shutdown" });
          break;
        case "shutdown":
          return;
        default:
          throw assertNever(this.state);
      }
    }
  }

  async isIdle(): Promise<void> {
    while (this.state.name !== "idle") {
      await this.nextState.promise;
    }
  }

  async shutdown(): Promise<void> {
    if (this.state.name === "created") {
      // we want to kick off the run loop so that this builder can't be reused
      this.run();
    }
    this.setState({ name: "shutdown-requested" });
    while (this.state.name !== "shutdown") {
      await this.nextState.promise;
    }
  }

  explain(): Explanation {
    return this.runner.explain();
  }
}

function hasDeps(deps: unknown): deps is { [key: string]: BuilderNode } {
  return typeof deps === "object" && deps != null;
}

function makeInternalResult(
  input: { value: unknown } | { node: BuilderNode },
  changed: boolean
): InternalResult {
  if ("node" in input) {
    return { node: input.node, changed };
  } else {
    return { value: input.value, changed };
  }
}

function assertAllComplete(
  nodeStates: Map<CacheKey, CurrentState>
): asserts nodeStates is Map<CacheKey, CompleteState> {
  for (let state of nodeStates.values()) {
    if (state.name !== "complete") {
      throw new Error(
        `bug: found a node that was not in state "complete" at the end of the build: ${state.node.cacheKey}`
      );
    }
  }
}

function dotSafeName(name: string): string {
  return name.replace(/"/g, '\\"');
}

export function explainAsDot(explanation: Explanation): string {
  let output = ["digraph {"];
  for (let [debugName, { inputs, created, didChange }] of explanation) {
    let name = dotSafeName(debugName);

    // nodes with red outlines have changed on the last build.
    output.push(`"${name}" ${didChange ? '[color="red"]' : ""}`);

    for (let prevNode of inputs) {
      output.push(`"${name}" -> "${dotSafeName(prevNode)}" [dir="back"]`);
    }

    if (created) {
      output.push(
        `"${dotSafeName(created)}" -> "${name}" [color="blue",dir="back"]`
      );
    }
  }
  output.push("}");
  return output.join("\n");
}

function projectsToNodes(roots: [URL, URL][], fs: FileSystem) {
  return roots.map(
    ([input, output]) => new MakeProjectNode(input, output, new Resolver(fs))
  );
}

class InternalFileNode<Input> implements BuilderNode<string> {
  cacheKey: string;
  volatile = true;

  private firstRun = true;

  constructor(
    private url: URL,
    private fs: FileSystem,
    private getCurrentContext: () => CurrentContext,
    private roots: Input,
    private ensureWatching: BuildRunner<Input>["ensureWatching"]
  ) {
    this.cacheKey = `file:${this.url.href}`;
  }

  deps() {
    // TODO a more rigorous way to do this is to match the entrypoints.json file directly
    let matchingRoots = (Object.values(this.roots) as BuilderNode[]).filter(
      (rootNode) =>
        rootNode.projectOutputRoot &&
        this.url.href.startsWith(rootNode.projectOutputRoot.href)
    );
    // find the closest matching root to our file URL, which will be the root
    // that has the longest URL (in this case one project has an output URL that
    // is the parent of another project)
    if (matchingRoots.length > 0) {
      let rootNode = sortBy(
        matchingRoots,
        (rootNode) => rootNode.projectOutputRoot!.href.length
      ).pop()!;
      return { dependsOnProject: rootNode };
    }
    return undefined;
  }

  async run(dependsOnProject: unknown): Promise<NodeOutput<string>> {
    if (
      !this.firstRun &&
      !this.getCurrentContext().changedFiles.has(this.url.href)
    ) {
      return { unchanged: true };
    }
    if (this.firstRun) {
      this.firstRun = false;
    }

    if (!dependsOnProject) {
      this.ensureWatching(this.url);
    }
    let fd: FileDescriptor | undefined;
    try {
      fd = await this.fs.openFile(this.url);
      if (fd.type === "file") {
        return { value: await fd.readText() };
      } else {
        throw new Error(
          `bug: expecting ${this.url} to be a file, but it was a directory`
        );
      }
    } finally {
      if (fd) {
        await fd.close();
      }
    }
  }
}

class InternalWriteFileNode implements BuilderNode<void> {
  private source: BuilderNode<string>;
  private url: URL;
  cacheKey: string;
  constructor(writeFileNode: WriteFileNode, private fs: FileSystem) {
    this.source = writeFileNode.deps().source;
    this.url = writeFileNode.url;
    this.cacheKey = `write-file:${this.url.href}`;
  }
  deps() {
    return { source: this.source };
  }
  async run({ source }: { source: string }): Promise<NodeOutput<void>> {
    let fd = await this.fs.openFile(this.url, true);
    try {
      await fd.write(source);
    } finally {
      await fd.close();
    }
    return { value: undefined };
  }
}

class InternalMountNode implements BuilderNode<URL> {
  private mountURL: URL;
  private driver: FileSystemDriver;
  cacheKey: string;

  constructor(mountNode: MountNode, private fs: FileSystem) {
    this.mountURL = mountNode.mountURL;
    this.driver = mountNode.driver;
    this.cacheKey = `mount:${this.mountURL.href}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<URL>> {
    await this.fs.mount(this.mountURL, this.driver);
    return { value: this.mountURL };
  }
}

class InternalFileExistsNode implements BuilderNode<boolean> {
  private url: URL;
  cacheKey: string;
  constructor(fileExistsNode: FileExistsNode, private fs: FileSystem) {
    this.url = fileExistsNode.url;
    this.cacheKey = `file-exists:${this.url.href}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<boolean>> {
    try {
      await (await this.fs.open(this.url)).close();
      return { value: true };
    } catch (e) {
      if (e.code === "NOT_FOUND") {
        return { value: false };
      }
      throw e;
    }
  }
}

class InternalFileListingNode implements BuilderNode<ListingEntry[]> {
  private url: URL;
  private recurse: boolean;
  cacheKey: string;
  constructor(fileListingNode: FileListingNode, private fs: FileSystem) {
    this.url = fileListingNode.url;
    this.recurse = Boolean(fileListingNode.recurse);
    this.cacheKey = `file-listing:${this.url.href}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<ListingEntry[]>> {
    return { value: await this.fs.list(this.url, this.recurse) };
  }
}
