import { join, splitPath, baseName, dirName } from "./path";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

export class FileSystem {
  private root = new Directory();

  async move(sourcePath: string, destPath: string): Promise<void> {
    let source = await this.openFileOrDir(sourcePath);
    let destParentDirName = dirName(destPath);
    let destParent = destParentDirName
      ? await this.openDir(destParentDirName, true)
      : this.root;
    let name = baseName(destPath);
    destParent.files.set(name, source);
    await this.remove(sourcePath);
  }

  async copy(sourcePath: string, destPath: string): Promise<void> {
    let source = await this.openFileOrDir(sourcePath);
    let destParentDirName = dirName(destPath);
    let destParent = destParentDirName
      ? await this.openDir(destParentDirName, true)
      : this.root;

    let name = baseName(destPath);
    let destItem = source instanceof File ? source.clone() : new Directory();
    destParent.files.set(name, destItem);
    if (source instanceof Directory) {
      for (let childName of [...source.files.keys()]) {
        await this.copy(
          join(sourcePath, childName),
          destPath ? join(destPath, name, childName) : name
        );
      }
    }
  }

  async remove(path: string): Promise<void> {
    let name = baseName(path);
    let dir = dirName(path);
    if (!dir) {
      this.root.files.delete(name);
    } else {
      let sourceDir = await this.openDir(dir);
      sourceDir.files.delete(name);
    }
  }

  async list(path: string, recurse = false): Promise<ListingEntry[]> {
    return await this._list(path, recurse);
  }

  private async _list(
    path: string,
    recurse = false,
    startingPath?: string
  ): Promise<ListingEntry[]> {
    if (!startingPath) {
      startingPath = path;
    }
    let directory = await this.openDir(path);
    let results: ListingEntry[] = [];
    if (startingPath === path) {
      results.push({
        path: join(path),
        stat: directory.getDescriptor().stat,
      });
    }
    for (let name of [...directory.files.keys()].sort()) {
      let item = directory.files.get(name)!;
      results.push({ path: join(path, name), stat: item.getDescriptor().stat });
      if (item instanceof Directory && recurse) {
        results.push(
          ...(await this._list(join(path, name), true, startingPath))
        );
      }
    }
    return results;
  }

  async open(
    path: string,
    createMode?: Options["createMode"]
  ): Promise<FileDescriptor> {
    return (await this._open(splitPath(path), { createMode })).getDescriptor();
  }

  private async openDir(path: string, create = false): Promise<Directory> {
    let directory = await this._open(splitPath(path), {
      createMode: create ? "directory" : undefined,
    });
    if (directory instanceof File) {
      throw new FileSystemError(
        "IS_NOT_A_DIRECTORY",
        `'${path}' is not a directory (it's a file and we were expecting it to be a directory)`
      );
    }
    return directory;
  }

  private async openFileOrDir(path: string): Promise<File | Directory> {
    return await this._open(splitPath(path));
  }

  private async _open(
    pathSegments: string[],
    opts: Options = {},
    parent?: Directory,
    initialPath?: string
  ): Promise<File | Directory> {
    if (!initialPath) {
      initialPath = join(...pathSegments);
    }
    let name = pathSegments.shift()!;

    parent = parent || this.root;
    let resource: File | Directory;
    if (!parent.files.has(name)) {
      if (pathSegments.length > 0 && opts.createMode) {
        resource = new Directory();
        parent.files.set(name, resource);
        return await this._open(pathSegments, opts, resource, initialPath);
      } else if (opts.createMode === "file") {
        resource = new File();
        parent.files.set(name, resource);
        return resource;
      } else if (opts.createMode === "directory") {
        resource = new Directory();
        parent.files.set(name, resource);
        return resource;
      } else {
        throw new FileSystemError(
          "NOT_FOUND",
          `'${initialPath}' does not exist`
        );
      }
    } else {
      resource = parent.files.get(name)!;

      // resource is a file
      if (resource instanceof File && pathSegments.length === 0) {
        return resource;
      } else if (resource instanceof File) {
        // there is unconsumed path left over...
        throw new FileSystemError(
          "NOT_FOUND",
          `'${initialPath}' does not exist`
        );
      }

      // resource is a directory
      if (pathSegments.length > 0) {
        return await this._open(pathSegments, opts, resource, initialPath);
      } else if (pathSegments.length === 0 && opts.createMode !== "file") {
        return resource;
      } else {
        // we asked for a file and got a directory back
        throw new FileSystemError(
          "IS_NOT_A_FILE",
          `'${initialPath}' is not a file (it's a directory and we were expecting it to be a file)`
        );
      }
    }
  }

  async tempDir(): Promise<string> {
    let tempDir: string;
    while (true) {
      tempDir = `/tmp/${String(
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
      )}`;
      try {
        await this.open(tempDir);
      } catch (err) {
        if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
          return tempDir;
        }
        throw err;
      }
    }
  }
}

class File {
  buffer?: Uint8Array;
  etag?: string;
  mtime: number;

  constructor() {
    this.mtime = Math.floor(Date.now() / 1000);
  }

  getDescriptor(): FileDescriptor {
    return new FileDescriptor(this);
  }

  clone(): File {
    let file = new File();
    file.etag = this.etag;
    if (this.buffer) {
      file.buffer = new Uint8Array(this.buffer);
    }
    return file;
  }
}

class Directory {
  etag?: string;
  readonly files: Files = new Map();

  getDescriptor(): FileDescriptor {
    return new FileDescriptor(this);
  }
}

export class FileDescriptor {
  constructor(private resource: File | Directory) {}

  setEtag(etag: string) {
    this.resource.etag = etag;
  }

  get stat(): Stat {
    if (this.resource instanceof Directory) {
      return {
        etag: this.resource.etag,
        type: "directory",
      };
    }
    return {
      etag: this.resource.etag,
      mtime: this.resource.mtime,
      size: this.resource.buffer ? this.resource.buffer.length : 0,
      type: "file",
    };
  }

  async write(buffer: Uint8Array): Promise<void>;
  async write(stream: ReadableStream): Promise<void>;
  async write(text: string): Promise<void>;
  async write(
    streamOrBuffer: ReadableStream | Uint8Array | string
  ): Promise<void> {
    if (this.resource instanceof Directory) {
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
  }

  async read(): Promise<Uint8Array> {
    if (this.resource instanceof Directory) {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    return this.resource.buffer ? this.resource.buffer : new Uint8Array();
  }

  async readText(): Promise<string> {
    if (this.resource instanceof Directory) {
      throw new FileSystemError("IS_NOT_A_FILE");
    }
    return this.resource.buffer ? utf8.decode(this.resource.buffer) : "";
  }

  getReadbleStream(): ReadableStream {
    if (this.resource instanceof Directory) {
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

type ErrorCodes = "NOT_FOUND" | "IS_NOT_A_FILE" | "IS_NOT_A_DIRECTORY";
export class FileSystemError extends Error {
  constructor(public readonly code: ErrorCodes, message?: string) {
    super(message ?? code);
  }
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

interface ListingEntry {
  path: string;
  stat: Stat;
}
interface Stat {
  etag?: string;
  mtime?: number;
  size?: number;
  type: "directory" | "file";
}
type Files = Map<string, File | Directory>;

interface Options {
  createMode?: "file" | "directory";
}
