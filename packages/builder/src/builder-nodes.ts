import { DomUtils, parseDOM } from "htmlparser2";
import * as dom from "domhandler";
import { Memoize } from "typescript-memoize";
import render from "dom-serializer";
import { maybeURL, dirName, baseName, join, maybeRelativeURL } from "./path";

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

export class ConstantNode<T> implements BuilderNode<T, void> {
  cacheKey: string;

  private firstRun = true;

  constructor(private value: T) {
    this.cacheKey = `constant:${JSON.stringify(this.value)}`;
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

export class EntrypointsJSONNode implements BuilderNode {
  cacheKey: string;

  constructor(private root: URL) {
    this.cacheKey = `entrypoints-json:${this.root.href}`;
  }

  deps() {
    return {
      json: new JSONParseNode(
        new FileNode(new URL("entrypoints.json", this.root))
      ),
    };
  }

  private assertValid(json: any): asserts json is { [src: string]: string } {
    if (!json || typeof json !== "object") {
      throw new Error(`invalid entrypoints.json in ${this.root.href}`);
    }
    if (!Object.values(json).every((k) => typeof k === "string")) {
      throw new Error(`invalid entrypoints.json in ${this.root.href}`);
    }
  }

  async run({ json }: { json: any }): Promise<NextNode<void[]>> {
    this.assertValid(json);
    let htmlEntrypoints = [];
    for (let [src, dest] of Object.entries(json)) {
      htmlEntrypoints.push(
        new HTMLEntrypointNode(
          new URL(src, this.root),
          new URL(dest, this.root)
        )
      );
    }
    return { node: new AllNode(htmlEntrypoints) };
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

export class FileNode implements BuilderNode {
  isFileNode = true;
  cacheKey: string;

  static isFileNode(node: BuilderNode): node is FileNode {
    return "isFileNode" in node;
  }

  constructor(public url: URL) {
    this.cacheKey = `file:${this.url.href}`;
  }

  deps() {}

  async run(): Promise<Value<string>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}

export class WriteFileNode implements BuilderNode<void> {
  isWriteFileNode = true;
  cacheKey: string;

  static isWriteFileNode(node: BuilderNode): node is WriteFileNode {
    return "isWriteFileNode" in node;
  }

  constructor(private source: BuilderNode<string>, public url: URL) {
    this.cacheKey = `write-file:${this.url.href}`;
  }

  deps() {
    return { source: this.source };
  }

  async run(_args: { source: string }): Promise<Value<void>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}

export class HTMLParseNode implements BuilderNode {
  cacheKey: HTMLParseNode;

  constructor(private source: BuilderNode<string>) {
    this.cacheKey = this;
  }

  deps() {
    return { source: this.source };
  }

  async run({ source }: { source: string }) {
    return { value: parseDOM(source) };
  }
}

export class HTMLEntrypointNode implements BuilderNode {
  cacheKey: string;

  constructor(private src: URL, private dest: URL) {
    this.cacheKey = `html-entrypoint:${this.dest.href}`;
  }

  deps() {
    return {
      parsedHTML: new HTMLParseNode(new FileNode(this.src)),
    };
  }

  async run({
    parsedHTML,
  }: {
    parsedHTML: OutputType<HTMLParseNode>;
  }): Promise<NextNode<void>> {
    return {
      node: new WriteFileNode(
        new ReplaceScriptsNode(parsedHTML, this.dest),
        this.dest
      ),
    };
  }
}

export class ReplaceScriptsNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private parsedHTML: OutputType<HTMLParseNode>,
    private dest: URL
  ) {
    this.cacheKey = `replace-scripts:${this.dest.href}`;
  }

  private replace(from: dom.Element, to: dom.Element) {
    // if the script tag is actually a root node (i.e. not a descendant of <html>
    // element), we need to handle replacement a little diferently
    if (this.parsedHTML.includes(from)) {
      let index = this.parsedHTML.findIndex((i) => i === from);
      this.parsedHTML[index] = to;
    } else {
      DomUtils.replaceElement(from, to);
    }
  }

  @Memoize()
  get jsEntrypoints() {
    let jsEntrypoints: Map<
      string,
      { element: dom.Element; url: URL }
    > = new Map();
    let scripts = DomUtils.findAll(
      (el) => el.tagName === "script",
      this.parsedHTML
    );
    for (let element of scripts) {
      let url = maybeURL(element.attribs.src, this.dest);
      if (url && url.origin === this.dest.origin) {
        jsEntrypoints.set(url.href, { url, element });
      }
    }
    return jsEntrypoints;
  }

  deps() {
    let deps: { [key: string]: JSEntrypointNode } = {};
    for (let [key, { url }] of this.jsEntrypoints.entries()) {
      deps[key] = new JSEntrypointNode(url);
    }
    return deps;
  }

  async run(jsURLs: { [key: string]: URL }): Promise<Value<string>> {
    for (let [key, { element }] of this.jsEntrypoints) {
      let scriptAttrs = Object.assign({}, element.attribs);
      scriptAttrs.src = maybeRelativeURL(jsURLs[key], this.dest);
      this.replace(element, new dom.Element("script", scriptAttrs));
    }
    return { value: render(this.parsedHTML) };
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
