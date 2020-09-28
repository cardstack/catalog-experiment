import {
  BuilderNode,
  NodeOutput,
  ConstantNode,
} from "../../../builder-worker/src/nodes/common";
import {
  WriteFileNode,
  FileNode,
  FileExistsNode,
} from "../../../builder-worker/src/nodes/file";
import { LockFile } from "../../../builder-worker/src/resolver";

export class UpdateLockFileNode implements BuilderNode {
  cacheKey: string;
  private lockFileURL: URL;
  constructor(
    private pkgWorkingURL: URL,
    private depURL: URL,
    private depName: string
  ) {
    this.cacheKey = `update-lock-file:${this.pkgWorkingURL.href},dep=${depURL.href}`;
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
  }): Promise<NodeOutput<void>> {
    let lockFile: LockFile;
    if (lockFileStr) {
      lockFile = JSON.parse(lockFileStr);
    } else {
      lockFile = {};
    }
    lockFile[this.depName] = this.depURL.href;
    return {
      node: new WriteFileNode(
        new ConstantNode(JSON.stringify(lockFile, null, 2)),
        this.lockFileURL
      ),
    };
  }
}

class ReadLockFileNode implements BuilderNode {
  volatile = true;
  cacheKey: ReadLockFileNode;
  constructor(private lockFileURL: URL) {
    this.cacheKey = this;
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
