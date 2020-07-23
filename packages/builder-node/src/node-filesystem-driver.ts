import {
  FileSystemDriver,
  FileDescriptor,
  DirectoryDescriptor,
  Volume,
  Stat,
} from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import { makeURLEndInDir } from "../../builder-worker/src/path";
import { dispatchEvent } from "../../builder-worker/src/event-bus";
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

  async mountVolume(url: URL) {
    return new NodeVolume(this.path, url);
  }
}

let dirs: WeakMap<NodeDirectoryDescriptor, Dir> = new WeakMap();
let openDescriptors: Set<number | Dir> = new Set();

export function closeAll() {
  for (let descriptor of openDescriptors) {
    if (typeof descriptor === "number") {
      closeSync(descriptor);
    } else {
      descriptor.closeSync();
    }
  }
  openDescriptors.clear();
}

export class NodeVolume implements Volume {
  root: NodeDirectoryDescriptor;

  constructor(rootPath: string, url: URL) {
    this.root = new NodeDirectoryDescriptor(this, url, opendirSync(rootPath));
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
    let url = new URL(name, makeURLEndInDir(parent.url));
    return new NodeDirectoryDescriptor(this, url, opendirSync(path));
  }

  async createFile(parent: NodeDirectoryDescriptor, name: string) {
    let parentDir = dirs.get(parent);
    if (!parentDir) {
      throw new Error(
        `bug: don't have handle on the node Dir descriptor for the directory at ${parent.url}`
      );
    }
    let path = join(parentDir.path, name);
    let url = new URL(name, makeURLEndInDir(parent.url));
    return new NodeFileDescriptor(this, url, openSync(path, "w+"));
  }

  async willUnmount() {}
}

export class NodeDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly inode: string;

  constructor(
    readonly volume: NodeVolume,
    readonly url: URL,
    private dir: Dir
  ) {
    this.inode = String(statSync(dir.path).ino);
    dirs.set(this, dir);
    openDescriptors.add(dir);
  }

  private entries(): Dirent[] {
    return readdirSync(this.dir.path, { withFileTypes: true });
  }

  async close() {
    openDescriptors.delete(this.dir);
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

  async getFile(name: string) {
    let entry = this.entry(name);
    if (entry && entry.isFile()) {
      return new NodeFileDescriptor(
        this.volume,
        new URL(name, makeURLEndInDir(this.url)),
        openSync(join(this.dir.path, name), "r+")
      );
    }
    return;
  }

  async getDirectory(name: string) {
    name = name.slice(0, -1);
    let entry = this.entry(name);
    if (entry && entry.isDirectory()) {
      return new NodeDirectoryDescriptor(
        this.volume,
        new URL(name, makeURLEndInDir(this.url)),
        opendirSync(join(this.dir.path, name))
      );
    }
    return;
  }

  async children() {
    return this.entries().map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
  }

  private entry(name: string) {
    return this.entries().find((e) => e.name === name);
  }

  async hasDirectory(name: string) {
    let entry = this.entry(name.slice(0, -1));
    return Boolean(entry && entry.isDirectory());
  }

  async hasFile(name: string) {
    let entry = this.entry(name);
    return Boolean(entry && entry.isFile());
  }

  async remove(name: string) {
    removeSync(join(this.dir.path, name));
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
    readonly fd: number
  ) {
    this.inode = String(fstatSync(fd).ino);
    openDescriptors.add(fd);
  }

  async close() {
    openDescriptors.delete(this.fd);
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
    dispatchEvent({
      filesystem: {
        href: this.url.href,
        type: "write",
      },
    });
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
