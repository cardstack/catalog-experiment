import { DomUtils, parseDOM } from "htmlparser2";
import * as dom from "domhandler";
import { Memoize } from "typescript-memoize";
import render from "dom-serializer";
import { maybeURL } from "./path";

export type OutputType<T> = T extends BuilderNode<infer Output>
  ? Output
  : never;

export type OutputTypes<T> = {
  [P in keyof T]: OutputType<T[P]>;
};

export type Value<T> = { value: T };
export type NextNode<T> = { node: BuilderNode<T> };
export type MaybeNode<T> = Value<T> | NextNode<T>;

export interface BuilderNode<Output = unknown, Input = unknown> {
  deps(): Input;
  run(input: OutputTypes<Input>): Promise<MaybeNode<Output>>;
}

export class ConstantNode<T> implements BuilderNode<T, void> {
  constructor(private value: T) {}
  deps() {}
  async run() {
    return { value: this.value };
  }
}

export class JSONParseNode
  implements BuilderNode<any, { input: BuilderNode<string> }> {
  constructor(private input: BuilderNode<string>) {}

  deps() {
    return { input: this.input };
  }

  async run({ input }: { input: string }): Promise<Value<any>> {
    return { value: JSON.parse(input) };
  }
}

// export class EntrypointsNode extends BuilderNode {
//   constructor(private root: URL) {
//     super({
//       json: new JSONParseNode(new FileNode(new URL("entrypoints.json", root))),
//     });
//   }

//   private assertValid(json: any): asserts json is { [src: string]: string } {
//     if (!json || typeof json !== "object") {
//       throw new Error(`invalid entrypoints.json in ${this.root.href}`);
//     }
//     if (!Object.values(json).every((k) => typeof k === "string")) {
//       throw new Error(`invalid entrypoints.json in ${this.root.href}`);
//     }
//   }

//   async run({ json }) {
//     this.assertValid(json);
//     let htmlEntrypoints = [];
//     for (let [src, dest] of Object.entries(json)) {
//       htmlEntrypoints.push(
//         new HTMLEntrypointNode(
//           new URL(src, this.root),
//           new URL(dest, this.root)
//         )
//       );
//     }
//     return htmlEntrypoints;
//   }
// }

export class FileNode implements BuilderNode<string> {
  constructor(public url: URL) {}

  deps() {}

  async run(): Promise<Value<string>> {
    throw new Error(`unimplemented`);
  }
}

export class HTMLParseNode implements BuilderNode<dom.Node[]> {
  constructor(private source: BuilderNode<string>) {}

  deps() {
    return { source: this.source };
  }

  async run({ source }: { source: string }) {
    return { value: parseDOM(source) };
  }
}

export class HTMLEntrypointNode implements BuilderNode<string> {
  constructor(private tempSourceHack: string, private dest: URL) {}

  deps() {
    return {
      parsedHTML: new HTMLParseNode(new ConstantNode(this.tempSourceHack)),
    };
  }

  async run({
    parsedHTML,
  }: {
    parsedHTML: OutputType<HTMLParseNode>;
  }): Promise<NextNode<string>> {
    return { node: new ReplaceScriptsNode(parsedHTML, this.dest) };
  }
}

export class ReplaceScriptsNode implements BuilderNode<string> {
  constructor(
    private parsedHTML: OutputType<HTMLParseNode>,
    private dest: URL
  ) {}

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
      scriptAttrs.src = jsURLs[key].href;
      this.replace(element, new dom.Element("script", scriptAttrs));
    }
    return { value: render(this.parsedHTML) };
  }
}

export class JSEntrypointNode implements BuilderNode<URL> {
  constructor(private url: URL) {}
  deps() {}
  async run() {
    return {
      value: new URL(
        this.url.href.replace(this.url.origin, "http://unimplemented")
      ),
    };
  }
}
