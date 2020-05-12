import { FileSystem, FileSystemError } from "./filesystem";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export interface FileSystemDriver {
  root: Directory;
  ready: Promise<void>;
  createDirectory(): Directory;
  createFile(): File;
}

interface Base {
  readonly driver: FileSystemDriver;
  etag?: string;
  mtime: number;
  stat(): Stat;
  getDescriptor(
    url: URL,
    dispatchEvent: FileSystem["dispatchEvent"]
  ): FileDescriptor;
}

export interface Directory extends Base {
  readonly type: "directory";
  readonly files: Files;
}

export interface File extends Base {
  readonly type: "file";
  buffer?: Uint8Array;
  clone(driver: FileSystemDriver): File;
}

export class DefaultDriver implements FileSystemDriver {
  ready = Promise.resolve();
  root: DefaultDirectory;

  constructor() {
    this.root = new DefaultDirectory(this);
  }

  createDirectory(): Directory {
    return new DefaultDirectory(this);
  }

  createFile(): File {
    return new DefaultFile(this);
  }
}

class DefaultDirectory implements Directory {
  readonly type = "directory";
  etag?: string;
  mtime: number;
  readonly files: Files = new Map();

  constructor(readonly driver: FileSystemDriver) {
    this.mtime = Date.now();
  }

  stat(): Stat {
    return { etag: this.etag, mtime: this.mtime, type: "directory" };
  }

  getDescriptor(url: URL): FileDescriptor {
    return new FileDescriptor(this, url);
  }
}

class DefaultFile implements File {
  readonly type = "file";
  buffer?: Uint8Array;
  etag?: string;
  mtime: number;

  constructor(readonly driver: FileSystemDriver) {
    this.mtime = Date.now();
  }

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
    return new FileDescriptor(this, url, dispatchEvent);
  }

  clone(driver: FileSystemDriver): File {
    let file = driver.createFile();
    file.etag = this.etag;
    if (this.buffer) {
      file.buffer = new Uint8Array(this.buffer);
    }
    return file;
  }
}

export class FileDescriptor {
  constructor(
    private resource: File | Directory,
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

type Files = Map<string, File | Directory>;

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
