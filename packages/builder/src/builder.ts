import { FileSystem, FileSystemError } from "./filesystem";
import { join, splitPath } from "./path";
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

export class Builder {
  private entrypointCache: Map<string, EntryPointCacheItem> = new Map();

  constructor(private fs: FileSystem, private config: BuilderConfig) {}

  async build(): Promise<void> {
    for (let entryPointPath of this.config.htmlEntryPoints) {
      await this.processHTMLEntryPoint(
        join(this.config.inputDir, entryPointPath)
      );
    }
    await this.copyAssets();
  }

  private async processHTMLEntryPoint(path: string) {
    let entryPointInfo: EntryPointCacheItem;
    let entryPointFile = await this.fs.open(path);
    if (
      !this.entrypointCache.has(path) ||
      this.entrypointCache.get(path)!.etag !== entryPointFile.stat.etag
    ) {
      entryPointInfo = {
        etag: entryPointFile.stat.etag!,
        dom: parseDOM(await entryPointFile.readText()),
      };
      this.entrypointCache.set(path, entryPointInfo);
    } else {
      entryPointInfo = this.entrypointCache.get(path)!;
    }
    let { dom } = entryPointInfo;
    for (let el of DomUtils.findAll((el) => el.tagName === "script", dom)) {
      // TODO need to start thinking about how to resolve relative paths, the
      // hack below should get removed.
      await this.processJSEntryPoint(
        this.crappyResolve(el.attribs.src),
        el.attribs.type
      );
    }
    for (let el of DomUtils.findAll((el) => el.tagName === "link", dom)) {
      if (el.attribs.rel === "stylesheet") {
        await this.processCSSEntryPoint(this.crappyResolve(el.attribs.href));
      }
    }
    await this.fs.copy(path, this.outputPath(path));
  }

  private async processJSEntryPoint(path: string, _type?: string) {
    await this.fs.copy(path, this.outputPath(path));
  }

  private async processCSSEntryPoint(path: string) {
    await this.fs.copy(path, this.outputPath(path));
  }

  private async copyAssets() {
    let inputFiles = (await this.fs.list(this.config.inputDir)).filter(
      (entry) =>
        entry.stat.type === "file" &&
        !parsedFileTypes.includes(entry.path.split(".").pop()!)
    );
    for (let { path, stat } of inputFiles) {
      let outputPath = this.outputPath(path);
      if (!this.isAssetStale(outputPath, stat.etag!)) {
        continue;
      }
      let inputFile = await this.fs.open(path);
      let outputFile = await this.fs.open(outputPath, "file");
      outputFile.setEtag(inputFile.stat.etag!);
      await outputFile.write(inputFile.getReadbleStream());
    }
  }

  private outputPath(inputPath: string) {
    return join(
      this.config.outputDir,
      inputPath.slice(this.config.inputDir.length)
    );
  }

  private async isAssetStale(outputPath: string, etag: string) {
    try {
      return (await this.fs.open(outputPath)).stat.etag === etag;
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        return true;
      }
      throw err;
    }
  }

  private crappyResolve(path: string) {
    return join(
      this.config.inputDir,
      ...splitPath(path).filter((i) => i !== ".")
    );
  }
}
