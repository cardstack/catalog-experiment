import {
  FileSystemDriver,
  FileDescriptor,
  DirectoryDescriptor,
  Volume,
  Stat,
} from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import { assertURLEndsInDir } from "../../builder-worker/src/path";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { DOMToNodeReadable, NodeReadableToDOM } from "file-daemon/stream-shims";
import { Readable } from "stream";
import { ensureDirSync, removeSync, move } from "fs-extra";
import {
  openSync,
  opendirSync,
  Dir,
  closeSync,
  Dirent,
  readdirSync,
  writeFileSync,
  fstatSync,
  ftruncateSync,
  statSync,
  createWriteStream,
  readSync,
  createReadStream,
  linkSync,
} from "fs";
import { join } from "path";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export class NodeFileSystemDriver implements FileSystemDriver {
  constructor(private path: string) {}

  async mountVolume(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new NodeVolume(this.path, url, dispatchEvent);
  }
}

let dirs: WeakMap<NodeDirectoryDescriptor, Dir> = new WeakMap();

export class NodeVolume implements Volume {
  root: NodeDirectoryDescriptor;
  readonly hasDirectoryAccess = true;
  readonly canCreateFiles = true;

  constructor(
    rootPath: string,
    url: URL,
    private dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    this.root = new NodeDirectoryDescriptor(
      this,
      url,
      opendirSync(rootPath),
      dispatchEvent
    );
  }

  async createDirectory(parent: NodeDirectoryDescriptor, name: string) {
    let parentDir = dirs.get(parent);
    if (!parentDir) {
      throw new Error(
        `bug: don't have handle on the node Dir descriptor for the directory at ${parent.url}`
      );
    }
    let path = join(parentDir.path, name);
    ensureDirSync(path);
    let url = new URL(name, assertURLEndsInDir(parent.url));
    this.dispatchEvent(url, "create");
    return new NodeDirectoryDescriptor(
      this,
      url,
      opendirSync(path),
      this.dispatchEvent
    );
  }

  async createFile(parent: NodeDirectoryDescriptor, name: string) {
    let parentDir = dirs.get(parent);
    if (!parentDir) {
      throw new Error(
        `bug: don't have handle on the node Dir descriptor for the directory at ${parent.url}`
      );
    }
    let path = join(parentDir.path, name);
    let url = new URL(name, assertURLEndsInDir(parent.url));
    this.dispatchEvent(url, "create");
    return new NodeFileDescriptor(
      this,
      url,
      openSync(path, "w+"),
      this.dispatchEvent
    );
  }
}

export class NodeDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly inode: string;

  constructor(
    readonly volume: NodeVolume,
    readonly url: URL,
    private dir: Dir,
    private dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    this.inode = String(statSync(dir.path).ino);
    dirs.set(this, dir);
  }

  private entries(): Dirent[] {
    return readdirSync(this.dir.path, { withFileTypes: true });
  }

  close() {
    this.dir.closeSync();
  }

  async stat(): Promise<Stat> {
    let stat = statSync(this.dir.path);
    return {
      etag: String(stat.mtimeMs),
      mtime: stat.mtimeMs,
      type: "directory",
    };
  }

  async get(name: string) {
    let entry = this.entries().find((e) => e.name === name);
    if (entry && entry.isFile()) {
      return new NodeFileDescriptor(
        this.volume,
        new URL(name, assertURLEndsInDir(this.url)),
        openSync(join(this.dir.path, name), "r+"),
        this.dispatchEvent
      );
    } else if (entry && entry.isDirectory()) {
      return new NodeDirectoryDescriptor(
        this.volume,
        new URL(name, assertURLEndsInDir(this.url)),
        opendirSync(join(this.dir.path, name)),
        this.dispatchEvent
      );
    }
    return;
  }

  async children() {
    return this.entries().map((e) => e.name);
  }

  async has(name: string) {
    return Boolean(this.entries().find((e) => e.name === name));
  }

  async remove(name: string) {
    removeSync(join(this.dir.path, name));
    let url = new URL(name, assertURLEndsInDir(this.url));
    this.dispatchEvent(url, "remove");
  }

  async add(name: string, descriptor: NodeDirectoryDescriptor): Promise<void>;
  async add(
    name: string,
    descriptor: NodeFileDescriptor,
    currentParent: NodeDirectoryDescriptor,
    currentName: string
  ): Promise<void>;
  async add(
    name: string,
    descriptor: NodeFileDescriptor | NodeDirectoryDescriptor,
    currentParent?: NodeDirectoryDescriptor,
    currentName?: string
  ): Promise<void> {
    if (descriptor.type === "directory") {
      // file systems don't allow hard links of directories because they can
      // create cycles. so instead this will act like an 'mv' when performed on a
      // directory.
      await move(descriptor.dir.path, join(this.dir.path, name), {
        overwrite: true,
      });
    } else if (!currentParent || !currentName) {
      throw new Error(
        `Bug: need to provide the current parent dir descriptor when adding a file to a dir so we can locate it on the filesystem`
      );
    } else {
      linkSync(
        join(currentParent.dir.path, currentName),
        join(this.dir.path, name)
      );
    }
  }
}

export class NodeFileDescriptor implements FileDescriptor {
  readonly type = "file";
  readonly inode: string;

  constructor(
    readonly volume: NodeVolume,
    readonly url: URL,
    readonly fd: number,
    private readonly dispatchEvent?: FileSystem["dispatchEvent"]
  ) {
    this.inode = String(fstatSync(fd).ino);
  }

  close() {
    closeSync(this.fd);
  }

  async stat(): Promise<Stat> {
    let stat = fstatSync(this.fd);
    return {
      etag: `${stat.size}_${stat.mtimeMs}`,
      mtime: stat.mtimeMs,
      size: stat.size,
      type: "file",
    };
  }

  async write(buffer: Uint8Array): Promise<void>;
  async write(stream: ReadableStream): Promise<void>;
  async write(text: string): Promise<void>;
  async write(
    streamOrBuffer: ReadableStream | Uint8Array | string
  ): Promise<void> {
    let buffer: Uint8Array | undefined;
    let readableStream: Readable | undefined;
    if (streamOrBuffer instanceof Uint8Array) {
      buffer = streamOrBuffer;
    } else if (typeof streamOrBuffer === "string") {
      buffer = textEncoder.encode(streamOrBuffer);
    } else {
      readableStream = new DOMToNodeReadable(streamOrBuffer);
    }

    // need to trucate the file otherwise if we are overwriting a file and we
    // happen to write less bytes than what was previously there, the extra
    // bytes will still exist in the file
    ftruncateSync(this.fd);

    if (buffer) {
      writeFileSync(this.fd, buffer);
    } else if (readableStream) {
      let file = createWriteStream("", {
        fd: this.fd,
        autoClose: false,
      });
      let done = new Promise((res, rej) => {
        file.on("finish", res);
        file.on("err", rej);
      });
      readableStream.pipe(file);
      await done;
    } else {
      throw new Error(
        `bug: should never have a situation where you dont have a buffer or a readable stream when writing to a file`
      );
    }
    this.dispatchEvent!(this.url, "write"); // all descriptors created for files have this dispatcher
  }

  async read() {
    let size = (await this.stat()).size!;
    let buffer = new Uint8Array(size);
    readSync(this.fd, buffer, 0, size, 0);
    return buffer;
  }

  async readText() {
    let buffer = await this.read();
    return utf8.decode(buffer);
  }

  async getReadbleStream() {
    let readableStream = createReadStream("", {
      fd: this.fd,
      autoClose: false,
      start: 0,
    });
    return new NodeReadableToDOM(readableStream, { autoClose: false });
  }
}
