import { StreamFileEntry } from "tarstream/types";
import { DIRTYPE } from "tarstream/constants";
import { UnTar } from "tarstream";

interface Stat extends Omit<StreamFileEntry, "stream"> {
  etag: string;
}

interface ListingEntry {
  path: string;
  stat: Stat;
}

type FileHeader = Omit<Stat, "etag" | "stream">;
type Files = Map<string, File>;

/*
The FileSystem class is an abstraction for the file system that the file daemon
is serving. The FileSystem class leverages a graph to represent the filesystem,
where each node in the graph is an instance of a `File`. Parent nodes in the
graph effectively represent directories (and leaf nodes are files). The
directory is represented as a `Directory` instance which is a specialization of
the `File` class--specifically it has an additional `files` property that holds
its child nodes (which may be File instances or Directory instances).

The FileSystem has 2 top level `Directory` instances:
1. `FileSystem.temp`: This is a scratch root folder that is used when we are
   streaming file data into this class. After all the streaming has completed
   for a specific write transaction (where a transaction may be writing a single
   file up to replacing the entire file system), we'll move the root folder that
   we were streaming into to the "real" file system. This way clients of the
   `FileSystem` never see partial files--all the writes appear atomic to the
   outside world.
2. `FileSystem.root`: This is the "real" file system that clients of this class
   will interact with. When we stream files into the `FileSystem` we'll always
   stream files into the `temp` root first, and then once completed, move into
   this directory.

The FileSystem contains normal CRUD operations that you'd expect for a file
system: `mkdir()`, `retrieve()`, `write()`, `move()`, `copy()`, `remove()`,
`list()`, etc. All the operations allow you to optionally specify which "root"
you'd like to operate against: the "real" root or the temp root. If you don't
specify a root, then the "real" root will be assumed. You can only operate
against a specific temp root that has been created and passed to you via
`makeTemp()`, which allow us to nicely sandbox our temp folders.

To make it easy to to leverage the temp root swapping functionality for
streaming files into the filesystem, there is a FileSystem.transaction()
function. This function yields a temp root to a callback that you provide that
allows you to perform mulitple file system actions (e.g. like streaming in the
entire file system). After your callback is executed, this function will move
your temp root into the "real" root at the path that you specify (or `undefined`
to replace the entire FileSystem). If your transaction throws an exception, the
temp root will be removed, and no lingering artifacts will remain in the temp
root.

Note that `.` and `..` are not currently recognized in path names for the
various FileSystem functions.
*/

type TransactionCallBack = (root: Directory) => Promise<unknown>;

export class FileSystem {
  ready: Promise<void>;
  private completedSync!: () => void;
  private temp = new Directory("temp");
  private root = new Directory("root");

  constructor(fsStream: ReadableStream) {
    this.ready = new Promise((res) => (this.completedSync = res));
    this.initialize(fsStream);
  }

  // Note that there is no need to wrap a tansaction for a single write()
  // operation. write() will inherently use a transaction. Use transaction()
  // when you need to make multiple writes to the FileSystem as a siingle transaction.
  async transaction(
    fn: TransactionCallBack,
    replacePath?: string // don't specify this if you want to replace the entire filesystem
  ): Promise<void> {
    if (
      replacePath &&
      (!this.exists(replacePath) || this.isFile(replacePath))
    ) {
      throw new Error(
        `The replacePath '${replacePath}' must be a directory that exists in the root file system`
      );
    }
    let { dirName: temp, root: tempRoot } = this.makeTemp();
    try {
      if (replacePath) {
        await this.copy(replacePath, undefined, this.root, tempRoot);
      }
      await fn(tempRoot);
      await this.move(
        replacePath ? this.baseName(replacePath) : "/",
        replacePath ? this.dirName(replacePath) : undefined,
        tempRoot
      );
    } finally {
      this.removeFromTemp(temp);
    }
  }

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
    if (!root) {
      let resource: File | Directory;
      await this.transaction(async (tempRoot) => {
        resource = await this._write(path, header, streamOrBuffer, tempRoot);
      });
      return resource!;
    } else {
      return await this._write(path, header, streamOrBuffer, root);
    }
  }

  private async _write(
    path: string,
    header: FileHeader,
    streamOrBuffer: ReadableStream | Uint8Array,
    root: Directory
  ): Promise<File | Directory> {
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

    // we don't hold the full path in the header name so that moving directories
    // doest trigger a cascade of file changes
    header.name = name;
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
    await resource.data;
    return resource;
  }

  async move(
    sourcePath: string,
    // when the path is undefined that means move the source to a direct child
    // of the destRoot.
    destPath?: string,
    sourceRoot?: Directory,
    destRoot?: Directory
  ): Promise<void> {
    await this.copyOrMove(
      sourcePath,
      destPath,
      sourceRoot,
      destRoot,
      false,
      false
    );
    this.remove(sourcePath, sourceRoot);
  }

  async copy(
    sourcePath: string,
    // when the path is undefined that means copy the source to a direct child
    // of the destRoot.
    destPath?: string,
    sourceRoot?: Directory,
    destRoot?: Directory
  ): Promise<void> {
    await this.copyOrMove(
      sourcePath,
      destPath,
      sourceRoot,
      destRoot,
      true,
      true
    );
  }

  private async copyOrMove(
    sourcePath: string,
    destPath: string | undefined,
    sourceRoot: Directory | undefined,
    destRoot: Directory | undefined,
    recursive: boolean,
    cloneItems: boolean
  ): Promise<void> {
    if (!sourceRoot) {
      sourceRoot = this.root;
    }
    if (!destRoot) {
      destRoot = this.root;
    }
    let source = this.retrieve(sourcePath, sourceRoot);
    let dest: Directory;
    if (destPath && !this.exists(destPath, destRoot)) {
      dest = this.mkdir(destPath, destRoot);
    } else if (destPath) {
      dest = this.retrieve(destPath, destRoot) as any;
      if (!(dest instanceof Directory)) {
        throw new Error(
          `The destination directory '${destPath}' cannot be a file in root '${destRoot.name}`
        );
      }
    } else {
      dest = destRoot;
    }

    let name = this.baseName(sourcePath);
    let destItem: File | Directory;
    if (cloneItems) {
      destItem = await source.clone();
    } else {
      destItem = source;
    }
    dest.files.set(name, destItem);
    if (
      source instanceof Directory &&
      destItem instanceof Directory &&
      recursive
    ) {
      for (let childName of [...source.files.keys()]) {
        await this.copyOrMove(
          childName,
          undefined,
          source,
          destItem,
          true,
          true
        );
      }
    }
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

  dirName(path: string): string | undefined {
    // the root dir '/' has no parent dir (same with the temp roots)
    if (path === "/" || !path.includes("/")) return;

    let dirName = path.slice(0, -1 * this.baseName(path).length - 1);
    if (path.charAt(0) === "/") {
      return dirName || "/";
    }
    return dirName;
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
      results.push({ path: "./", stat: directory.stat });
    }
    for (let name of [...directory.files.keys()].sort()) {
      let item = directory.files.get(name)!;
      results.push({ path: `.${join(absolutePath, name)}`, stat: item.stat });
      if (item instanceof Directory && recurse) {
        results.push(
          ...this._list(name, true, directory, join(absolutePath, name))
        );
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

  private async initialize(stream: ReadableStream): Promise<void> {
    await this.transaction(async (root) => {
      let fs = this;
      let untar = new UnTar(stream, {
        file(entry) {
          (async () => {
            await fs.write(entry.name, entry, entry.stream(), root);
          })();
        },
      });
      await untar.done;
    });
    this.completedSync();
  }
}

export class File {
  readonly data: Promise<Uint8Array>;

  protected readonly header: FileHeader;
  private readonly _name: string;
  private readonly reader?: ReadableStreamDefaultReader<Uint8Array>;
  private doneReading?: (buffer: Uint8Array) => void;

  constructor(
    name: string,
    header: FileHeader,
    bufferOrReader: Uint8Array | ReadableStreamDefaultReader<Uint8Array>
  ) {
    this._name = name;
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
  get name() {
    return this._name;
  }
  get stat(): Stat {
    return {
      name: this.name,
      etag: `${this.header.size}_${this.header.modifyTime}`,
      ...this.header,
    };
  }

  async clone(): Promise<File> {
    return new File(this.name, this.header, new Uint8Array(await this.data));
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
        console.log(`read ${byteCount} bytes from ${this.name}`);
        this.doneReading(buffer);
        break;
      } else {
        buffer.set(chunk.value, byteCount);
        byteCount += chunk.value.length;
      }
    }
  }
}

export class Directory extends File {
  readonly files: Files = new Map();
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

  async clone(): Promise<Directory> {
    await this.data;
    return new Directory(this.name, this.header, new Uint8Array());
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
  if (pathParts.length === 0) {
    throw new Error(`no path parameters specified`);
  }
  if (pathParts[0] === "/") {
    pathParts[0] = "";
  }

  return pathParts.join("/");
}
