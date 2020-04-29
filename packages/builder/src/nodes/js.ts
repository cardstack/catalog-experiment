import { BuilderNode, Value } from "./common";
import { WriteFileNode, FileNode } from "./file";
import { dirName, baseName, join } from "../path";
import { parse } from "@babel/core";
import { File } from "@babel/types";
import { Memoize } from "typescript-memoize";

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

export class JSEntrypointNode implements BuilderNode {
  cacheKey: string;

  constructor(private url: URL) {
    this.cacheKey = `js-entrypoint:${this.url.href}`;
  }

  @Memoize()
  get outputURL() {
    let outputURL = new URL(this.url.href);
    outputURL.pathname = join(
      dirName(this.url.pathname) || "/",
      `built-${baseName(this.url.pathname)}`
    );
    return outputURL;
  }

  deps() {
    return {
      copied: new WriteFileNode(new FileNode(this.url), this.outputURL),
    };
  }

  async run() {
    return {
      value: this.outputURL,
    };
  }
}
