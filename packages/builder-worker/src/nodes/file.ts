import { BuilderNode, Value } from "./common";

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

export class WriteFileNode implements BuilderNode<void> {
  isWriteFileNode = true;
  cacheKey: string;

  static isWriteFileNode(node: BuilderNode): node is WriteFileNode {
    return "isWriteFileNode" in node;
  }

  constructor(private source: BuilderNode<string>, public url: URL) {
    this.cacheKey = `write-file:${this.url.href}`;
  }

  deps() {
    return { source: this.source };
  }

  async run(_args: { source: string }): Promise<Value<void>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}
