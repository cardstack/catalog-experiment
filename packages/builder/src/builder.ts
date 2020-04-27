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
} from "./builder-nodes";

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
  output: Promise<{ node: CacheKey } | { value: unknown }>;
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
    return await this.evalNodes(this.roots, context);
  }

  async evalNodes<LocalInput>(
    nodes: LocalInput,
    context: CurrentContext
  ): Promise<OutputTypes<LocalInput>> {
    let results = {} as OutputTypes<LocalInput>;
    for (let [name, node] of Object.entries(nodes)) {
      (results as any)[name] = await this.evalNode(node, context);
    }
    return results;
  }

  async evalNode(node: BuilderNode, context: CurrentContext): Promise<unknown> {
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
      return result.value;
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
        output: (async () => {
          let inputs = await this.evalNodes(deps, context);
          if (WriteFileNode.isWriteFileNode(node)) {
            let fd = await this.fs.open(node.url, "file");
            await fd.write(Object.values(inputs)[0]);
            return { value: undefined };
          } else {
            return await node.run(inputs);
          }
        })(),
      };
    } else {
      return {
        name: "evaluating",
        node,
        deps: new Map(),
        output: (async () => {
          if (FileNode.isFileNode(node)) {
            let fd = await this.fs.open(node.url);
            return { value: await fd.readText() };
          } else {
            return await (node as BuilderNode<unknown, void>).run();
          }
        })(),
      };
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
