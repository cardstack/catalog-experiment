import { FileSystem } from "./filesystem";
import { parse } from "@babel/core";
import { File } from "@babel/types";
import { describeImports } from "./describe-imports";
import {
  OutputTypes,
  BuilderNode,
  FileNode,
  WriteFileNode,
  EntrypointsJSONNode,
  MaybeNode,
} from "./builder-nodes";

type BoolForEach<T> = {
  [P in keyof T]: boolean;
};

// nodes are allowed to use any type as their cacheKey, we use this alias to
// make our own types more readable
type CacheKey = any;

interface CompleteState {
  node: BuilderNode;

  // from name to node cacheKey
  deps: Map<string, CacheKey>;

  // the cacheKey of the node we output, or the actual value we output
  output: { node: CacheKey } | { value: unknown };
}

type CurrentState = InitialState | EvaluatingState;

interface InitialState {
  name: "initial";
  node: BuilderNode;
}
interface EvaluatingState {
  name: "evaluating";
  node: BuilderNode;
  deps: Map<string, CacheKey>;
  output: Promise<
    { node: CacheKey; changed: boolean } | { value: unknown; changed: boolean }
  >;
}

class CurrentContext {
  nodeStates: Map<string, CurrentState> = new Map();
  fileChanges: Set<string> = new Set();
}

export class Builder<Input> {
  nodeStates: Map<string, CompleteState> = new Map();

  constructor(private fs: FileSystem, private roots: Input) {}

  static forProject(fs: FileSystem, root: URL | string) {
    let url: URL;
    if (typeof root === "string") {
      url = new URL(root);
    } else {
      url = root;
    }
    return new Builder(fs, [new EntrypointsJSONNode(url)]);
  }

  async build(): Promise<OutputTypes<Input>> {
    let context = new CurrentContext();
    return (await this.evalNodes(this.roots, context)).values;
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

    if (!state) {
      state = this.startEvaluating(node, context);
    } else if (state.name === "initial") {
      state = this.startEvaluating(state.node, context);
    }

    let result = await state.output;

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
    let depsCacheKeys = new Map();
    if (typeof deps === "object" && deps != null) {
      for (let [name, depNode] of Object.entries(deps)) {
        depsCacheKeys.set(name, depNode.cacheKey);
        context.nodeStates.set(depNode.cacheKey, {
          name: "initial",
          node: depNode,
        });
      }
      return {
        name: "evaluating",
        node,
        deps: depsCacheKeys,
        output: this.handleUnchanged(
          node,
          this.runNodeWithDeps(node, deps, context)
        ),
      };
    } else {
      return {
        name: "evaluating",
        node,
        deps: new Map(),
        output: this.handleUnchanged(
          node,
          this.runNodeWithoutDeps(node, context)
        ),
      };
    }
  }

  async runNodeWithDeps(
    node: BuilderNode,
    deps: object,
    context: CurrentContext
  ) {
    let inputs = await this.evalNodes(deps, context);
    if (WriteFileNode.isWriteFileNode(node)) {
      let fd = await this.fs.open(node.url, "file");
      await fd.write(Object.values(inputs.values)[0]);
      return { value: undefined };
    } else {
      return await node.run(inputs.values);
    }
  }

  async runNodeWithoutDeps(node: BuilderNode, context: CurrentContext) {
    if (FileNode.isFileNode(node)) {
      let fd = await this.fs.open(node.url);
      return { value: await fd.readText() };
    } else {
      return await (node as BuilderNode<unknown, void>).run();
    }
  }

  async handleUnchanged(
    node: BuilderNode,
    p: Promise<MaybeNode<unknown>>
  ): Promise<
    | { value: unknown; changed: boolean }
    | { node: BuilderNode; changed: boolean }
  > {
    let result = await p;
    if ("unchanged" in result) {
      let previous = this.nodeStates.get(node.cacheKey);
      if (!previous) {
        throw new Error(
          `Node ${node.cacheKey} returned { unchanged: true } from its first run()`
        );
      }
      if ("node" in previous.output) {
        return { node: previous.output.node, changed: false };
      } else {
        return { value: previous.output.value, changed: false };
      }
    }
    if ("node" in result) {
      return { node: result.node, changed: true };
    } else {
      return { value: result.value, changed: true };
    }
  }
}

interface ResolvedModule {
  url: URL;
  imports: Map<string, ResolvedModule>;
}

interface AssignedModule extends ResolvedModule {
  bundle: URL;
}

class Other {
  private async resolveDependencies(moduleURL: URL): Promise<ResolvedModule> {
    let parsed = await this.parseJS(moduleURL);
    let imports = new Map() as Map<string, ResolvedModule>;
    await Promise.all(
      describeImports(parsed).map(async (desc) => {
        let depURL = await this.resolve(desc.specifier, moduleURL);
        imports.set(desc.specifier, await this.resolveDependencies(depURL));
      })
    );
    return {
      imports,
      url: moduleURL,
    };
  }

  private async assignBundles(
    entryModules: ResolvedModule[]
  ): Promise<AssignedModule[]> {
    for (let m of entryModules) {
      (m as AssignedModule).bundle = new URL(`/dist/0.js`, m.url.origin);
      for (let n of m.imports.values()) {
        await this.assignBundles([n]);
      }
    }
    return entryModules as AssignedModule[];
  }

  private async resolve(specifier: string, source: URL): Promise<URL> {
    return new URL(specifier, source);
  }

  private async parseJS(jsURL: URL): Promise<File> {
    let fd = await this.fs.open(jsURL);
    let stat = fd.stat;
    let cached = this.parseCache.get(jsURL.href);
    if (cached && cached.etag === stat.etag && cached.mtime === stat.mtime) {
      return cached.parsed;
    }
    let parsed = parse(await fd.readText(), {});
    if (!parsed || parsed.type !== "File") {
      throw new Error(`unexpected result from babel parse: ${parsed?.type}`);
    }
    this.parseCache.set(jsURL.href, {
      etag: stat.etag,
      mtime: stat.mtime,
      parsed,
    });
    return parsed;
  }
}
