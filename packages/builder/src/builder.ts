import { FileSystem, FileDescriptor, FileSystemError } from "./filesystem";
import { join, baseName, dirName, isURL } from "./path";
import { parseDOM, DomUtils } from "htmlparser2";
import { Node, Element } from "domhandler";
import render from "dom-serializer";

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
      entrypointFile = await this.fs.open(new URL(".entrypoints.json", origin));
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        console.warn(
          `The origin ${origin} has no '.entrypoints.json' file, skipping build for this origin.`
        );
        return;
      }
      throw err;
    }
    let entrypoints = JSON.parse(await entrypointFile.readText());
    for (let entrypointPath of entrypoints) {
      if (!/^src-.+\.html$/.test(baseName(entrypointPath))) {
        throw new Error(
          `HTML entrypoint '${entrypointPath}' does not have expected 'src-' prefix`
        );
      }
      await this.processHTMLEntryPoint(new URL(entrypointPath, origin));
    }
  }

  private async processHTMLEntryPoint(url: URL) {
    let entrypointInfo: EntryPointCacheItem;
    let origin = url.origin;
    let entrypointFile = await this.fs.open(url);
    let key = url.toString();

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

    let builtEntrypointURL = new URL(
      join(
        dirName(url.pathname) ?? "/",
        baseName(url.pathname).replace(/^src-/, "")
      ),
      origin
    );
    let builtEntrypoint = await this.fs.open(builtEntrypointURL, "file");
    await builtEntrypoint.write(render(dom));
  }

  private async processJSEntryPoint(dom: Node[], el: Element, origin: string) {
    // dont handle scripts that have a different origin than our doc
    if (isURL(el.attribs.src) && new URL(el.attribs.src).origin !== origin) {
      return;
    }

    // This is the fs URL for loading the contents of the JS:
    // let jsURL = new URL(el.attribs.src, origin);

    let type = el.attribs.type;
    let scriptAttrs: { [key: string]: string } = {
      src: el.attribs.src,
      "data-test-catalogjs-generated": "true",
    };
    if (type) {
      scriptAttrs.type = type;
    }

    // Just replacing the script tag with itself for now (and a little stamp so
    // we now it's coming from the build). Eventually we will write out the
    // bundle paths here
    replace(dom, el, new Element("script", scriptAttrs));
  }

  private async processCSSEntryPoint(
    _dom: Node[],
    _el: Element,
    _origin: string
  ) {}
}

function replace(dom: Node[], from: Element, to: Element) {
  // the script tag is actually a root node (not a descendant of <html>
  // element), we need to handle replacement a little diferently
  if (dom.includes(from)) {
    let index = dom.findIndex((i) => i === from);
    dom[index] = to;
  } else {
    DomUtils.replaceElement(from, to);
  }
}
