import {
  FileEntry,
  StreamFileEntry,
  posixHeader,
  calculateChecksum,
  formatTarNumber,
  recordSize,
} from "./types";
import constants from "./constants";

export class Tar {
  private queue: FileEntry[] = [];
  private finished = false;

  constructor() {}

  addFile(file: FileEntry): void {
    if (this.finished) {
      throw new Error(`can't addFile after calling finish`);
    }
    this.queue.push(file);
  }

  finish(): ReadableStream<Uint8Array> {
    if (this.finished) {
      throw new Error(`tried to call finish more than once`);
    }
    this.finished = true;
    return new TarStream(this.queue);
  }
}

class TarStream implements ReadableStream<Uint8Array> {
  private _locked = false;

  constructor(private queue: FileEntry[]) {}

  get locked() {
    return this._locked;
  }

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  getReader(options: { mode: "byob" }): ReadableStreamBYOBReader;
  getReader(): ReadableStreamDefaultReader<Uint8Array>;
  getReader(options?: {
    mode?: string;
  }): ReadableStreamReader<Uint8Array> | ReadableStreamBYOBReader {
    if (options?.mode === "byob") {
      throw new Error(`unimplemented`);
    }
    this._locked = true;
    return new TarStreamReader(this.queue, () => {
      this._locked = false;
    });
  }

  tee(): [ReadableStream, ReadableStream] {
    throw new Error("unimplemented");
  }

  pipeThrough<T>(
    _args: {
      writable: WritableStream<Uint8Array>;
      readable: ReadableStream<T>;
    },
    _options?: PipeOptions
  ): ReadableStream<T> {
    throw new Error(`unimplemented`);
  }

  pipeTo(
    _dest: WritableStream<Uint8Array>,
    _options?: PipeOptions
  ): Promise<void> {
    throw new Error(`unimplemented`);
  }
}

type State =
  | { name: "readyForNextFile" }
  | { name: "sentHeader"; currentFile: FileEntry }
  | { name: "sentUnpaddedFile"; paddingNeeded: number }
  | {
      name: "streamingFile";
      reader: ReadableStreamDefaultReader<Uint8Array>;
      currentFile: StreamFileEntry;
      bytesSent: number;
    }
  | { name: "sentEndChunks" };

class TarStreamReader implements ReadableStreamDefaultReader {
  private state: State = { name: "readyForNextFile" };

  private _isClosed!: () => void;
  private _closed: Promise<void>;

  constructor(private queue: FileEntry[], private unlock: () => void) {
    this._closed = new Promise(r => {
      this._isClosed = r;
    });
  }

  get closed(): Promise<void> {
    return this._closed;
  }

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  async read(): Promise<ReadableStreamReadResult<Uint8Array>> {
    switch (this.state.name) {
      case "readyForNextFile":
        let file = this.queue.shift();
        if (!file) {
          // at the end we have to emit two empty records
          this.state = { name: "sentEndChunks" };
          return { value: new Uint8Array(recordSize * 2), done: false };
        }
        let buffer = new Uint8Array(recordSize);
        this.writeHeader(buffer, file);
        this.state = { name: "sentHeader", currentFile: file };
        return { value: buffer, done: false };
      case "sentHeader":
        if ("data" in this.state.currentFile) {
          // it's a buffer, so we can finish it right now
          let buffer = this.state.currentFile.data;
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: paddingNeeded(buffer.length),
          };
          return { value: buffer, done: false };
        }
        // start streaming the file
        this.state = {
          name: "streamingFile",
          reader: this.state.currentFile.stream.getReader(),
          currentFile: this.state.currentFile,
          bytesSent: 0,
        };
        return this.read();
      case "streamingFile":
        let chunk = await this.state.reader.read();
        if (chunk.done) {
          if (this.state.bytesSent !== this.state.currentFile.size) {
            throw new Error(
              `file size mismatch: you said ${this.state.currentFile} is ` +
                `${this.state.currentFile.size} bytes, but streamed ${this.state.bytesSent} bytes`
            );
          }
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: paddingNeeded(this.state.bytesSent),
          };
          return this.read();
        }
        this.state = {
          name: "streamingFile",
          reader: this.state.reader,
          currentFile: this.state.currentFile,
          bytesSent: this.state.bytesSent + chunk.value.length,
        };
        return chunk;
      case "sentUnpaddedFile":
        if (this.state.paddingNeeded === 0) {
          this.state = { name: "readyForNextFile" };
          return this.read();
        }
        let padding = new Uint8Array(this.state.paddingNeeded);
        this.state = { name: "readyForNextFile" };
        return { value: padding, done: false };
      case "sentEndChunks":
        this._isClosed();
        return { value: undefined, done: true };
      default:
        throw assertNever(this.state);
    }
  }

  releaseLock() {
    this.unlock();
  }

  private writeHeader(buffer: Uint8Array, file: FileEntry) {
    let currentOffset = 0;
    posixHeader.forEach(function(field) {
      let value = field[3](file, field);
      let length = value.length;
      for (let i = 0; i < length; i += 1) {
        buffer[currentOffset + i] = value.charCodeAt(i) & 0xff;
      }
      currentOffset += field[1]; // move to the next field
    });

    let field = posixHeader.find(function(field) {
      return field[0] == "checksum";
    });

    if (field) {
      // Patch checksum field
      let checksum = calculateChecksum(buffer, 0, true);
      let value =
        formatTarNumber(checksum, field[1] - 2) + constants.NULL_CHAR + " ";
      currentOffset = field[2];
      for (let i = 0; i < value.length; i += 1) {
        // put bytes
        buffer[currentOffset] = value.charCodeAt(i) & 0xff;
        currentOffset++;
      }
    }
  }
}

function paddingNeeded(size: number) {
  // align to record boundary
  return Math.ceil(size / recordSize) * recordSize - size;
}

function assertNever(_value: never): never {
  throw new Error(`not never`);
}
