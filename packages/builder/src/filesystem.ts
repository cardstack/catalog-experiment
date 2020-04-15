interface ListingEntry {
  path: string;
  stat: Stat;
}

interface FileHeader {
  mtime: number;
  size: number;
}
interface Stat extends FileHeader {
  etag: string;
  type: "file" | "directory";
}
type Files = Map<string, File | Directory>;

/*
The FileSystem class is an abstraction for the file system that the file daemon
is serving. The FileSystem class leverages a graph to represent the filesystem,
where each node in the graph is an instance of a `File`. Parent nodes in the
graph effectively represent directories (and leaf nodes are files). The
directory is represented as a `Directory` instance.

Note that `.` and `..` are not yet currently recognized in path names for the
various FileSystem functions.
*/

type TransactionCallBack = (txn: string) => Promise<unknown>;

export class FileSystem {
  private root = new Directory();

  constructor() {
    this.mkdir("/tmp");
  }

  // Note that there is no need to wrap a transaction for a single write()
  // operation. write() will inherently use a transaction. Use transaction()
  // when you need to make multiple writes to the FileSystem as a single transaction.
  async transaction(
    fn: TransactionCallBack,
    replacePath: string
  ): Promise<void> {
    let temp = this.makeTemp();
    try {
      await fn(temp);
      this.move(join(temp, replacePath), replacePath);
    } finally {
      this.remove(temp);
    }
  }

  // this acts like mkdirp, creating any new interior dirs. If dir already
  // exists, then this will just return the existing dir.
  mkdir(path: string, header?: FileHeader, txnDir?: string): Directory {
    return this._mkdir(splitPath(join(txnDir || "", path)), undefined, header);
  }

  private _mkdir(
    pathSegments: string[],
    parent: string = "",
    header?: FileHeader
  ): Directory {
    let parentDir = parent ? (this.open(parent) as Directory) : this.root;
    let name = pathSegments.shift()!;
    let dir: Directory;
    let dirName = join(parent, name);
    if (!this.exists(dirName)) {
      dir = new Directory(pathSegments.length === 0 ? header : undefined);
      parentDir.files.set(name, dir);
    } else if (this.isDirectory(dirName)) {
      dir = this.open(dirName) as Directory;
    } else {
      throw new Error(`The directory '${dirName}' specified is already a file`);
    }
    if (pathSegments.length > 0) {
      return this._mkdir(pathSegments, dirName, header);
    } else {
      if (header) {
        dir.setHeader(header);
      }
      return dir;
    }
  }

  async write(
    path: string,
    header: FileHeader,
    buffer: Uint8Array,
    txnDir?: string
  ): Promise<File | Directory>;
  async write(
    path: string,
    header: FileHeader,
    stream: ReadableStream,
    txnDir?: string
  ): Promise<File | Directory>;
  async write(
    path: string,
    header: FileHeader,
    text: string,
    txnDir?: string
  ): Promise<File | Directory>;
  async write(
    path: string,
    header: FileHeader,
    streamOrBuffer: ReadableStream | Uint8Array | string,
    txnDir?: string
  ): Promise<File | Directory> {
    if (!txnDir) {
      let resource: File | Directory;
      await this.transaction(async (txn) => {
        resource = await this._write(path, header, streamOrBuffer, txn);
      }, path);
      return resource!;
    } else {
      return await this._write(path, header, streamOrBuffer, txnDir);
    }
  }

  private async _write(
    path: string,
    header: FileHeader,
    streamOrBuffer: ReadableStream | Uint8Array | string,
    txnDir: string
  ): Promise<File | Directory> {
    path = join(txnDir, path);
    let dirName = this.dirName(path);
    if (!dirName) {
      throw new Error(`cannot overwrite '/'`);
    }
    let parentDir = this.mkdir(dirName);
    let resource: File;
    let name = this.baseName(path);
    if (streamOrBuffer instanceof Uint8Array) {
      let buffer = streamOrBuffer;
      resource = new File(header, buffer);
    } else if (typeof streamOrBuffer === "string") {
      resource = new File(header, new TextEncoder().encode(streamOrBuffer));
    } else {
      let stream = streamOrBuffer;
      let reader = stream.getReader();
      resource = new File(header, reader);
    }
    parentDir.files.set(name, resource);
    await resource.data;
    return resource;
  }

  move(sourcePath: string, destPath: string): void {
    let source = this.open(sourcePath);
    let destParentDirName = this.dirName(destPath);
    if (destParentDirName) {
      this.mkdir(destParentDirName);
    }
    let destParent = destParentDirName
      ? (this.open(destParentDirName) as Directory)
      : this.root;
    let name = this.baseName(destPath);
    destParent.files.set(name, source);
    this.remove(sourcePath);
  }

  async copy(sourcePath: string, destPath: string): Promise<void> {
    let source = this.open(sourcePath);
    let destParentDirName = this.dirName(destPath);
    if (destParentDirName) {
      this.mkdir(destParentDirName);
    }
    let destParent = destParentDirName
      ? (this.open(destParentDirName) as Directory)
      : this.root;

    let name = this.baseName(destPath);
    let destItem = await source.clone();
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

  remove(path: string): void {
    let name = this.baseName(path);
    let dirName = this.dirName(path);
    if (!dirName) {
      this.root.files.delete(name);
    } else {
      let sourceDir = this.open(dirName) as Directory;
      sourceDir.files.delete(name);
    }
  }

  baseName(path: string): string {
    return splitPath(path).pop()!;
  }

  dirName(path: string): string | undefined {
    // the root dir '/' has no parent dir
    if (path === "/" || !path.includes("/")) return;

    let dirName = path.slice(0, -1 * this.baseName(path).length - 1);
    if (path.charAt(0) === "/") {
      return dirName || "/";
    }
    return dirName;
  }

  makeTemp(): string {
    let dirName = `/tmp/${this.tempDirName()}`;
    this.mkdir(dirName);
    return dirName;
  }

  isDirectory(path: string): boolean {
    return this.open(path) instanceof Directory;
  }

  isFile(path: string): boolean {
    return !this.isDirectory(path);
  }

  exists(path: string): boolean {
    try {
      this.open(path);
      return true;
    } catch (err) {
      if (err.message.includes("does not exist")) {
        return false;
      }
      throw err;
    }
  }

  list(path: string, recurse = false): ListingEntry[] {
    return this._list(path, recurse);
  }

  private _list(
    path: string,
    recurse = false,
    startingPath?: string
  ): ListingEntry[] {
    if (!startingPath) {
      startingPath = path;
    }

    let directory = this.open(path);
    if (!(directory instanceof Directory)) {
      throw new Error(`${path} is not a directory`);
    }

    let results: ListingEntry[] = [];
    if (startingPath === path) {
      results.push({ path: "./", stat: directory.stat });
    }
    for (let name of [...directory.files.keys()].sort()) {
      let item = directory.files.get(name)!;
      results.push({ path: `.${join(path, name)}`, stat: item.stat });
      if (item instanceof Directory && recurse) {
        results.push(...this._list(join(path, name), true, startingPath));
      }
    }
    return results;
  }

  open(path: string): File | Directory {
    return this._open(splitPath(path));
  }

  private _open(
    pathSegments: string[],
    parent?: Directory,
    initialPath?: string
  ): File | Directory {
    if (!initialPath) {
      initialPath = join(...pathSegments);
    }
    let name = pathSegments.shift()!;

    parent = parent || this.root;
    if (!parent.files.has(name)) {
      throw new Error(`'${initialPath}' does not exist`);
    }

    let resource = parent.files.get(name)!;
    if (pathSegments.length === 0) {
      return resource;
    } else if (resource instanceof Directory) {
      return this._open(pathSegments, resource, initialPath);
    } else {
      // there is unconsumed path left over...
      throw new Error(`'${initialPath}' does not exist`);
    }
  }

  private tempDirName(): string {
    let tempDir: string;
    while (true) {
      tempDir = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
      if (!this.exists(`/tmp/${tempDir}`)) {
        break;
      }
    }
    return tempDir;
  }
}

export class File {
  readonly data: Promise<Uint8Array>;

  protected readonly header: FileHeader;
  private readonly reader?: ReadableStreamDefaultReader<Uint8Array>;
  private doneReading?: (buffer: Uint8Array) => void;

  constructor(
    header: FileHeader,
    bufferOrReader: Uint8Array | ReadableStreamDefaultReader<Uint8Array>
  ) {
    this.header = { ...header };
    if (bufferOrReader instanceof Uint8Array) {
      this.data = Promise.resolve(bufferOrReader);
    } else {
      // this reader is on loan to us to it's really important that we start
      // consuming its stream immediately.
      this.reader = bufferOrReader;
      this.data = new Promise(async (res) => (this.doneReading = res));
      this.startReading();
    }
  }
  get stat(): Stat {
    return {
      ...this.header,
      etag: `${this.header.size}_${this.header.mtime}`,
      type: "file",
    };
  }

  async clone(): Promise<File> {
    return new File(this.header, new Uint8Array(await this.data));
  }

  private async startReading() {
    if (!this.reader || typeof this.doneReading !== "function") {
      throw new Error("bug: should never get here");
    }
    let byteCount = 0;
    let buffer = new Uint8Array(this.header.size);
    while (true) {
      let chunk = await this.reader.read();
      if (chunk.done) {
        this.doneReading(buffer);
        break;
      } else {
        buffer.set(chunk.value, byteCount);
        byteCount += chunk.value.length;
      }
    }
  }
}

export class Directory {
  readonly files: Files = new Map();
  private header: FileHeader;
  constructor(header?: FileHeader) {
    this.header = header ?? {
      size: 0,
      mtime: Math.floor(Date.now() / 1000),
    };
  }

  setHeader(header: FileHeader) {
    this.header = header;
  }

  get stat(): Stat {
    return {
      etag: String(this.header.mtime),
      type: "directory",
      ...this.header,
    };
  }

  async clone(): Promise<Directory> {
    return new Directory(this.header);
  }
}

export function splitPath(path: string): string[] {
  if (path === "/") {
    return ["/"];
  }
  let segments = path.split("/");
  if (segments[0] === "") {
    segments[0] = "/";
  }
  return segments;
}

export function join(...pathParts: string[]): string {
  pathParts = pathParts.filter(Boolean);
  if (pathParts.length === 0) {
    throw new Error(`no path parameters specified`);
  }
  if (pathParts.length === 1 && pathParts[0] === "/") {
    return "/";
  }

  for (let part of pathParts) {
    if (part.slice(0, 1) === "/") {
      part = part.slice(1);
    }
  }
  pathParts = pathParts.map((part) =>
    part.slice(0, 1) === "/" ? part.slice(1) : part
  );

  return `/${pathParts.filter(Boolean).join("/")}`;
}
