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
import { assertNever } from "@catalogjs/shared/util";
import { catalogjsHref } from "../resolver";
import { validRange } from "semver";

export interface Dependencies {
  [name: string]: Dependency;
}

export type Dependency = NpmDependency | CatalogJSDependency;

export interface NpmDependency {
  type: "npm";
  pkgName: string;
  range: string;
}
export interface CatalogJSDependency {
  type: "catalogjs";
  url: string;
  range: string;
}

export interface EntrypointsJSON {
  html?: string[];
  js?: string[];
  dependencies?: Dependencies;
}

export function depAsURL(dependency: Dependency): URL {
  switch (dependency.type) {
    case "npm":
      return new URL(
        `${catalogjsHref}${dependency.type}/${dependency.pkgName}/`
      );
    case "catalogjs":
      return new URL(dependency.url);
    default:
      assertNever(dependency);
  }
}

export class EntrypointsJSONNode implements BuilderNode {
  cacheKey: string;

  constructor(private input: URL, private output: URL) {
    this.cacheKey = `entrypoints-json:${this.input.href}:${this.output.href}`;
  }

  async deps() {
    return {
      json: new JSONParseNode(
        new FileNode(new URL("entrypoints.json", this.input))
      ),
    };
  }

  async run({ json }: { json: any }): Promise<NextNode<Entrypoint[]>> {
    assertEntrypointsJSON(json, this.input.href);
    let entrypoints = [];
    let dependencies = json.dependencies ?? {};
    for (let src of [...(json.html || []), ...(json.js || [])]) {
      entrypoints.push(
        new EntrypointNode(
          new URL(src, this.input),
          new URL(src, this.output),
          dependencies
        )
      );
    }
    return { node: new AllNode(entrypoints) };
  }
}

export class EntrypointNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private src: URL,
    private dest: URL,
    private dependencies: Dependencies
  ) {
    this.cacheKey = `entrypoint:${this.src.href}:${
      this.dest.href
    },${JSON.stringify(this.dependencies)}`;
  }

  async deps() {
    let extension = this.src.href.split(".").pop();
    if (extension === "html") {
      return {
        parsedHTML: new HTMLParseNode(new FileNode(this.src)),
      };
    } else if (extension === "js") {
      return {
        js: new FileNode(this.src),
      };
    } else {
      throw Error(
        `Don't know how to handle entrypoint ${this.src.href}, doesn't appear to be either HTML nor JS`
      );
    }
  }

  async run({
    parsedHTML,
    js,
  }: {
    parsedHTML: OutputType<HTMLParseNode>;
    js: string;
  }): Promise<Value<Entrypoint>> {
    if (parsedHTML) {
      return {
        value: new HTMLEntrypoint(
          this.src,
          this.dest,
          parsedHTML,
          this.dependencies
        ),
      };
    } else if (js) {
      return {
        value: { url: this.src, dependencies: this.dependencies },
      };
    } else {
      throw new Error("bug: should always have either parsed HTML or js");
    }
  }
}

export class HTMLParseNode implements BuilderNode {
  cacheKey: HTMLParseNode;

  constructor(private source: BuilderNode<string>) {
    this.cacheKey = this;
  }

  async deps() {
    return { source: this.source };
  }

  async run({ source }: { source: string }) {
    return { value: parseDOM(source) };
  }
}

export type Entrypoint = HTMLEntrypoint | JSEntrypoint;

export interface JSEntrypoint {
  url: URL;
  dependencies: Dependencies;
}

export class HTMLEntrypoint {
  constructor(
    private src: URL,
    private dest: URL,
    private parsedHTML: dom.Node[],
    private deps: Dependencies
  ) {}

  get destURL() {
    return this.dest;
  }

  get dependencies() {
    return this.deps;
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
    // element), we need to handle replacement a little differently
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

function assertEntrypointsJSON(
  json: any,
  srcFile: string
): asserts json is EntrypointsJSON {
  if (
    !json ||
    typeof json !== "object" ||
    (!("html" in json) && !("js" in json))
  ) {
    throw new Error(`invalid entrypoints.json in ${srcFile}`);
  }
  if (
    "html" in json &&
    (!Array.isArray(json.html) ||
      !json.html.every((k: any) => typeof k === "string"))
  ) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, 'html' must only contain strings`
    );
  }
  if (
    "js" in json &&
    (!Array.isArray(json.js) ||
      !json.js.every((k: any) => typeof k === "string"))
  ) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, 'js' must only contain strings`
    );
  }
  if ("dependencies" in json) {
    assertDependencies(json.dependencies, srcFile);
  }
}

function assertDependencies(
  dep: any,
  srcFile: string
): asserts dep is Dependencies {
  if (typeof dep !== "object") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, 'dependencies' must be an object`
    );
  }

  for (let [name, val] of Object.entries(dep)) {
    assertDepEntry(val, name, srcFile);
  }
}

function assertDepEntry(
  entry: any,
  dep: string,
  srcFile: string
): asserts entry is Dependency {
  if (typeof entry !== "object") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must be an object`
    );
  }
  if (typeof entry.type !== "string") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the 'type' property in  dependency '${dep}' must have a string`
    );
  }
  switch (entry.type) {
    case "npm":
      assertNpmDepEntry(entry, dep, srcFile);
      break;
    case "catalogjs":
      assertCatalogJSDepEntry(entry, dep, srcFile);
      break;
    default:
      throw new Error(
        `invalid entrypoints.json in ${srcFile}, then dependency '${dep}' does not have a valid 'type' property`
      );
  }
}

function assertNpmDepEntry(
  entry: any,
  dep: string,
  srcFile: string
): asserts entry is NpmDependency {
  if (typeof entry !== "object") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must be an object`
    );
  }

  if (!("pkgName" in entry)) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must have a 'pkgName' property`
    );
  }
  if (typeof entry.pkgName !== "string") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the 'pkgName' property in  dependency '${dep}' must have a string`
    );
  }
  if (!("range" in entry)) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must have a 'range' property`
    );
  }
  if (typeof entry.range !== "string") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the 'range' property in  dependency '${dep}' must have a string`
    );
  }
}

function assertCatalogJSDepEntry(
  entry: any,
  dep: string,
  srcFile: string
): asserts entry is CatalogJSDependency {
  if (typeof entry !== "object") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must be an object`
    );
  }

  if (!("url" in entry)) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must have a 'url' property`
    );
  }
  if (typeof entry.url !== "string") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the 'url' property in  dependency '${dep}' must have a string`
    );
  }
  if (!("range" in entry)) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the dependency '${dep}' must have a 'range' property`
    );
  }
  if (typeof entry.range !== "string") {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the 'range' property in  dependency '${dep}' must have a string`
    );
  }
  if (!validRange(entry.range)) {
    throw new Error(
      `invalid entrypoints.json in ${srcFile}, the 'range' property in  dependency '${dep}' must be a valid semver range`
    );
  }
}
