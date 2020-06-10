import { dispatchEvent } from "../event-bus";
import {
  FileSystem,
  eventCategory as category,
  eventGroup,
  Event as FSEvent,
} from "../filesystem";
import { ROOT, assertURLEndsInDir } from "../path";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export interface FileSystemDriver {
  mountVolume(fs: FileSystem, id: string, url: URL): Promise<Volume>;
}

export interface Volume {
  id: string;
  root: DirectoryDescriptor | FileDescriptor;
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
  getDirectory(name: string): Promise<DirectoryDescriptor | undefined>;
  getFile(name: string): Promise<FileDescriptor | undefined>;
  children(): Promise<string[]>;
  hasDirectory(name: string): Promise<boolean>;
  hasFile(name: string): Promise<boolean>;
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
let descriptors: Map<string, DefaultResources> = new Map();

export class DefaultDriver implements FileSystemDriver {
  async mountVolume(_fs: FileSystem, id: string, url: URL) {
    return this.mountVolumeSync(id, url);
  }

  // it's adventageous to leverage the synchronous nature of the default driver
  // for mounting a default volume in the FileSystem constructor
  mountVolumeSync(id: string | undefined, url: URL) {
    return new DefaultVolume(id, url);
  }
}

export class DefaultVolume implements Volume {
  readonly id: string;
  root: DefaultDirectoryDescriptor;

  constructor(id: string | undefined, url: URL) {
    this.root = new Directory(this).getDescriptor(url);
    if (!id) {
      this.id = this.root.inode;
    } else {
      this.id = id;
    }
  }

  async createDirectory(parent: DirectoryDescriptor, name: string) {
    let directory = new Directory(this);
    let url: URL;
    // The root folder is a special internal folder that only contains URL
    // origins. So we fashion URL's from these origin for the child dirs.
    if (parent.url.href === ROOT.href) {
      url = new URL(name);
    } else {
      url = new URL(name, assertURLEndsInDir(parent.url));
    }
    let descriptor = directory.getDescriptor(url);
    await parent.add(name, descriptor);
    return descriptor;
  }

  async createFile(parent: DefaultDirectoryDescriptor, name: string) {
    let file = new File(this);
    let url = new URL(name, assertURLEndsInDir(parent.url));
    let descriptor = file.getDescriptor(url);
    await parent.add(name, descriptor);
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

  getDescriptor(url: URL) {
    return new DefaultDirectoryDescriptor(this, url);
  }
}

class File {
  buffer: Uint8Array = new Uint8Array();
  mtime: number;
  readonly serialNumber = makeSerialNumber();

  constructor(readonly volume: DefaultVolume) {
    this.mtime = Date.now();
  }

  getDescriptor(url: URL) {
    return new DefaultFileDescriptor(this, url);
  }
}

export class DefaultDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly volume: DefaultVolume;

  constructor(resource: Directory, readonly url: URL) {
    descriptors.set(this.url.href, resource);
    this.volume = resource.volume;
  }

  private get resource() {
    return descriptors.get(this.url.href)! as Directory;
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

  private async get(name: string): Promise<DefaultDescriptors> {
    let url: URL;
    if (this.url === ROOT) {
      url = new URL(name);
    } else {
      url = new URL(name, assertURLEndsInDir(this.url));
    }
    return this.resource.files.get(name)!.getDescriptor(url);
  }

  async getFile(name: string) {
    if (this.hasFile(name)) {
      return (await this.get(name)) as DefaultFileDescriptor;
    }
    return;
  }

  async getDirectory(name: string) {
    if (name === "/") {
      return this.volume.root;
    }
    if (this.hasDirectory(name)) {
      return (await this.get(name)) as DefaultDirectoryDescriptor;
    }
    return;
  }

  async children() {
    return [...this.resource.files.keys()];
  }

  async hasDirectory(name: string) {
    if (name === "/") {
      return true;
    }
    let resource = this.resource.files.get(name);
    if (!resource) {
      return false;
    }
    return resource instanceof Directory;
  }

  async hasFile(name: string) {
    let resource = this.resource.files.get(name);
    if (!resource) {
      return false;
    }
    return resource instanceof File;
  }

  async remove(name: string) {
    this.resource.files.delete(name);
  }

  async add(
    name: string,
    descriptor: DefaultDirectoryDescriptor
  ): Promise<void>;
  async add(name: string, descriptor: DefaultFileDescriptor): Promise<void>;
  async add(name: string, descriptor: DefaultDescriptors): Promise<void> {
    this.resource.files.set(name, descriptors.get(descriptor.url.href)!);
  }
}

export class DefaultFileDescriptor implements FileDescriptor {
  readonly type = "file";
  readonly volume: DefaultVolume;

  constructor(resource: File, readonly url: URL) {
    descriptors.set(this.url.href, resource);
    this.volume = resource.volume;
  }

  private get resource() {
    return descriptors.get(this.url.href)! as File;
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
    dispatchEvent<FSEvent>(eventGroup, {
      category,
      href: this.url.href,
      type: "write",
    });
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
