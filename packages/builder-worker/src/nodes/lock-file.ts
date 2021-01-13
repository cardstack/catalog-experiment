import { mapValues } from "lodash";
import {
  BuilderNode,
  NodeOutput,
  ConstantNode,
  Value,
  NextNode,
} from "./common";
import { WriteFileNode, FileNode, FileExistsNode } from "./file";

export interface LockFile {
  [pkgName: string]: string;
}

export type LockEntries = { [specifier: string]: URL };

export class WriteLockFileNode implements BuilderNode<LockEntries> {
  cacheKey: string;
  private lockFileURL: URL;
  constructor(private pkgWorkingURL: URL, private lockEntries: LockEntries) {
    this.cacheKey = `write-lock-file:${this.pkgWorkingURL.href}`;
    this.lockFileURL = new URL("catalogjs.lock", this.pkgWorkingURL);
  }
  async deps() {
    return {
      lockFileStr: new ReadLockFileNode(this.lockFileURL),
    };
  }
  async run({
    lockFileStr,
  }: {
    lockFileStr: string | undefined;
  }): Promise<NextNode<LockEntries>> {
    let lockFile: LockFile;
    if (lockFileStr) {
      lockFile = JSON.parse(lockFileStr);
    } else {
      lockFile = {};
    }

    let mergedEntries: LockEntries = {
      ...mapValues(lockFile ?? {}, (href) => new URL(href)),
      ...this.lockEntries,
    };

    return {
      node: new FinishWritingLockFileNode(this.lockFileURL, mergedEntries),
    };
  }
}

class FinishWritingLockFileNode implements BuilderNode<LockEntries> {
  cacheKey: string;
  private _lockEntries: { [pkgName: string]: string } = {};
  constructor(private lockFileURL: URL, private lockEntries: LockEntries) {
    this.cacheKey = `finish-writing-lock-file:${this.lockFileURL.href}`;
    this._lockEntries = mapValues(this.lockEntries, (url) => url.href);
  }

  async deps() {
    if (Object.keys(this.lockEntries).length > 0) {
      return {
        write: new WriteFileNode(
          new ConstantNode(JSON.stringify(this._lockEntries, null, 2)),
          this.lockFileURL
        ),
      };
    }
    return;
  }

  async run(): Promise<Value<LockEntries>> {
    return { value: this.lockEntries };
  }
}

export class GetLockFileNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private moduleURL: URL,
    private candidateURL: URL = new URL("./catalogjs.lock", moduleURL)
  ) {
    this.cacheKey = `get-lock-file:${candidateURL.href}`;
  }

  async deps() {
    return {
      lockFile: new ReadLockFileNode(this.candidateURL),
    };
  }

  async run({
    lockFile,
  }: {
    lockFile: string | undefined;
  }): Promise<NodeOutput<LockFile | undefined>> {
    if (lockFile) {
      return { value: JSON.parse(lockFile) };
    }

    let nextCandidateURL = new URL("../catalogjs.lock", this.candidateURL);
    if (nextCandidateURL.href === this.candidateURL.href) {
      return { value: undefined };
    } else {
      return { node: new GetLockFileNode(this.moduleURL, nextCandidateURL) };
    }
  }
}

export class ReadLockFileNode implements BuilderNode {
  cacheKey: string;
  constructor(private lockFileURL: URL) {
    this.cacheKey = `read-lock-file:${lockFileURL.href}`;
  }

  async deps() {
    return {
      fileExists: new FileExistsNode(this.lockFileURL),
    };
  }

  async run({
    fileExists,
  }: {
    fileExists: boolean;
  }): Promise<NodeOutput<string | undefined>> {
    if (fileExists) {
      return { node: new FileNode(this.lockFileURL) };
    } else {
      return { value: undefined };
    }
  }
}
