import {
  StreamFileEntry,
  DirectoryEntry,
  recordSize,
  posixHeader,
  Header,
  calculateChecksum,
  paddingNeeded,
  assertNever,
} from "./types";
import { TMAGIC, OLDGNU_MAGIC } from "./constants";

interface Controller {
  file(entry: StreamFileEntry): void;
  directory?(entry: DirectoryEntry): void;
}

interface Options {
  checkHeader?: boolean;
  checkChecksum?: boolean;
}

type State =
  | {
      name: "startReadingHeader";
      initialBytes: Uint8Array;
    }
  | {
      name: "readingHeader";
      buffers: Uint8Array[];
    }
  | {
      name: "processingHeader";
      buffers: Uint8Array[];
      totalSize: number;
    }
  | {
      name: "startReadingFile";
      header: Header;
      initialBytes: Uint8Array;
    }
  | {
      name: "readingFile";
      paddedFileSize: number;
      bytesRead: number;
    }
  | {
      name: "finished";
    };

export class UnTar {
  private donePromise: Promise<void>;
  private streamCompleted!: () => void;
  private streamError!: (error: Error) => void;
  private options: Required<Options>;
  private state: State = { name: "readingHeader", buffers: [] };
  private reader: ReadableStreamDefaultReader<Uint8Array>;

  constructor(
    stream: ReadableStream,
    private controller: Controller,
    options?: Options
  ) {
    this.reader = stream.getReader();
    this.options = Object.assign(
      { checkChecksum: true, checkHeader: true },
      options
    );
    this.donePromise = new Promise((res, rej) => {
      this.streamCompleted = res;
      this.streamError = rej;
    });

    this.run().catch((err) => this.streamError(err));
  }

  get done(): Promise<void> {
    return this.donePromise;
  }

  private async run() {
    while (true) {
      switch (this.state.name) {
        case "readingHeader": {
          let result = await this.reader.read();
          if (result.done) {
            this.streamError(new Error(`Unexpected end of file`));
            return;
          }
          this.state.buffers.push(result.value);
          let size = this.state.buffers.reduce((a, b) => a + b.length, 0);
          if (size < recordSize) {
            break;
          }
          this.state = {
            name: "processingHeader",
            buffers: this.state.buffers,
            totalSize: size,
          };
          break;
        }
        case "processingHeader": {
          let headerBuffer = new Uint8Array(this.state.totalSize);
          let offset = 0;
          for (let buffer of this.state.buffers) {
            headerBuffer.set(buffer, offset);
            offset += buffer.length;
          }
          let initialBytes = headerBuffer.subarray(recordSize);
          if (isZeroBuffer(headerBuffer)) {
            this.state = {
              name: "finished",
            };
            break;
          }
          let header = readHeader(headerBuffer, this.options);
          this.state = {
            name: "startReadingFile",
            header,
            initialBytes,
          };
          break;
        }
        case "startReadingHeader": {
          if (this.state.initialBytes.length >= recordSize) {
            this.state = {
              name: "processingHeader",
              buffers: [this.state.initialBytes],
              totalSize: this.state.initialBytes.length,
            };
          } else {
            this.state = {
              name: "readingHeader",
              buffers: [this.state.initialBytes],
            };
          }
          break;
        }
        case "startReadingFile": {
          console.log(`starting reading file ${this.state.header.name}`);
          let paddedFileSize =
            this.state.header.size + paddingNeeded(this.state.header.size);
          if (paddedFileSize < this.state.initialBytes.length) {
            this.state = {
              name: "startReadingHeader",
              initialBytes: this.state.initialBytes.subarray(paddedFileSize),
            };
          } else {
            this.state = {
              name: "readingFile",
              bytesRead: this.state.initialBytes.length,
              paddedFileSize,
            };
          }
          break;
        }
        case "readingFile": {
          let result = await this.reader.read();
          if (result.done && this.state.bytesRead < this.state.paddedFileSize) {
            this.streamError(new Error(`Unexpected end of file`));
            return;
          }

          if (result.value) {
            this.state.bytesRead += result.value.length;
            if (this.state.bytesRead >= this.state.paddedFileSize) {
              console.log(`read ${this.state.bytesRead} bytes of file`);
              this.state = {
                name: "startReadingHeader",
                initialBytes: result.value.subarray(
                  result.value.length - this.state.bytesRead
                ),
              };
            }
          }
          // this includes the case where you still need to read more bytes and
          // remain in the readingFile state
          break;
        }

        case "finished": {
          this.streamCompleted();
          return;
        }
        default:
          throw assertNever(this.state);
      }
    }
  }
}

function isZeroBuffer(buffer: Uint8Array) {
  return buffer.every((byte) => byte === 0);
}

function readHeader(buffer: Uint8Array, options: Required<Options>): Header {
  if (buffer.length < recordSize) {
    throw new Error("unexpected end of file");
  }

  let partialHeader: any = {};
  let currentOffset = 0;
  posixHeader.forEach(function (field) {
    partialHeader[field[0]] = field[4](buffer, currentOffset, field);
    currentOffset += field[1];
  });

  let header: Header = partialHeader;

  if (
    options.checkHeader &&
    header.ustar !== TMAGIC &&
    header.ustar !== OLDGNU_MAGIC
  ) {
    throw new Error(`The file is corrupted`);
  }

  if (options.checkChecksum && calculateChecksum(buffer) !== header.checksum) {
    throw new Error(`Header checksum has failed`);
  }

  return header;
}
