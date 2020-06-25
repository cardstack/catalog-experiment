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
import { BundleAssignment } from "./bundle";

interface EntrypointsJSON {
  html?: string[];
  js?: string[];
}

export class EntrypointsJSONNode implements BuilderNode {
  cacheKey: string;

  constructor(private inputRoot: URL, private outputRoot: URL) {
    this.cacheKey = `entrypoints-json:${this.inputRoot.href}:${this.outputRoot.href}`;
  }

  deps() {
    return {
      json: new JSONParseNode(
        new FileNode(new URL("entrypoints.json", this.inputRoot))
      ),
    };
  }

  private assertValid(json: any): asserts json is EntrypointsJSON {
    if (
      !json ||
      typeof json !== "object" ||
      (!("html" in json) && !("js" in json))
    ) {
      throw new Error(`invalid entrypoints.json in ${this.inputRoot.href}`);
    }
    if (
      "html" in json &&
      (!Array.isArray(json.html) ||
        !json.html.every((k: any) => typeof k === "string"))
    ) {
      throw new Error(`invalid entrypoints.json in ${this.inputRoot.href}`);
    }
    if (
      "js" in json &&
      (!Array.isArray(json.js) ||
        !json.js.every((k: any) => typeof k === "string"))
    ) {
      throw new Error(`invalid entrypoints.json in ${this.inputRoot.href}`);
    }
  }

  async run({ json }: { json: any }): Promise<NextNode<HTMLEntrypoint[]>> {
    this.assertValid(json);
    let htmlEntrypoints = [];
    if (json.html) {
      for (let src of json.html) {
        htmlEntrypoints.push(
          new HTMLEntrypointNode(
            new URL(src, this.inputRoot),
            new URL(src, this.outputRoot)
          )
        );
      }
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
      value: new HTMLEntrypoint(this.src, this.dest, parsedHTML),
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
  constructor(
    private src: URL,
    private dest: URL,
    private parsedHTML: dom.Node[]
  ) {}

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
      if (!element.attribs.src) {
        continue;
      }
      if (element.attribs.type !== "module") {
        // TODO need to deal with non-module js files...
        continue;
      }
      let url = maybeURL(element.attribs.src, this.src);
      if (url && url.origin === this.src.origin) {
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

  render(assignments: BundleAssignment[]): string {
    for (let { element, url } of this.jsEntrypoints.values()) {
      let scriptAttrs = Object.assign({}, element.attribs);
      scriptAttrs.src = maybeRelativeURL(
        assignments.find((a) => a.module.url.href === url.href)?.bundleURL!,
        this.dest
      );
      this.replace(element, new dom.Element("script", scriptAttrs));
    }
    return render(this.parsedHTML);
  }
}
