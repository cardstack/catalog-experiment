import { Memoize } from "typescript-memoize";
import {
  StreamFileEntry,
  recordSize,
  posixHeader,
  Header,
  calculateChecksum,
  paddingNeeded,
} from "./types";
import { assertNever } from "@catalogjs/shared/util";
import { TMAGIC, OLDGNU_MAGIC } from "./constants";

interface Controller {
  file(entry: StreamFileEntry): Promise<void>;
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
      name: "startReadingPadding";
      initialBytes: Uint8Array;
      bytesRemaining: number;
    }
  | {
      name: "readingPadding";
      bytesRemaining: number;
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
          let streamer = new FileStreamer(
            this.state.header,
            this.state.initialBytes,
            this.reader
          );
          await this.controller.file(streamer.entry);
          let initialBytes = await streamer.done;

          this.state = {
            name: "startReadingPadding",
            initialBytes,
            bytesRemaining: paddingNeeded(this.state.header.size),
          };
          break;
        }

        case "startReadingPadding": {
          if (this.state.initialBytes.length >= this.state.bytesRemaining) {
            this.state = {
              name: "startReadingHeader",
              initialBytes: this.state.initialBytes.subarray(
                this.state.bytesRemaining
              ),
            };
          } else {
            this.state = {
              name: "readingPadding",
              bytesRemaining:
                this.state.bytesRemaining - this.state.initialBytes.length,
            };
          }
          break;
        }

        case "readingPadding": {
          let result = await this.reader.read();
          if (result.done) {
            this.streamError(new Error(`Unexpected end of file`));
            return;
          }

          if (result.value.length >= this.state.bytesRemaining) {
            this.state = {
              name: "startReadingHeader",
              initialBytes: result.value.subarray(this.state.bytesRemaining),
            };
          } else {
            this.state.bytesRemaining -= result.value.length;
          }

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

  if (options.checkHeader && ![TMAGIC, OLDGNU_MAGIC].includes(header.ustar)) {
    throw new Error(`The file is corrupted`);
  }

  if (options.checkChecksum && calculateChecksum(buffer) !== header.checksum) {
    throw new Error(`Header checksum has failed`);
  }

  return header;
}

class FileStreamer {
  private stream: ReadableStream;
  private bytesSent = 0;
  private isDone!: (extraBytes: Uint8Array) => void;
  private interrupted!: (error: Error) => void;
  done: Promise<Uint8Array>;

  constructor(
    private header: Header,
    private initialBytes: Uint8Array,
    private reader: ReadableStreamDefaultReader
  ) {
    this.done = new Promise((res, rej) => {
      this.isDone = res;
      this.interrupted = rej;
    });
    this.stream = new ReadableStream(this);
  }

  async start(controller: ReadableStreamDefaultController) {
    return withStreamingErrorHandling(controller, async () => {
      if (this.initialBytes.length < this.header.size) {
        controller.enqueue(this.initialBytes);
        this.bytesSent += this.initialBytes.length;
      } else {
        let buffer = this.initialBytes.subarray(0, this.header.size);
        controller.enqueue(buffer);
        this.bytesSent += buffer.length;
        controller.close();
        this.isDone(this.initialBytes.subarray(buffer.length));
      }
    });
  }

  async pull(controller: ReadableStreamDefaultController) {
    return withStreamingErrorHandling(controller, async () => {
      let chunk = await this.reader.read();
      if (chunk.done) {
        let error = new Error(`Unexpected end of file`);
        this.interrupted(error);
        controller.error(error);
        return;
      }
      let bytesLeft = this.header.size - this.bytesSent;
      if (chunk.value.length < bytesLeft) {
        controller.enqueue(chunk.value);
        this.bytesSent += chunk.value.length;
      } else {
        let buffer = chunk.value.subarray(0, bytesLeft);
        controller.enqueue(buffer);
        this.bytesSent += buffer.length;
        controller.close();
        this.isDone(chunk.value.subarray(bytesLeft));
      }
    });
  }

  @Memoize()
  get entry(): StreamFileEntry {
    let header = this.header;
    return {
      stream: () => this.stream,
      name: header.name,
      size: header.size,
      mode: header.mode,
      uid: header.uid,
      gid: header.gid,
      type: header.type,
      owner: header.owner,
      group: header.group,
      prefix: header.prefix,
      accessTime: header.accessTime,
      createTime: header.createTime,
      modifyTime: header.modifyTime,
    };
  }
}

function withStreamingErrorHandling(
  controller: ReadableStreamDefaultController,
  fn: () => Promise<void>
) {
  try {
    return fn();
  } catch (err) {
    controller.error(err);
  }
  return;
}
