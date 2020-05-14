import { FileSystem } from "./filesystem";
import { pathToURL } from "./path";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export interface FileSystemDriver {
  mountVolume(
    url: URL,
    dispatchEvent: FileSystem["dispatchEvent"]
  ): Promise<Volume>;
}

export interface Volume {
  root: DirectoryDescriptor;
  createDirectory(
    parent: DirectoryDescriptor,
    name: String
  ): DirectoryDescriptor;
  createFile(parent: DirectoryDescriptor, name: string): FileDescriptor;
}

export interface Descriptor {
  readonly url: URL;
  readonly dispatchEvent: FileSystem["dispatchEvent"];
  readonly volume: Volume;
  stat(): Stat;
  close(): void;
  // TODO this should be an implementation class concern
  setEtag(etag: string): void;
}

export interface DirectoryDescriptor extends Descriptor {
  readonly type: "directory";
  readonly inode: string;
  get(name: string): FileDescriptor | DirectoryDescriptor | undefined;
  children(): string[];
  has(name: string): boolean;
  remove(name: string): void;
  add(name: string, resource: FileDescriptor): void;
  add(name: string, resource: DirectoryDescriptor): void;
  add(name: string, resource: FileDescriptor | DirectoryDescriptor): void;
}

export interface FileDescriptor extends Descriptor {
  readonly type: "file";
  readonly inode: string;
  write(buffer: Uint8Array): Promise<void>;
  write(stream: ReadableStream): Promise<void>;
  write(text: string): Promise<void>;
  read(): Promise<Uint8Array>;
  readText(): Promise<string>;
  getReadbleStream(): ReadableStream;
  clone(
    volume: Volume,
    parent: DirectoryDescriptor,
    name: string
  ): Promise<FileDescriptor>;
}

type DefaultDescriptors = DefaultDirectoryDescriptor | DefaultFileDescriptor;
type DefaultResources = File | Directory;
let descriptors: WeakMap<DefaultDescriptors, DefaultResources> = new WeakMap();

export class DefaultDriver implements FileSystemDriver {
  async mountVolume(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return this.mountVolumeSync(url, dispatchEvent);
  }

  // it's adventageous to leverage the synchronous nature of the default driver
  // for mounting a default volume in the FileSystem constructor
  mountVolumeSync(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new DefaultVolume(url, dispatchEvent);
  }
}

export class DefaultVolume implements Volume {
  static readonly ROOT = new URL("http://root");
  root: DefaultDirectoryDescriptor;

  constructor(url: URL, private dispatchEvent: FileSystem["dispatchEvent"]) {
    this.root = new Directory(this).getDescriptor(url, this.dispatchEvent);
  }

  createDirectory(parent: DefaultDirectoryDescriptor, name: string) {
    let directory = new Directory(this);
    let url: URL;
    // The root folder is a special internal folder that only contains URL
    // origins. So we fashion URL's from these origin for the child dirs.
    if (parent.url.href === DefaultVolume.ROOT.href) {
      url = pathToURL(name);
    } else {
      url = new URL(name, parent.url);
    }
    let descriptor = directory.getDescriptor(url, this.dispatchEvent);
    parent.add(name, descriptor);
    return descriptor;
  }

  createFile(parent: DefaultDirectoryDescriptor, name: string) {
    let file = new File(this);
    let descriptor = file.getDescriptor(
      new URL(name, parent.url),
      this.dispatchEvent
    );
    parent.add(name, descriptor);
    return descriptor;
  }
}

class Directory {
  etag?: string;
  mtime: number;
  readonly files: Map<string, File | Directory> = new Map();
  readonly serialNumber = makeSerialNumber();

  constructor(readonly volume: DefaultVolume) {
    this.mtime = Date.now();
  }

  getDescriptor(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new DefaultDirectoryDescriptor(this, url, dispatchEvent);
  }
}

class File {
  buffer: Uint8Array = new Uint8Array();
  etag?: string;
  mtime: number;
  readonly serialNumber = makeSerialNumber();

  constructor(readonly volume: DefaultVolume) {
    this.mtime = Date.now();
  }

  getDescriptor(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new DefaultFileDescriptor(this, url, dispatchEvent);
  }
}

class DefaultDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly volume: DefaultVolume;

  constructor(
    resource: Directory,
    readonly url: URL,
    readonly dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    descriptors.set(this, resource);
    this.volume = resource.volume;
  }

  private get resource() {
    return descriptors.get(this)! as Directory;
  }

  get inode() {
    return String(this.resource.serialNumber);
  }

  setEtag(etag: string) {
    this.resource.etag = etag;
  }

  close() {}

  stat(): Stat {
    return {
      etag: this.resource.etag,
      mtime: this.resource.mtime,
      type: "directory",
    };
  }

  get(name: string) {
    if (name === "/") {
      return this.volume.root;
    }
    return this.resource.files
      .get(name)
      ?.getDescriptor(new URL(name, this.url), this.dispatchEvent);
  }

  children() {
    return [...this.resource.files.keys()];
  }

  has(name: string) {
    if (name === "/") {
      return true;
    }
    return this.resource.files.has(name);
  }

  remove(name: string) {
    this.resource.files.delete(name);
  }

  add(name: string, descriptor: DefaultDirectoryDescriptor): void;
  add(name: string, descriptor: DefaultFileDescriptor): void;
  add(name: string, descriptor: DefaultDescriptors): void {
    this.resource.files.set(name, descriptors.get(descriptor)!);
  }
}

class DefaultFileDescriptor implements FileDescriptor {
  readonly type = "file";
  readonly volume: DefaultVolume;

  constructor(
    resource: File,
    readonly url: URL,
    readonly dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    descriptors.set(this, resource);
    this.volume = resource.volume;
  }

  private get resource() {
    return descriptors.get(this)! as File;
  }

  get inode() {
    return String(this.resource.serialNumber);
  }

  setEtag(etag: string) {
    this.resource.etag = etag;
  }

  stat(): Stat {
    return {
      etag: this.resource.etag,
      mtime: this.resource.mtime,
      size: this.resource.buffer.length,
      type: "file",
    };
  }

  async clone(
    volume: Volume,
    parent: DirectoryDescriptor,
    name: string
  ): Promise<FileDescriptor> {
    let descriptor = volume.createFile(parent, name);
    // descriptor.etag = this.etag;
    if (this.resource.buffer) {
      await descriptor.write(this.resource.buffer);
    }
    return descriptor;
  }

  async write(buffer: Uint8Array): Promise<void>;
  async write(stream: ReadableStream): Promise<void>;
  async write(text: string): Promise<void>;
  async write(
    streamOrBuffer: ReadableStream | Uint8Array | string
  ): Promise<void> {
    if (streamOrBuffer instanceof Uint8Array) {
      this.resource.buffer = streamOrBuffer;
    } else if (typeof streamOrBuffer === "string") {
      this.resource.buffer = textEncoder.encode(streamOrBuffer);
    } else {
      this.resource.buffer = await readStream(streamOrBuffer);
    }
    this.resource.mtime = Math.floor(Date.now());
    this.dispatchEvent!(this.url, "write"); // all descriptors created for files have this dispatcher
  }

  close() {}

  async read(): Promise<Uint8Array> {
    return this.resource.buffer ? this.resource.buffer : new Uint8Array();
  }

  async readText(): Promise<string> {
    return this.resource.buffer ? utf8.decode(this.resource.buffer) : "";
  }

  getReadbleStream(): ReadableStream {
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

// TODO split this between a FileStat and a DirectoryStat
export interface Stat {
  etag?: string;
  mtime: number;
  size?: number;
  type: "directory" | "file";
}

export async function readStream(stream: ReadableStream): Promise<Uint8Array> {
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

function makeSerialNumber(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
