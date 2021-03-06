import { Recipe } from "../recipes";

export type OutputType<T> = T extends BuilderNode<infer Output>
  ? Output
  : never;

export type OutputTypes<T> = {
  [P in keyof T]: OutputType<T[P]>;
};

export type Value<T> = { value: T };
export type NextNode<T> = { node: BuilderNode<T> };
export type Unchanged = { unchanged: true };
export type NodeOutput<T> = Value<T> | NextNode<T> | Unchanged;

export type RecipeGetter = (
  pkgName: string,
  version: string
) => Promise<Recipe | undefined>;

export interface BuilderNode<Output = unknown, Input = unknown> {
  readonly cacheKey: any;
  deps(getRecipe: RecipeGetter): Promise<Input>;
  run(
    input: OutputTypes<Input>,
    getRecipe: RecipeGetter
  ): Promise<NodeOutput<Output>>;

  // if true, your `run` will always be called even when your inputs are all
  // unchanged
  volatile?: boolean;

  // optional and only valid on the root BuilderNodes that are passed directly
  // to the Builder. Used to link multiple projects together so that reads from
  // within your project's outputRoot will defer until your project has built.
  readonly projectOutputRoot?: URL;
}

const debugNames: WeakMap<BuilderNode, string> = new WeakMap();
let debugNameCounter = 0;

export function debugName(node: BuilderNode): string {
  let name = debugNames.get(node);
  if (!name) {
    let cacheKey = node.cacheKey;
    if (typeof cacheKey === "string") {
      const maxCacheKeyLen = 80;
      if (cacheKey.length > maxCacheKeyLen) {
        name = `${cacheKey.slice(0, maxCacheKeyLen)}...`;
      } else {
        name = cacheKey;
      }
    } else {
      name = `${node.constructor.name}:${debugNameCounter++}`;
    }
    debugNames.set(node, name);
  }
  return name;
}

export class ConstantNode<T> implements BuilderNode<T, void> {
  cacheKey: string;

  private firstRun = true;

  constructor(private value: T) {
    let stringified = JSON.stringify(this.value, (_, v) => {
      if (v instanceof Set) {
        return `Set(${JSON.stringify([...v])}`;
      } else if (v instanceof Map) {
        return `Map(${JSON.stringify([...v])}`;
      }
      return v;
    });
    this.cacheKey = `constant:${stringified}`;
  }
  async deps() {}
  async run(): Promise<NodeOutput<T>> {
    if (this.firstRun) {
      this.firstRun = false;
      return { value: this.value };
    } else {
      return { unchanged: true };
    }
  }
}

export class JSONParseNode
  implements BuilderNode<any, { input: BuilderNode<string> }> {
  constructor(private input: BuilderNode<string>) {
    this.cacheKey = this;
  }

  cacheKey: JSONParseNode;

  async deps() {
    return { input: this.input };
  }

  async run({ input }: { input: string }): Promise<Value<any>> {
    return { value: JSON.parse(input) };
  }
}

export class AllNode<T> implements BuilderNode {
  cacheKey: AllNode<T>;

  constructor(private nodes: BuilderNode<T>[]) {
    this.cacheKey = this;
  }
  async deps() {
    return this.nodes;
  }
  async run(results: { [key: string]: T }): Promise<Value<T[]>> {
    return { value: Object.values(results) };
  }
}
