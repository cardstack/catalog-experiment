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

export class Builder<Input> {
  nodeStates: Map<CacheKey, CompleteState> = new Map();
  watchedOrigins: Set<string> = new Set();
  recentlyChangedFiles: Set<string> = new Set();

  constructor(private fs: FileSystem, private roots: Input) {}

  static forProjects(fs: FileSystem, roots: URL[] | string[]) {
    let urls: URL[];
    if (
      roots.length > 0 &&
      (roots as any[]).every((r) => typeof r === "string")
    ) {
      urls = (roots as string[]).map((r) => new URL(r));
    } else {
      urls = roots as URL[];
    }
    return new Builder(fs, [new MakeBundledModulesNode(urls)]);
  }

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
      let fd = await this.fs.open(node.url);
      return { value: await fd.readText(), changed: true };
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
