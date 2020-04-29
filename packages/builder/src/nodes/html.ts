import { DomUtils, parseDOM } from "htmlparser2";
import render from "dom-serializer";
import * as dom from "domhandler";
import {
  BuilderNode,
  JSONParseNode,
  NextNode,
  AllNode,
  OutputType,
  Value,
} from "./common";
import { FileNode } from "./file";
import { Memoize } from "typescript-memoize";
import { maybeURL, maybeRelativeURL } from "../path";
import { BundleAssignments } from "./bundle";

export interface EntrypointsMapping {
  [src: string]: string;
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

  async run({ json }: { json: any }): Promise<NextNode<HTMLEntrypoint[]>> {
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
  }): Promise<Value<HTMLEntrypoint>> {
    return {
      value: new HTMLEntrypoint(parsedHTML, this.dest),
    };
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

export class HTMLEntrypoint {
  constructor(private parsedHTML: dom.Node[], private dest: URL) {}

  get destURL() {
    return this.dest;
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

  render(assignments: BundleAssignments): string {
    for (let { element, url } of this.jsEntrypoints.values()) {
      let scriptAttrs = Object.assign({}, element.attribs);
      scriptAttrs.src = maybeRelativeURL(
        assignments.bundleFor(url).url,
        this.dest
      );
      this.replace(element, new dom.Element("script", scriptAttrs));
    }
    return render(this.parsedHTML);
  }
}
