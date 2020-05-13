import { FileSystem, FileSystemError } from "./filesystem";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export interface FileSystemDriver {
  root: Directory;
  mounted: Promise<void>;
  createDirectory(parent: Directory, name: String): Directory;
  createFile(parent: Directory, name: string): File;
}

interface Base {
  readonly driver: FileSystemDriver;
  etag?: string;
  mtime: number;
  stat(): Stat;
  close(): void;
  getDescriptor(
    url: URL,
    dispatchEvent: FileSystem["dispatchEvent"]
  ): FileDescriptor;
}

export interface Directory extends Base {
  readonly type: "directory";
  get(name: string): File | Directory | undefined;
  children(): string[];
  has(name: string): boolean;
  remove(name: string): void;
  add(name: string, resource: File | Directory): void;
}

export interface File extends Base {
  readonly type: "file";
  buffer?: Uint8Array;
  clone(driver: FileSystemDriver, parent: Directory, name: string): File;
}

export interface FileDescriptor {
  readonly url: URL;
  setEtag(etag: string): void;
  stat(): Stat;
  write(buffer: Uint8Array): Promise<void>;
  write(stream: ReadableStream): Promise<void>;
  write(text: string): Promise<void>;
  write(streamOrBuffer: ReadableStream | Uint8Array | string): Promise<void>;
  read(): Promise<Uint8Array>;
  readText(): Promise<string>;
  getReadbleStream(): ReadableStream;
  close(): void;
}

export class DefaultDriver implements FileSystemDriver {
  mounted = Promise.resolve();
  root: DefaultDirectory;

  constructor() {
    this.root = new DefaultDirectory(this);
  }

  createDirectory(parent: DefaultDirectory, name: string): Directory {
    let directory = new DefaultDirectory(this);
    parent.add(name, directory);
    return directory;
  }

  createFile(parent: DefaultDirectory, name: string): File {
    let file = new DefaultFile(this);
    parent.add(name, file);
    return file;
  }
}

class DefaultDirectory implements Directory {
  readonly type = "directory";
  etag?: string;
  mtime: number;
  private readonly files: Map<
    string,
    DefaultFile | DefaultDirectory
  > = new Map();

  constructor(readonly driver: DefaultDriver) {
    this.mtime = Date.now();
  }

  close() {}

  stat(): Stat {
    return { etag: this.etag, mtime: this.mtime, type: "directory" };
  }

  getDescriptor(url: URL): FileDescriptor {
    return new DefaultFileDescriptor(this, url);
  }

  get(name: string) {
    return this.files.get(name);
  }

  children() {
    return [...this.files.keys()];
  }

  has(name: string) {
    return this.files.has(name);
  }

  remove(name: string) {
    this.files.delete(name);
  }

  add(name: string, resource: DefaultFile | DefaultDirectory) {
    this.files.set(name, resource);
  }
}

class DefaultFile implements File {
  readonly type = "file";
  buffer?: Uint8Array;
  etag?: string;
  mtime: number;

  constructor(readonly driver: DefaultDriver) {
    this.mtime = Date.now();
  }

  close() {}

  stat(): Stat {
    return {
      etag: this.etag,
      mtime: this.mtime,
      size: this.buffer ? this.buffer.length : 0,
      type: "file",
    };
  }

  getDescriptor(
    url: URL,
    dispatchEvent: FileSystem["dispatchEvent"]
  ): FileDescriptor {
    return new DefaultFileDescriptor(this, url, dispatchEvent);
  }

  clone(driver: FileSystemDriver, parent: Directory, name: string): File {
    let file = driver.createFile(parent, name);
    file.etag = this.etag;
    if (this.buffer) {
      file.buffer = new Uint8Array(this.buffer);
    }
    return file;
  }
}

class DefaultFileDescriptor implements FileDescriptor {
  constructor(
    private resource: DefaultFile | DefaultDirectory,
    readonly url: URL,
    private readonly dispatchEvent?: FileSystem["dispatchEvent"]
  ) {}

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
    if (streamOrBuffer instanceof Uint8Array) {
      this.resource.buffer = streamOrBuffer;
    } else if (typeof streamOrBuffer === "string") {
      this.resource.buffer = textEncoder.encode(streamOrBuffer);
    } else {
      this.resource.buffer = await readStream(streamOrBuffer);
    }
    this.resource.mtime = Math.floor(Date.now() / 1000);
    this.dispatchEvent!(this.url, "write"); // all descriptors created for files have this dispatcher
  }

  close() {}

  async read(): Promise<Uint8Array> {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    return this.resource.buffer ? this.resource.buffer : new Uint8Array();
  }

  async readText(): Promise<string> {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    return this.resource.buffer ? utf8.decode(this.resource.buffer) : "";
  }

  getReadbleStream(): ReadableStream {
    if (this.resource.type === "directory") {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    let buffer = this.resource.buffer;
    return new ReadableStream({
      async start(controller: ReadableStreamDefaultController) {
        if (!buffer) {
          controller.close();
        } else {
          controller.enqueue(new Uint8Array(buffer));
          controller.close();
        }
      },
    });
  }
}

export interface Stat {
  etag?: string;
  mtime: number;
  size?: number;
  type: "directory" | "file";
}

async function readStream(stream: ReadableStream): Promise<Uint8Array> {
  let reader = stream.getReader();
  let buffers: Uint8Array[] = [];
  while (true) {
    let chunk = await reader.read();
    if (chunk.done) {
      break;
    } else {
      buffers.push(chunk.value);
    }
  }

  let size = buffers.reduce((a, b) => a + b.length, 0);
  let result = new Uint8Array(size);
  let offset = 0;
  for (let buffer of buffers) {
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}
