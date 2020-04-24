import { FileSystem, FileDescriptor, FileSystemError } from "./filesystem";
import { join, baseName, dirName, maybeURL } from "./path";
import { parseDOM, DomUtils } from "htmlparser2";
import { Node, Element } from "domhandler";
import render from "dom-serializer";
import { parse } from "@babel/core";
import { File } from "@babel/types";
import { describeImports } from "./describe-imports";
import {
  OutputTypes,
  BuilderNode,
  MaybeNode,
  FileNode,
  WriteFileNode,
} from "./builder-nodes";

export interface EntrypointsMapping {
  [srcFile: string]: string;
}

interface EntryPointCacheItem {
  etag: string;
  dom: Node[];
}

interface ResolvedModule {
  url: URL;
  imports: Map<string, ResolvedModule>;
}

interface AssignedModule extends ResolvedModule {
  bundle: URL;
}

class EntrypointsNode {
  identity = `entrypoints:${this.root.href}`;

  constructor(private context: BuildContext, private root: URL) {}

  async *run() {
    let entrypointFile: FileDescriptor;
    try {
      entrypointFile = await this.context.openFile(
        new URL("entrypoints.json", this.root)
      );
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        console.warn(
          `The origin ${this.root} has no 'entrypoints.json' file, skipping build for this origin.`
        );
        return;
      }
      throw err;
    }
    let entrypoints = JSON.parse(
      await entrypointFile.readText()
    ) as EntrypointsMapping;
    let htmlNodes = Object.entries(entrypoints).map(
      ([src, dest]) =>
        new BuiltHTMLNode(
          this.context,
          new URL(src, this.root),
          new URL(dest, this.root)
        )
    );
    yield htmlNodes;
  }
}

export class Builder<Input> {
  constructor(private fs: FileSystem, private roots: Input) {}

  async build(): Promise<OutputTypes<Input>> {
    return await this.evalNodes(this.roots);
  }

  async evalNodes<LocalInput>(
    nodes: LocalInput
  ): Promise<OutputTypes<LocalInput>> {
    let results = {} as OutputTypes<LocalInput>;
    for (let [name, node] of Object.entries(nodes)) {
      (results as any)[name] = await this.evalNode(node);
    }
    return results;
  }

  async evalNode(node: BuilderNode): Promise<unknown> {
    let deps = node.deps();
    let result: MaybeNode<unknown>;
    if (typeof deps === "object" && deps != null) {
      let inputs = await this.evalNodes(deps);
      if (WriteFileNode.isWriteFileNode(node)) {
        let fd = await this.fs.open(node.url, "file");
        await fd.write(Object.values(inputs)[0]);
        result = { value: undefined };
      } else {
        result = await node.run(inputs);
      }
    } else {
      if (FileNode.isFileNode(node)) {
        let fd = await this.fs.open(node.url);
        result = { value: await fd.readText() };
      } else {
        result = await (node as BuilderNode<unknown, void>).run();
      }
    }
    if ("node" in result) {
      return this.evalNode(result.node);
    } else {
      return result.value;
    }
  }
}

class Other {
  private async processHTMLEntryPoint(srcUrl: URL, destURL: URL) {
    let entrypointInfo: EntryPointCacheItem;
    let entrypointFile = await this.fs.open(srcUrl);
    let key = srcUrl.toString();

    if (
      !this.entrypointCache.has(key) ||
      this.entrypointCache.get(key)!.etag !== entrypointFile.stat.etag
    ) {
      entrypointInfo = {
        etag: entrypointFile.stat.etag!,
        dom: parseDOM(await entrypointFile.readText()),
      };
      this.entrypointCache.set(key, entrypointInfo);
    } else {
      entrypointInfo = this.entrypointCache.get(key)!;
    }

    let { dom } = entrypointInfo;
    for (let el of DomUtils.findAll((el) => el.tagName === "script", dom)) {
      await this.processJSEntryPoint(dom, el, destURL);
    }
    for (let el of DomUtils.findAll((el) => el.tagName === "link", dom)) {
      if (el.attribs.rel === "stylesheet") {
        await this.processCSSEntryPoint(dom, el, destURL);
      }
    }

    let builtEntrypoint = await this.fs.open(destURL, "file");
    await builtEntrypoint.write(render(dom));
    builtEntrypoint.setEtag(
      `${builtEntrypoint.stat.size}_${builtEntrypoint.stat.mtime}`
    );
  }

  private async processJSEntryPoint(dom: Node[], el: Element, url: URL) {
    // dont handle scripts that have a different origin than our doc
    let jsURL = maybeURL(el.attribs.src, url);
    if (!jsURL || jsURL.origin !== url.origin) {
      return;
    }

    let builtJsURL = new URL(jsURL.href);
    builtJsURL.pathname = join(
      dirName(jsURL.pathname) || "/",
      `built-${baseName(jsURL.pathname)}`
    );

    let deps = (
      await this.assignBundles([await this.resolveDependencies(jsURL)])
    )[0];

    await this.fs.copy(jsURL, builtJsURL);

    let type = el.attribs.type;
    let scriptAttrs: { [key: string]: string } = { src: builtJsURL.pathname };
    if (type) {
      scriptAttrs.type = type;
    }
    replace(dom, el, new Element("script", scriptAttrs));
  }

  private async processCSSEntryPoint(_dom: Node[], _el: Element, _url: URL) {}

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

function replace(dom: Node[], from: Element, to: Element) {
  // if the script tag is actually a root node (i.e. not a descendant of <html>
  // element), we need to handle replacement a little diferently
  if (dom.includes(from)) {
    let index = dom.findIndex((i) => i === from);
    dom[index] = to;
  } else {
    DomUtils.replaceElement(from, to);
  }
}
