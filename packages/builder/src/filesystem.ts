import { StreamFileEntry } from "tarstream/types";
import { DIRTYPE } from "tarstream/constants";

interface Stat extends Omit<StreamFileEntry, "stream"> {
  etag: string;
}

interface ListingEntry {
  path: string;
  stat: Stat;
}

type FileHeader = Omit<Stat, "etag" | "stream">;
type Files = Map<string, File>;

export class FileSystem {
  private temp = new Directory("temp");
  private root = new Directory("root");

  // this acts like mkdirp, creating any interior dirs and clobbering any
  // already existing dirs
  mkdir(path: string, root?: Directory): Directory {
    if (!root) {
      root = this.root;
    }

    let pathSegments = splitPath(path);
    let name = this.baseName(path);
    let newDir = new Directory(name);
    root.files.set(name, newDir);
    if (pathSegments.length > 1) {
      pathSegments.shift();
      return this.mkdir(join(...pathSegments), newDir);
    } else {
      return newDir;
    }
  }

  // This clobbers any existing files
  async write(
    path: string,
    header: FileHeader,
    buffer: Uint8Array,
    root?: Directory
  ): Promise<File | Directory>;
  async write(
    path: string,
    header: FileHeader,
    stream: ReadableStream,
    root?: Directory
  ): Promise<File | Directory>;
  async write(
    path: string,
    header: FileHeader,
    streamOrBuffer: ReadableStream | Uint8Array,
    root?: Directory
  ): Promise<File | Directory> {
    let temp: string | undefined;
    if (!root) {
      ({ dirName: temp, root } = this.makeTemp());
    }

    let dirName = this.dirName(path);
    let parentDir: Directory;
    if (dirName === undefined) {
      parentDir = root;
    } else {
      if (!this.exists(dirName, root)) {
        parentDir = this.mkdir(dirName, root);
      } else if (this.isFile(dirName, root)) {
        throw new Error(
          `Cannot create file '${path}' in root '${root.name}', the specified parent directory '${dirName}' is actually already a file`
        );
      } else {
        parentDir = this.retrieve(dirName, root) as Directory;
      }
    }

    let resource: File;
    let name = this.baseName(path);
    if (streamOrBuffer instanceof Uint8Array) {
      let buffer = streamOrBuffer;
      resource = new File(name, header, buffer);
    } else {
      let stream = streamOrBuffer;
      let reader = stream.getReader();
      if (header.type === DIRTYPE) {
        resource = new Directory(name, header, reader);
      } else {
        resource = new File(name, header, reader);
      }
    }
    parentDir.files.set(resource.name, resource);
    await resource.done;

    if (temp) {
      this.move(path, dirName, root, this.root);
      this.removeFromTemp(temp);
    }
    return resource;
  }

  move(
    sourcePath: string,
    // when the path is undefined that means copy the source to a direct child
    // of the destRoot.
    destPath?: string,
    sourceRoot?: Directory,
    destRoot?: Directory
  ): void {
    if (!sourceRoot) {
      sourceRoot = this.root;
    }
    if (!destRoot) {
      destRoot = this.root;
    }

    let name = this.baseName(sourcePath);
    let source = this.retrieve(sourcePath, sourceRoot);
    let dest: Directory;
    if (destPath && !this.exists(destPath, destRoot)) {
      dest = this.mkdir(destPath, destRoot);
    } else if (destPath) {
      dest = this.retrieve(destPath, destRoot) as any;
      if (dest instanceof File) {
        throw new Error(
          `${destPath} is not a directory in root '${destRoot.name}`
        );
      }
    } else {
      dest = destRoot;
    }
    dest.files.set(name, source);
    this.remove(sourcePath, sourceRoot);
  }

  remove(path: string, root?: Directory): void {
    if (!root) {
      root = this.root;
    }

    let name = this.baseName(path);
    let dirName = this.dirName(path);
    if (!dirName) {
      root.files.delete(name);
    } else {
      let sourceDir = this.retrieve(dirName, root) as Directory;
      sourceDir.files.delete(name);
    }
  }

  removeFromTemp(path: string): void {
    this.remove(path, this.temp);
  }

  baseName(path: string): string {
    return splitPath(path).pop()!;
  }

  dirName(
    path: string
  ):
    | string
    | undefined /* the root dir '/' has no parent dir (same with the temp roots) */ {
    if (path === "/" || !path.includes("/")) return;
    return path.slice(0, -1 * this.baseName(path).length);
  }

  makeTemp(): { dirName: string; root: Directory } {
    let dirName = this.tempDirName();
    return { dirName, root: this.mkdir(dirName, this.temp) };
  }

  isDirectory(path: string, root?: Directory): boolean {
    return this.retrieve(path, root) instanceof Directory;
  }

  isFile(path: string, root?: Directory): boolean {
    return !this.isDirectory(path, root);
  }

  exists(path: string, root?: Directory): boolean {
    try {
      this.retrieve(path, root);
      return true;
    } catch (err) {
      if (err.message.includes("does not exist")) {
        return false;
      }
      throw err;
    }
  }

  isEmpty(): boolean {
    return !this.exists("/");
  }

  list(path: string, recurse = false, root?: Directory): ListingEntry[] {
    return this._list(path, recurse, root);
  }

  private _list(
    path: string,
    recurse = false,
    root?: Directory,
    absolutePath?: string
  ): ListingEntry[] {
    if (!root) {
      root = this.root;
    }
    if (!absolutePath) {
      absolutePath = path;
    }

    let directory = this.retrieve(path, root);
    if (!(directory instanceof Directory)) {
      throw new Error(
        `${path} is not a directory in root '${root.name}'${
          this.isEmpty() ? ", the filesystem is empty" : ""
        }`
      );
    }

    let results: ListingEntry[] = [];
    if (absolutePath === path) {
      results.push({ path: ".", stat: directory.stat });
    }
    for (let name of [...directory.files.keys()].sort()) {
      let item = directory.files.get(name)!;
      results.push({ path: join(absolutePath, name), stat: item.stat });
      if (item instanceof Map && recurse) {
        results.push(...this._list(name, true, directory, absolutePath));
      }
    }
    return results;
  }

  retrieve(path: string, root?: Directory): File | Directory {
    return this._retrieve(path, root);
  }

  private _retrieve(
    path: string,
    root?: Directory,
    absolutePath?: string
  ): File | Directory {
    if (!root) {
      root = this.root;
    }
    if (!absolutePath) {
      absolutePath = path;
    }
    let pathSegments = splitPath(path);
    let name = pathSegments.shift()!;
    if (!root.files.has(name)) {
      throw new Error(
        `'${absolutePath}' does not exist in root '${root.name}'`
      );
    }

    let resource = root.files.get(name)!;
    if (pathSegments.length === 0) {
      return resource;
    } else if (resource instanceof Directory) {
      return this._retrieve(join(...pathSegments), resource, absolutePath);
    } else {
      // there is unconsumed path left over...
      throw new Error(
        `'${absolutePath}' does not exist in root '${root.name}'`
      );
    }
  }

  private tempDirName(): string {
    let tempDir: string;
    while (true) {
      tempDir = `tmp_${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
      if (!this.temp.files.has(tempDir)) {
        break;
      }
    }
    return tempDir;
  }
}

class File {
  private _name: string;
  // TODO eventually let's hold the data in IndexDB so that the entire
  // filesystem is not resident in memory.
  private buffer?: Uint8Array;
  private header: FileHeader;
  private reader?: ReadableStreamDefaultReader<Uint8Array>;
  done: Promise<void>;

  constructor(
    name: string,
    header: FileHeader,
    bufferOrReader: Uint8Array | ReadableStreamDefaultReader<Uint8Array>
  ) {
    this._name = name;
    this.header = { ...header };
    if (bufferOrReader instanceof Uint8Array) {
      this.buffer = bufferOrReader;
      this.done = Promise.resolve();
    } else {
      // this reader is on loan to us to it's really important that we start
      // consuming its stream.
      this.buffer = new Uint8Array(this.header.size);
      this.reader = bufferOrReader;
      this.done = new Promise(async (done) => {
        await this.startReading();
        done();
      });
    }
  }
  get name() {
    return this._name;
  }
  get data() {
    return this.buffer;
  }
  get stat(): Stat {
    return {
      name: this.name,
      etag: `${this.header.size}_${this.header.modifyTime}`,
      ...this.header,
    };
  }

  private async startReading() {
    if (!this.reader) {
      throw new Error("bug: should never get here");
    }
    let byteCount = 0;
    let buffer = new Uint8Array(this.header.size);
    while (true) {
      let chunk = await this.reader.read();
      if (chunk.done) {
        console.log(`read ${byteCount} bytes from ${this.name}`);
        break;
      } else {
        buffer.set(chunk.value, byteCount);
        byteCount += chunk.value.length;
      }
    }
  }
}

class Directory extends File {
  files: Files = new Map();
  constructor(
    name: string,
    header?: FileHeader,
    bufferOrReader?: Uint8Array | ReadableStreamDefaultReader<Uint8Array>
  ) {
    super(
      name,
      {
        ...(header ?? {
          name,
          size: 0,
          mode: 755, // seems like a reasonable default...
          modifyTime: Math.floor(Date.now() / 1000),
        }),
      },
      bufferOrReader ?? new Uint8Array()
    );
  }
}

function splitPath(path: string): string[] {
  if (path === "/") {
    return ["/"];
  }
  let segments = path.split("/");
  if (segments[0] === "") {
    segments[0] = "/";
  }
  return segments;
}

function join(...pathParts: string[]): string {
  if (pathParts.length === 0) {
    throw new Error(`no path parameters specified`);
  }
  if (pathParts[0] === "/") {
    pathParts[0] = "";
  }
  return pathParts.join("/");
}
