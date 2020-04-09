import {
  FileEntry,
  StreamFileEntry,
  posixHeader,
  calculateChecksum,
  formatTarNumber,
  recordSize,
  paddingNeeded,
  assertNever,
} from "./types";
import { DIRTYPE, NULL_CHAR } from "./constants";

type State =
  | { name: "readyForNextFile" }
  | { name: "sentHeader"; currentFile: FileEntry }
  | { name: "sentUnpaddedFile"; paddingNeeded: number; close?: () => void }
  | {
      name: "streamingFile";
      reader: ReadableStreamDefaultReader<Uint8Array>;
      currentFile: StreamFileEntry;
      bytesSent: number;
    };

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
    return new ReadableStream(this.source);
  }

  private get source(): UnderlyingSource<Uint8Array> {
    console.log("starting tar file stream");
    return new TarSource(this.queue);
  }
}

class TarSource implements UnderlyingSource<Uint8Array> {
  private bytesSent = 0;
  private state: State = { name: "readyForNextFile" };
  constructor(private queue: FileEntry[]) {}
  start(_controller: ReadableStreamDefaultController<Uint8Array>) {
    // we don't need to do anything here, the docs don't make it clear if this
    // method is optional though
  }
  async pull(
    controller: ReadableStreamDefaultController<Uint8Array>
  ): Promise<void> {
    switch (this.state.name) {
      case "readyForNextFile":
        let file = this.queue.shift();
        if (!file) {
          // at the end we have to emit two empty records
          controller.enqueue(new Uint8Array(recordSize * 2));
          this.bytesSent += recordSize * 2;
          controller.close();
          console.log(`streamed ${this.bytesSent} bytes`);
          return;
        }
        console.log(`tar stream starting ${file.name}`);
        let buffer = new Uint8Array(recordSize);
        writeHeader(buffer, file);
        this.state = { name: "sentHeader", currentFile: file };
        this.bytesSent += buffer.length;
        controller.enqueue(buffer);
        return;
      case "sentHeader":
        if (this.state.currentFile.type === DIRTYPE) {
          // it's a directory, there's nothing else to send
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: 0,
          };
          return;
        }
        if ("data" in this.state.currentFile) {
          // it's a buffer, so we can finish it right now
          console.log(
            `tar stream writing ${this.state.currentFile.name} to buffer of size ${this.state.currentFile.data.length} bytes`
          );
          let buffer = this.state.currentFile.data;
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: paddingNeeded(buffer.length),
          };
          this.bytesSent += buffer.length;
          controller.enqueue(buffer);
          return;
        }
        if ("stream" in this.state.currentFile) {
          // start streaming the file
          console.log(
            `tar stream writing ${this.state.currentFile.name} to buffer of size ${this.state.currentFile.size} bytes`
          );
          this.state = {
            name: "streamingFile",
            reader: this.state.currentFile.stream.getReader(),
            currentFile: this.state.currentFile,
            bytesSent: 0,
          };
          return this.pull(controller);
        }
        throw new Error(`bug: should not get here`);
      case "streamingFile":
        let chunk = await this.state.reader.read();
        if (chunk.done) {
          if (this.state.bytesSent !== this.state.currentFile.size) {
            throw new Error(
              `file size mismatch: you said file is ` +
                `${this.state.currentFile.size} bytes, but streamed ${this.state.bytesSent} bytes`
            );
          }
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: paddingNeeded(this.state.bytesSent),
            close: this.state.currentFile.close,
          };
          return this.pull(controller);
        }
        this.state = {
          name: "streamingFile",
          reader: this.state.reader,
          currentFile: this.state.currentFile,
          bytesSent: this.state.bytesSent + chunk.value.length,
        };
        this.bytesSent += chunk.value.length;
        controller.enqueue(chunk.value);
        return;
      case "sentUnpaddedFile":
        if (typeof this.state.close === "function") {
          this.state.close();
        }
        if (this.state.paddingNeeded === 0) {
          this.state = { name: "readyForNextFile" };
          return this.pull(controller);
        }
        let padding = new Uint8Array(this.state.paddingNeeded);
        this.state = { name: "readyForNextFile" };
        this.bytesSent += padding.length;
        controller.enqueue(padding);
        return;
      default:
        throw assertNever(this.state);
    }
  }
}

function writeHeader(buffer: Uint8Array, file: FileEntry) {
  let currentOffset = 0;
  posixHeader.forEach(function (field) {
    let value = field[3](file, field);
    let length = value.length;
    for (let i = 0; i < length; i += 1) {
      buffer[currentOffset + i] = value.charCodeAt(i) & 0xff;
    }
    currentOffset += field[1]; // move to the next field
  });

  let field = posixHeader.find(function (field) {
    return field[0] == "checksum";
  });

  if (field) {
    // Patch checksum field
    let checksum = calculateChecksum(buffer);
    let value = formatTarNumber(checksum, field[1] - 2) + NULL_CHAR + " ";
    currentOffset = field[2];
    for (let i = 0; i < value.length; i += 1) {
      // put bytes
      buffer[currentOffset] = value.charCodeAt(i) & 0xff;
      currentOffset++;
    }
  }
}
