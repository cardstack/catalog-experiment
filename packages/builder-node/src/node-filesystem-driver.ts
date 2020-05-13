import {
  FileSystemDriver,
  File,
  Directory,
  FileDescriptor,
  Stat,
} from "../../builder-worker/src/filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { ensureDirSync, removeSync } from "fs-extra";
import {
  openSync,
  opendirSync,
  Dir,
  constants,
  closeSync,
  Dirent,
  readdirSync,
} from "fs";
import { join } from "path";

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
  mtime: number;

  constructor(readonly driver: NodeFileSystemDriver, readonly dir: Dir) {
    this.mtime = Date.now();
  }

  private entries(): Dirent[] {
    return readdirSync(this.dir.path, { withFileTypes: true });
  }

  close() {
    this.dir.closeSync();
  }

  // TODO we should probably be using the fs.stat...
  stat(): Stat {
    return { etag: this.etag, mtime: this.mtime, type: "directory" };
  }

  getDescriptor(url: URL) {
    return new NodeFileDescriptor(this, url);
  }

  get(name: string) {
    return new NodeFile(
      this.driver,
      openSync(join(this.dir.path, name), constants.O_RDWR)
    );
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
  buffer?: Uint8Array;
  etag?: string;
  mtime: number;

  constructor(readonly driver: NodeFileSystemDriver, readonly fd: number) {
    this.mtime = Date.now();
  }

  // TODO we should probably be using the fs.stat...
  stat(): Stat {
    return {
      etag: this.etag,
      mtime: this.mtime,
      size: this.buffer ? this.buffer.length : 0,
      type: "file",
    };
  }

  close() {
    closeSync(this.fd);
  }

  getDescriptor(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new NodeFileDescriptor(this, url, dispatchEvent);
  }

  clone(driver: FileSystemDriver, parent: Directory, name: string) {
    let file = driver.createFile(parent, name);
    file.etag = this.etag;
    if (this.buffer) {
      file.buffer = new Uint8Array(this.buffer);
    }
    return file;
  }
}

class NodeFileDescriptor implements FileDescriptor {
  constructor(
    private resource: NodeFile | NodeDirectory,
    readonly url: URL,
    private readonly dispatchEvent?: FileSystem["dispatchEvent"]
  ) {}

  private get path(): string {
    return this.resource.driver.rootPath;
  }

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
    // if (this.resource.type === "directory") {
    //   throw new FileSystemError("IS_NOT_A_FILE");
    // }
    // if (streamOrBuffer instanceof Uint8Array) {
    //   this.resource.buffer = streamOrBuffer;
    // } else if (typeof streamOrBuffer === "string") {
    //   this.resource.buffer = textEncoder.encode(streamOrBuffer);
    // } else {
    //   this.resource.buffer = await readStream(streamOrBuffer);
    // }
    // this.resource.mtime = Math.floor(Date.now() / 1000);
    this.dispatchEvent!(this.url, "write"); // all descriptors created for files have this dispatcher
  }

  async read(): Promise<Uint8Array> {
    // if (this.resource.type === "directory") {
    //   throw new FileSystemError("IS_NOT_A_FILE");
    // }
    // return this.resource.buffer ? this.resource.buffer : new Uint8Array();
  }

  async readText(): Promise<string> {
    // if (this.resource.type === "directory") {
    //   throw new FileSystemError("IS_NOT_A_FILE");
    // }
    // return this.resource.buffer ? utf8.decode(this.resource.buffer) : "";
  }

  getReadbleStream(): ReadableStream {
    // if (this.resource.type === "directory") {
    //   throw new FileSystemError("IS_NOT_A_FILE");
    // }
    // let buffer = this.resource.buffer;
    // return new ReadableStream({
    //   async start(controller: ReadableStreamDefaultController) {
    //     if (!buffer) {
    //       controller.close();
    //     } else {
    //       controller.enqueue(new Uint8Array(buffer));
    //       controller.close();
    //     }
    //   },
    // });
  }
}
