import { FileSystem } from "../filesystem";
import { pathToURL } from "../path";

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
  hasDirectoryAccess: boolean;
  canCreateFiles: boolean;
  createDirectory(
    parent: DirectoryDescriptor,
    name: string
  ): Promise<DirectoryDescriptor>;
  createFile(
    parent: DirectoryDescriptor,
    name: string
  ): Promise<FileDescriptor>;
}

interface Descriptor {
  readonly url: URL;
  readonly volume: Volume;
  stat(): Promise<Stat>;
  close(): void;
}

export interface DirectoryDescriptor extends Descriptor {
  readonly type: "directory";
  readonly inode: string;
  get(name: string): Promise<FileDescriptor | DirectoryDescriptor | undefined>;
  children(): Promise<string[]>;
  has(name: string): Promise<boolean>;
  remove(name: string): Promise<void>;
  add(name: string, resource: DirectoryDescriptor): Promise<void>;
  add(
    name: string,
    resource: FileDescriptor,
    currentParent: DirectoryDescriptor,
    currentName: string
  ): Promise<void>;
}

export interface FileDescriptor extends Descriptor {
  readonly type: "file";
  readonly inode: string;
  write(buffer: Uint8Array): Promise<void>;
  write(stream: ReadableStream): Promise<void>;
  write(text: string): Promise<void>;
  read(): Promise<Uint8Array>;
  readText(): Promise<string>;
  getReadbleStream(): Promise<ReadableStream>;
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
  readonly hasDirectoryAccess = true;
  readonly canCreateFiles = true;

  constructor(url: URL, private dispatchEvent: FileSystem["dispatchEvent"]) {
    this.root = new Directory(this).getDescriptor(url, this.dispatchEvent);
  }

  async createDirectory(parent: DefaultDirectoryDescriptor, name: string) {
    let directory = new Directory(this);
    let url: URL;
    // The root folder is a special internal folder that only contains URL
    // origins. So we fashion URL's from these origin for the child dirs.
    if (parent.url.href === DefaultVolume.ROOT.href) {
      url = pathToURL(name);
    } else {
      url = new URL(name, assertURLEndsInDir(parent.url));
    }
    let descriptor = directory.getDescriptor(url, this.dispatchEvent);
    await parent.add(name, descriptor);
    this.dispatchEvent(url, "create");
    return descriptor;
  }

  async createFile(parent: DefaultDirectoryDescriptor, name: string) {
    let file = new File(this);
    let url = new URL(name, assertURLEndsInDir(parent.url));
    let descriptor = file.getDescriptor(url, this.dispatchEvent);
    await parent.add(name, descriptor);
    this.dispatchEvent(url, "create");
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
  mtime: number;
  readonly serialNumber = makeSerialNumber();

  constructor(readonly volume: DefaultVolume) {
    this.mtime = Date.now();
  }

  getDescriptor(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new DefaultFileDescriptor(this, url, dispatchEvent);
  }
}

export class DefaultDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly volume: DefaultVolume;

  constructor(
    resource: Directory,
    readonly url: URL,
    private dispatchEvent: FileSystem["dispatchEvent"]
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

  async stat(): Promise<Stat> {
    return {
      etag: this.resource.etag,
      mtime: this.resource.mtime,
      type: "directory",
    };
  }

  async get(name: string) {
    if (name === "/") {
      return this.volume.root;
    }
    if (this.has(name)) {
      let url: URL;
      if (this.url === DefaultVolume.ROOT) {
        url = pathToURL(name);
      } else {
        url = new URL(name, assertURLEndsInDir(this.url));
      }
      return this.resource.files
        .get(name)!
        .getDescriptor(url, this.dispatchEvent);
    }
  }

  async children() {
    return [...this.resource.files.keys()];
  }

  async has(name: string) {
    if (name === "/") {
      return true;
    }
    return this.resource.files.has(name);
  }

  async remove(name: string) {
    this.resource.files.delete(name);
    let url = new URL(name, assertURLEndsInDir(this.url));
    this.dispatchEvent(url, "remove");
  }

  async add(
    name: string,
    descriptor: DefaultDirectoryDescriptor
  ): Promise<void>;
  async add(name: string, descriptor: DefaultFileDescriptor): Promise<void>;
  async add(name: string, descriptor: DefaultDescriptors): Promise<void> {
    this.resource.files.set(name, descriptors.get(descriptor)!);
  }
}

export class DefaultFileDescriptor implements FileDescriptor {
  readonly type = "file";
  readonly volume: DefaultVolume;

  constructor(
    resource: File,
    readonly url: URL,
    private dispatchEvent: FileSystem["dispatchEvent"]
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

  async stat(): Promise<Stat> {
    return {
      etag: `${this.resource.buffer.length}_${this.resource.mtime}`,
      mtime: this.resource.mtime,
      size: this.resource.buffer.length,
      type: "file",
    };
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

  async read() {
    return this.resource.buffer ? this.resource.buffer : new Uint8Array();
  }

  async readText() {
    return this.resource.buffer ? utf8.decode(this.resource.buffer) : "";
  }

  async getReadbleStream() {
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

export function assertURLEndsInDir(url: URL) {
  if (url.href.slice(-1) === "/") {
    return url;
  }
  if (url.href.slice(-1) !== "/") {
    return new URL(`${url.href}/`);
  }
}
