export interface FileSystemDriver {
  mountVolume(url: URL): Promise<Volume>;
}

export interface Volume {
  root: DirectoryDescriptor | FileDescriptor;
  createDirectory(
    parent: DirectoryDescriptor,
    name: string
  ): Promise<DirectoryDescriptor>;
  createFile(
    parent: DirectoryDescriptor,
    name: string
  ): Promise<FileDescriptor>;
  willUnmount(): Promise<void>;
}

interface Descriptor {
  readonly url: URL;
  readonly volume: Volume;
  stat(): Promise<Stat>;
  close(): void;
}

// TODO split this between a FileStat and a DirectoryStat
export interface Stat {
  etag?: string;
  mtime: number;
  size?: number;
  type: "directory" | "file";
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

export function makeStream(buffer: Uint8Array): ReadableStream {
  return new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      controller.enqueue(buffer);
      controller.close();
    },
  });
}
