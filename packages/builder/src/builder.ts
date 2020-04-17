import { FileSystem, FileSystemError } from "./filesystem";
import { join } from "./path";
import { parseDOM, DomUtils } from "htmlparser2";
import { Node } from "domhandler";

interface EntryPointCacheItem {
  etag: string;
  dom: Node[];
}

export interface BuilderConfig {
  htmlEntryPoints: string[];
  inputDir: string;
  outputDir: string;
}

const parsedFileTypes = ["html", "js", "css"];
const origin = `http://localhost:4200`;

export class Builder {
  private entrypointCache: Map<string, EntryPointCacheItem> = new Map();

  constructor(private fs: FileSystem, private config: BuilderConfig) {}

  async build(): Promise<void> {
    for (let entryPointPath of this.config.htmlEntryPoints) {
      await this.processHTMLEntryPoint(
        new URL(join(this.config.inputDir, entryPointPath), origin)
      );
    }
    await this.copyAssets();
  }

  private async processHTMLEntryPoint(url: URL) {
    let entryPointInfo: EntryPointCacheItem;
    let entryPointFile = await this.fs.open(url);
    let key = url.toString();
    if (
      !this.entrypointCache.has(key) ||
      this.entrypointCache.get(key)!.etag !== entryPointFile.stat.etag
    ) {
      entryPointInfo = {
        etag: entryPointFile.stat.etag!,
        dom: parseDOM(await entryPointFile.readText()),
      };
      this.entrypointCache.set(key, entryPointInfo);
    } else {
      entryPointInfo = this.entrypointCache.get(key)!;
    }
    let { dom } = entryPointInfo;
    for (let el of DomUtils.findAll((el) => el.tagName === "script", dom)) {
      await this.processJSEntryPoint(
        new URL(join(this.config.inputDir, el.attribs.src), origin),
        el.attribs.type
      );
    }
    for (let el of DomUtils.findAll((el) => el.tagName === "link", dom)) {
      if (el.attribs.rel === "stylesheet") {
        await this.processCSSEntryPoint(
          new URL(join(this.config.inputDir, el.attribs.href), origin)
        );
      }
    }
    await this.fs.copy(url, this.outputURL(url));
  }

  private async processJSEntryPoint(url: URL, _type?: string) {
    await this.fs.copy(url, this.outputURL(url));
  }

  private async processCSSEntryPoint(url: URL) {
    await this.fs.copy(url, this.outputURL(url));
  }

  private async copyAssets() {
    let inputFiles = (
      await this.fs.list(new URL(this.config.inputDir, origin), true)
    ).filter(
      (entry) =>
        entry.stat.type === "file" &&
        !parsedFileTypes.includes(entry.url.pathname.split(".").pop()!)
    );
    for (let { url, stat } of inputFiles) {
      let outputURL = this.outputURL(url);
      if (!this.isAssetStale(outputURL, stat.etag!)) {
        continue;
      }
      let inputFile = await this.fs.open(url);
      let outputFile = await this.fs.open(outputURL, "file");
      outputFile.setEtag(inputFile.stat.etag!);
      await outputFile.write(inputFile.getReadbleStream());
    }
  }

  private outputURL(inputURL: URL) {
    return new URL(
      join(
        this.config.outputDir,
        inputURL.pathname.slice(this.config.inputDir.length)
      ),
      origin
    );
  }

  private async isAssetStale(outputURL: URL, etag: string) {
    try {
      return (await this.fs.open(outputURL)).stat.etag === etag;
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        return true;
      }
      throw err;
    }
  }
}
