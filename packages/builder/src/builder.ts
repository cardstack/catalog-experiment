import { FileSystem, FileDescriptor, FileSystemError } from "./filesystem";
import { join, baseName, dirName, isURL } from "./path";
import { parseDOM, DomUtils } from "htmlparser2";
import { Node, Element } from "domhandler";
import render from "dom-serializer";

export interface EntrypointsMapping {
  [srcFile: string]: string;
}

interface EntryPointCacheItem {
  etag: string;
  dom: Node[];
}

export class Builder {
  private entrypointCache: Map<string, EntryPointCacheItem> = new Map();

  constructor(private fs: FileSystem) {}

  async build(origin: string): Promise<void> {
    let entrypointFile: FileDescriptor;
    try {
      entrypointFile = await this.fs.open(new URL("entrypoints.json", origin));
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        console.warn(
          `The origin ${origin} has no 'entrypoints.json' file, skipping build for this origin.`
        );
        return;
      }
      throw err;
    }
    let entrypoints = JSON.parse(
      await entrypointFile.readText()
    ) as EntrypointsMapping;
    for (let [srcPath, destPath] of Object.entries(entrypoints)) {
      await this.processHTMLEntryPoint(
        new URL(srcPath, origin),
        new URL(destPath, origin)
      );
    }
  }

  private async processHTMLEntryPoint(srcUrl: URL, destURL: URL) {
    let entrypointInfo: EntryPointCacheItem;
    let origin = srcUrl.origin;
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
      await this.processJSEntryPoint(dom, el, origin);
    }
    for (let el of DomUtils.findAll((el) => el.tagName === "link", dom)) {
      if (el.attribs.rel === "stylesheet") {
        await this.processCSSEntryPoint(dom, el, origin);
      }
    }

    let builtEntrypoint = await this.fs.open(destURL, "file");
    await builtEntrypoint.write(render(dom));
    builtEntrypoint.setEtag(
      `${builtEntrypoint.stat.size}_${builtEntrypoint.stat.mtime}`
    );
  }

  private async processJSEntryPoint(dom: Node[], el: Element, origin: string) {
    // dont handle scripts that have a different origin than our doc
    if (isURL(el.attribs.src) && new URL(el.attribs.src).origin !== origin) {
      return;
    }

    let jsURL = new URL(el.attribs.src, origin);
    let builtJsURL = new URL(
      join(dirName(jsURL.pathname) || "/", `built-${baseName(jsURL.pathname)}`),
      origin
    );

    // Justt performing an identity transform of the JS entry points for now
    await this.fs.copy(jsURL, builtJsURL);

    let type = el.attribs.type;
    let scriptAttrs: { [key: string]: string } = { src: builtJsURL.pathname };
    if (type) {
      scriptAttrs.type = type;
    }
    replace(dom, el, new Element("script", scriptAttrs));
  }

  private async processCSSEntryPoint(
    _dom: Node[],
    _el: Element,
    _origin: string
  ) {}
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
