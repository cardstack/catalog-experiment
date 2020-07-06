import { BuilderNode, Value } from "./common";
import { MakeProjectNode } from "./project";

export class FileNode implements BuilderNode {
  isFileNode = true;
  cacheKey: string;

  static isFileNode(node: BuilderNode): node is FileNode {
    return "isFileNode" in node;
  }

  constructor(public url: URL) {
    this.cacheKey = `file:${this.url.href}`;
  }

  deps() {}

  async run(): Promise<Value<string>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}

export class BundleFileNode extends FileNode {
  constructor(
    url: URL,
    private projectInputRoot: URL,
    private projectOutputRoot: URL
  ) {
    super(url);
    this.cacheKey = `bundle-file:${this.url.href}`;
  }

  // TODO what we really depend on here is the WriteFileNode for the TBD bundle file that will be eventually written out
  deps() {
    return {
      project: new MakeProjectNode(
        this.projectInputRoot,
        this.projectOutputRoot
      ),
    };
  }
}

export class WriteFileNode implements BuilderNode<void> {
  isWriteFileNode = true;
  cacheKey: string;

  static isWriteFileNode(node: BuilderNode): node is WriteFileNode {
    return "isWriteFileNode" in node;
  }

  constructor(private source: BuilderNode<string>, public url: URL) {
    //TODO precreate a FileNode that depends on this (for files that are bundles, so that it is in cache)
    this.cacheKey = `write-file:${this.url.href}`;
  }

  deps() {
    return { source: this.source };
  }

  async run(_args: { source: string }): Promise<Value<void>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}
