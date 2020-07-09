import { dispatchEvent } from "../event-bus";
import {
  eventCategory as category,
  eventGroup,
  Event as FSEvent,
} from "../filesystem";
import { ROOT, assertURLEndsInDir } from "../path";
import {
  FileSystemDriver,
  Volume,
  DirectoryDescriptor,
  FileDescriptor,
  Stat,
  readStream,
} from "./filesystem-driver";

type MemoryDescriptors = MemoryDirectoryDescriptor | MemoryFileDescriptor;
type MemoryResources = File | Directory;
let descriptors: Map<string, MemoryResources> = new Map();

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export class MemoryDriver implements FileSystemDriver {
  async mountVolume(url: URL) {
    return this.mountVolumeSync(url);
  }

  // it's adventageous to leverage the synchronous nature of the default driver
  // for mounting a default volume in the FileSystem constructor
  mountVolumeSync(url: URL) {
    return new MemoryVolume(url);
  }
}

export class MemoryVolume implements Volume {
  root: MemoryDirectoryDescriptor;

  constructor(url: URL) {
    this.root = new Directory(this).getDescriptor(url);
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

  async createFile(parent: MemoryDirectoryDescriptor, name: string) {
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

  constructor(readonly volume: MemoryVolume) {
    this.mtime = Date.now();
  }

  getDescriptor(url: URL) {
    return new MemoryDirectoryDescriptor(this, url);
  }
}

class File {
  buffer: Uint8Array = new Uint8Array();
  mtime: number;
  readonly serialNumber = makeSerialNumber();

  constructor(readonly volume: MemoryVolume) {
    this.mtime = Date.now();
  }

  getDescriptor(url: URL) {
    return new MemoryFileDescriptor(this, url);
  }
}

export class MemoryDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly volume: MemoryVolume;

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

  private async get(name: string): Promise<MemoryDescriptors> {
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
      return (await this.get(name)) as MemoryFileDescriptor;
    }
    return;
  }

  async getDirectory(name: string) {
    if (name === "/") {
      return this.volume.root;
    }
    if (this.hasDirectory(name)) {
      return (await this.get(name)) as MemoryDirectoryDescriptor;
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

  async add(name: string, descriptor: MemoryDirectoryDescriptor): Promise<void>;
  async add(name: string, descriptor: MemoryFileDescriptor): Promise<void>;
  async add(name: string, descriptor: MemoryDescriptors): Promise<void> {
    this.resource.files.set(name, descriptors.get(descriptor.url.href)!);
  }
}

export class MemoryFileDescriptor implements FileDescriptor {
  readonly type = "file";
  readonly volume: MemoryVolume;

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

function makeSerialNumber(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
