import { FileSystem, Event } from "./filesystem";
import bind from "bind-decorator";
import {
  OutputTypes,
  BuilderNode,
  NodeOutput,
  debugName,
} from "./nodes/common";
import { FileNode, WriteFileNode } from "./nodes/file";
import { MakeBundledModulesNode } from "./nodes/make";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";
import { Deferred } from "./deferred";
import { assertNever } from "shared/util";

type BoolForEach<T> = {
  [P in keyof T]: boolean;
};

// nodes are allowed to use any type as their cacheKey, we use this alias to
// make our own types more readable
type CacheKey = unknown;

type InternalResult =
  | { node: BuilderNode; changed: boolean }
  | { value: unknown; changed: boolean };

type CurrentState = InitialState | EvaluatingState | CompleteState;

interface InitialState {
  name: "initial";
  node: BuilderNode;
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
}

class CurrentContext {
  nodeStates: Map<string, CurrentState> = new Map();
  constructor(public changedFiles: Set<string>) {}
}

class BuildRunner<Input> {
  private nodeStates: Map<CacheKey, CompleteState> = new Map();
  private watchedOrigins: Set<string> = new Set();
  private recentlyChangedFiles: Set<string> = new Set();

  constructor(
    private fs: FileSystem,
    private roots: Input,
    private inputDidChange?: () => void
  ) {}

  async build(): Promise<OutputTypes<Input>> {
    let context = new CurrentContext(this.recentlyChangedFiles);
    this.recentlyChangedFiles = new Set();
    let result = await this.evalNodes(this.roots, context);
    assertAllComplete(context.nodeStates);
    this.nodeStates = context.nodeStates;
    console.log(describeNodes(this.nodeStates));
    return result.values;
  }

  async evalNodes<LocalInput>(
    nodes: LocalInput,
    context: CurrentContext
  ): Promise<{
    values: OutputTypes<LocalInput>;
    changes: BoolForEach<LocalInput>;
  }> {
    let values = {} as OutputTypes<LocalInput>;
    let changes = {} as BoolForEach<LocalInput>;
    for (let [name, node] of Object.entries(nodes)) {
      let { value, changed } = await this.evalNode(node, context);
      (values as any)[name] = value;
      (changes as any)[name] = changed;
    }
    return { values, changes };
  }

  async evalNode(
    node: BuilderNode,
    context: CurrentContext
  ): Promise<{ value: unknown; changed: boolean }> {
    let state = context.nodeStates.get(node.cacheKey);

    if (state && state.name === "initial") {
      // somebody already created an initial state for this cacheKey, use that
      // node instance instead of the one we were given
      node = state.node;
      state = undefined;
    }

    let result;
    if (state) {
      result = await state.output;
    } else {
      state = this.startEvaluating(node, context);
      result = await state.output;
      context.nodeStates.set(node.cacheKey, {
        name: "complete",
        node,
        deps: state.deps,
        output: result,
      });
    }

    if ("node" in result) {
      return this.evalNode(result.node, context);
    } else {
      return result;
    }
  }

  private startEvaluating(
    node: BuilderNode,
    context: CurrentContext
  ): EvaluatingState {
    let deps = node.deps();
    let state: EvaluatingState;
    if (hasDeps(deps)) {
      let deduplicatedDeps: typeof deps = {};
      for (let [key, depNode] of Object.entries(deps)) {
        let existing = context.nodeStates.get(depNode.cacheKey);
        if (existing) {
          deduplicatedDeps[key] = existing.node;
        } else {
          context.nodeStates.set(depNode.cacheKey, {
            name: "initial",
            node: depNode,
          });
          deduplicatedDeps[key] = depNode;
        }
      }
      state = {
        name: "evaluating",
        node,
        deps: deduplicatedDeps,
        output: this.runNodeWithDeps(node, deduplicatedDeps, context),
      };
    } else {
      state = {
        name: "evaluating",
        node,
        deps: null,
        output: this.runNodeWithoutDeps(node, context),
      };
    }
    context.nodeStates.set(node.cacheKey, state);
    return state;
  }

  async runNodeWithDeps(
    node: BuilderNode,
    deps: object,
    context: CurrentContext
  ): Promise<InternalResult> {
    let inputs = await this.evalNodes(deps, context);
    if (Object.values(inputs.changes).every((didChange) => !didChange)) {
      let previous = this.nodeStates.get(node.cacheKey);
      if (previous) {
        // we have a previous answer, and all our inputs are unchanged, so
        // nothing to run
        return makeInternalResult(previous.output, false);
      }
    }

    if (WriteFileNode.isWriteFileNode(node)) {
      let fd = await this.fs.open(node.url, "file");
      await fd.write(Object.values(inputs.values)[0]);
      fd.close();
      return { value: undefined, changed: true };
    } else {
      return this.handleUnchanged(node, await node.run(inputs.values));
    }
  }

  async runNodeWithoutDeps(
    node: BuilderNode,
    context: CurrentContext
  ): Promise<InternalResult> {
    let previous = this.nodeStates.get(node.cacheKey);
    if (previous) {
      if (
        !FileNode.isFileNode(node) ||
        !context.changedFiles.has(node.url.href)
      ) {
        return makeInternalResult(previous.output, false);
      }
    }
    if (FileNode.isFileNode(node)) {
      this.ensureWatching(node.url);
      let fd: FileDescriptor | undefined;
      try {
        fd = (await this.fs.open(node.url)) as FileDescriptor;
        if (fd.type === "file") {
          return { value: await fd.readText(), changed: true };
        } else {
          throw new Error(
            `bug: expecting ${node.url} to be a file, but it was a directory`
          );
        }
      } finally {
        if (fd) {
          fd.close();
        }
      }
    } else {
      return this.handleUnchanged(
        node,
        await (node as BuilderNode<unknown, void>).run()
      );
    }
  }

  private ensureWatching(url: URL) {
    if (!this.watchedOrigins.has(url.origin)) {
      this.fs.addEventListener(url.origin, this.fileDidChange);
      this.watchedOrigins.add(url.origin);
    }
  }

  @bind
  private fileDidChange(event: Event) {
    this.recentlyChangedFiles.add(event.url.href);
    this.inputDidChange?.();
  }

  handleUnchanged(
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
    return new this(fs, [new MakeBundledModulesNode(roots)]);
  }

  async build(): ReturnType<BuildRunner<Input>["build"]> {
    return this.runner.build();
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
    return new this(fs, [new MakeBundledModulesNode(roots)]);
  }

  start() {
    if (this.state.name === "created") {
      this.run();
    }
  }

  @bind
  private inputDidChange() {
    if (this.state.name !== "shutdown-requested") {
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
          } catch (err) {
            console.error(`Exception while building`, err);
          }
          if (this.state.name === "working") {
            this.setState({ name: "idle" });
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
    while (this.state.name !== "shutdown") {
      await this.nextState.promise;
    }
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

function dotSafeName(node: BuilderNode): string {
  return debugName(node).replace(/"/g, '\\"');
}

function describeNodes(nodeStates: Map<CacheKey, CompleteState>) {
  let output = ["digraph {"];
  for (let state of nodeStates.values()) {
    let name = dotSafeName(state.node);
    output.push(`"${name}"`);
    if (state.deps) {
      for (let dep of Object.values(state.deps)) {
        output.push(`"${name}" -> "${dotSafeName(dep)}"`);
      }
    }
    if ("node" in state.output) {
      output.push(
        `"${name}" -> "${dotSafeName(state.output.node)}" [color="blue"]`
      );
    }
  }
  output.push("}");
  return output.join("\n");
}
