import { BuilderNode, Value } from "./common";
import { FileSystemDriver } from "../filesystem-drivers/filesystem-driver";
import { ListingEntry } from "../filesystem";

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

export class MountNode implements BuilderNode {
  isMountNode = true;
  cacheKey: string;

  static isMountNode(node: BuilderNode): node is MountNode {
    return "isMountNode" in node;
  }

  constructor(public mountURL: URL, public driver: FileSystemDriver) {
    this.cacheKey = `mount:${this.mountURL.href}`;
  }

  deps() {}

  async run(): Promise<Value<URL>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}

export class FileListingNode implements BuilderNode {
  isFileListingNode = true;
  cacheKey: string;

  static isFileListingNode(node: BuilderNode): node is FileListingNode {
    return "isFileListingNode" in node;
  }

  constructor(public url: URL, public recurse?: true) {
    this.cacheKey = `file-listing:${this.url.href}`;
  }

  deps() {}

  async run(): Promise<Value<ListingEntry[]>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}

export class FileExistsNode implements BuilderNode {
  isFileExistsNode = true;
  cacheKey: string;

  static isFileExistsNode(node: BuilderNode): node is FileExistsNode {
    return "isFileExistsNode" in node;
  }

  constructor(public url: URL) {
    this.cacheKey = `file-exists:${this.url.href}`;
  }

  deps() {}

  async run(): Promise<Value<boolean>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}

export class WriteFileNode implements BuilderNode<void> {
  isWriteFileNode = true;
  cacheKey: string;

  static isWriteFileNode(node: BuilderNode): node is WriteFileNode {
    return "isWriteFileNode" in node;
  }

  constructor(
    private source: BuilderNode<string>,
    public url: URL,
    public nonce: string = "0"
  ) {
    this.cacheKey = `write-file:${this.url.href}:${this.nonce}`;
  }

  deps() {
    return { source: this.source };
  }

  async run(_args: { source: string }): Promise<Value<void>> {
    throw new Error(`bug: this isn't supposed to actually run`);
  }
}
