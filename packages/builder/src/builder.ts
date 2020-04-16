import { FileSystem } from "./filesystem";
import { parse, Document } from "parse5";

export interface BuilderConfig {
  htmlEntryPoints: string[];
  inputDir: string;
  outputDir: string;
}

export class Builder {
  private entrypointCache: Map<
    string,
    { etag: string; doc: Document }
  > = new Map();

  constructor(private fs: FileSystem, private config: BuilderConfig) {}

  async build(): Promise<void> {}
}
