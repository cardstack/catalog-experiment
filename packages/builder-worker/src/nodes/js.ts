import { BuilderNode, Value } from "./common";
import { parse } from "@babel/core";
import { File } from "@babel/types";

export class JSParseNode implements BuilderNode {
  cacheKey = this;

  constructor(private source: BuilderNode<string>) {}

  deps() {
    return { source: this.source };
  }

  async run({ source }: { source: string }): Promise<Value<File>> {
    let parsed = parse(source);
    if (!parsed || parsed.type !== "File") {
      throw new Error(`unexpected result from babel parse: ${parsed?.type}`);
    }

    return {
      value: parsed,
    };
  }
}
