import {
  FileSystemDriver,
  File,
  Directory,
  FileDescriptor,
  Stat,
} from "../../builder-worker/src/filesystem-driver";
import {
  FileSystem,
  FileSystemError,
} from "../../builder-worker/src/filesystem";
import { DOMToNodeReadable, NodeReadableToDOM } from "file-daemon/stream-shims";
import { Readable } from "stream";
import { ensureDirSync, removeSync } from "fs-extra";
import {
  openSync,
  opendirSync,
  Dir,
  constants,
  closeSync,
  Dirent,
  readdirSync,
  writeFileSync,
  fstatSync,
  statSync,
  createWriteStream,
  readSync,
  createReadStream,
} from "fs";
import { join } from "path";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export class NodeFileSystemDriver implements FileSystemDriver {
  mounted = Promise.resolve();
  root: NodeDirectory;

  constructor(readonly rootPath: string) {
    this.root = new NodeDirectory(this, opendirSync(rootPath));
  }

  createDirectory(parent: NodeDirectory, name: string) {
    let path = join(parent.dir.path, name);
    ensureDirSync(path);
    return new NodeDirectory(this, opendirSync(path));
  }

  createFile(parent: NodeDirectory, name: string): File {
    let path = join(parent.dir.path, name);
    let file = new NodeFile(this, openSync(path, constants.O_CREAT));
    return file;
  }
}

class NodeDirectory implements Directory {
  readonly type = "directory";
  etag?: string;

  constructor(readonly driver: NodeFileSystemDriver, readonly dir: Dir) {}

  private entries(): Dirent[] {
    return readdirSync(this.dir.path, { withFileTypes: true });
  }

  close() {
    this.dir.closeSync();
  }

  stat(): Stat {
    let stat = statSync(this.dir.path);
    return { etag: this.etag, mtime: stat.mtimeMs, type: "directory" };
  }

  mtime(): number {
    return this.stat().mtime;
  }

  getDescriptor(url: URL) {
    return new NodeFileDescriptor(this, url);
  }

  get(name: string) {
    let entry = this.entries().find((e) => e.name === name);
    if (entry && entry.isFile()) {
      return new NodeFile(
        this.driver,
        openSync(join(this.dir.path, name), constants.O_RDWR)
      );
    } else if (entry && entry.isDirectory()) {
      return new NodeDirectory(
        this.driver,
        opendirSync(join(this.dir.path, name))
      );
    }
  }

  children() {
    return this.entries().map((e) => e.name);
  }

  has(name: string) {
    return Boolean(this.entries().find((e) => e.name === name));
  }

  remove(name: string) {
    removeSync(join(this.dir.path, name));
  }

  add(name: string, resource: NodeFile | NodeDirectory) {
    if (resource.type === "directory") {
      return this.driver.createDirectory(this, name);
    } else {
      return this.driver.createFile(this, name);
    }
  }
}

class NodeFile implements File {
  readonly type = "file";
  etag?: string; // synthesize this like we do for the file daemon client

  constructor(readonly driver: NodeFileSystemDriver, readonly fd: number) {}

  // TODO we should probably be using the fs.stat...
  stat(): Stat {
    let stat = fstatSync(this.fd);
    return {
      etag: this.etag,
      mtime: stat.mtimeMs,
      size: stat.size,
      type: "file",
    };
  }

  mtime(): number {
    return this.stat().mtime;
  }

  close() {
    closeSync(this.fd);
  }

  getDescriptor(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new NodeFileDescriptor(this, url, dispatchEvent);
  }

  // TODO seems unnecessary
  clone(driver: FileSystemDriver, parent: Directory, name: string) {
    let file = driver.createFile(parent, name);
    file.etag = this.etag; // do we really wanna do this?
    return file;
  }
}

class NodeFileDescriptor implements FileDescriptor {
  constructor(
    private resource: NodeFile | NodeDirectory,
    readonly url: URL,
    private readonly dispatchEvent?: FileSystem["dispatchEvent"]
  ) {}

  close() {
    this.resource.close();
  }

  setEtag(etag: string) {
    this.resource.etag = etag;
  }

  stat(): Stat {
    return this.resource.stat();
  }

  async write(buffer: Uint8Array): Promise<void>;
  async write(stream: ReadableStream): Promise<void>;
  async write(text: string): Promise<void>;
  async write(
    streamOrBuffer: ReadableStream | Uint8Array | string
  ): Promise<void> {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    let buffer: Uint8Array | undefined;
    let readableStream: Readable | undefined;
    if (streamOrBuffer instanceof Uint8Array) {
      buffer = streamOrBuffer;
    } else if (typeof streamOrBuffer === "string") {
      buffer = textEncoder.encode(streamOrBuffer);
    } else {
      readableStream = new DOMToNodeReadable(streamOrBuffer);
    }

    if (buffer) {
      writeFileSync(this.resource.fd, buffer);
    } else if (readableStream) {
      let file = createWriteStream("", {
        fd: this.resource.fd,
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

  async read(): Promise<Uint8Array> {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    let size = this.stat().size!;
    let buffer = new Uint8Array(size);
    readSync(this.resource.fd, buffer, 0, size, 0);
    return buffer;
  }

  async readText(): Promise<string> {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    let buffer = await this.read();
    return utf8.decode(buffer);
  }

  getReadbleStream(): ReadableStream {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    let readableStream = createReadStream("", {
      fd: this.resource.fd,
      autoClose: false,
      start: 0,
    });
    return new NodeReadableToDOM(readableStream, { autoClose: false });
  }
}
