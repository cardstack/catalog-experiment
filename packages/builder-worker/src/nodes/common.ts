export const annotationStart = `\n/*====catalogjs annotation start====\n`;
export const annotationEnd = `\n====catalogjs annotation end====*/`;
export const annotationRegex = /\/\*====catalogjs annotation start====\n(.+)\n====catalogjs annotation end====\*\//;

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

export interface BuilderNode<Output = unknown, Input = unknown> {
  readonly cacheKey: any;
  deps(): Input;
  run(input: OutputTypes<Input>): Promise<NodeOutput<Output>>;
}

const debugNames: WeakMap<BuilderNode, string> = new WeakMap();
let debugNameCounter = 0;

export function debugName(node: BuilderNode): string {
  const maxCacheKeyLen = 60;
  let cacheKey = node.cacheKey;
  if (typeof cacheKey === "string") {
    if (cacheKey.length > maxCacheKeyLen) {
      return `${cacheKey.slice(0, maxCacheKeyLen)}...`;
    } else {
      return cacheKey;
    }
  }
  let name = debugNames.get(node);
  if (!name) {
    name = `${node.constructor.name}:${debugNameCounter++}`;
    debugNames.set(node, name);
  }
  return name;
}

export class ConstantNode<T> implements BuilderNode<T, void> {
  cacheKey: string;

  private firstRun = true;

  constructor(private value: T) {
    this.cacheKey = `constant:${
      typeof this.value === "string" ? this.value : JSON.stringify(this.value)
    }`;
  }
  deps() {}
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

  deps() {
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
  deps() {
    return this.nodes;
  }
  async run(results: { [key: string]: T }): Promise<Value<T[]>> {
    return { value: Object.values(results) };
  }
}
