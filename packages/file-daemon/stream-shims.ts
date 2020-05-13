import { Memoize } from "typescript-memoize";
import { Readable } from "stream";
import { ReadStream } from "fs";
import {
  ReadableStreamAsyncIterator,
  ReadResult,
} from "web-streams-polyfill/ponyfill/es2018";

export class NodeReadableToDOM implements ReadableStream {
  private _locked = false;

  constructor(
    private readable: Readable | ReadStream,
    private autoClose = true
  ) {}

  get locked() {
    return this._locked;
  }

  async cancel(): Promise<void> {
    let reader = this.getReader();
    await reader.cancel();
  }

  getReader({ mode }: { mode: "byob" }): ReadableStreamBYOBReader;
  getReader(): ReadableStreamDefaultReader<Uint8Array>;
  @Memoize()
  getReader(
    _opts?: any
  ): ReadableStreamDefaultReader<Uint8Array> | ReadableStreamBYOBReader {
    this._locked = true;
    return new NodeReadableToDOMReader(
      this.readable,
      () => {
        this._locked = false;
      },
      this.autoClose
    );
  }

  tee(): [ReadableStream, ReadableStream] {
    throw new Error("unimplemented");
  }

  pipeThrough(): ReadableStream {
    throw new Error("unimplemented");
  }

  pipeTo(): Promise<void> {
    throw new Error("unimplemented");
  }

  getIterator(): ReadableStreamAsyncIterator<Uint8Array> {
    throw new Error("unimplemented");
  }

  async *[Symbol.asyncIterator]() {
    throw new Error("unimplemented");
  }
}

class NodeReadableToDOMReader
  implements ReadableStreamDefaultReader<Uint8Array> {
  private isFinished = false;
  private finishedPromise: Promise<void>;
  private errorPromise: Promise<void>;
  private readyToRead?: () => void;
  private doneReading!: () => void;
  private interruptReading!: (error: Error) => void;
  // I'm racing the finished and error promises instead of creating a closed
  // promise from the "close" event so that there is no ambiguity between the
  // "close" event and the "end" event.
  private errorReceived!: () => void;

  constructor(
    private readable: Readable | ReadStream,
    private unlock: () => void,
    private autoClose: boolean
  ) {
    this.finishedPromise = new Promise((res, rej) => {
      this.doneReading = res;
      this.interruptReading = rej;
    });
    this.errorPromise = new Promise((res) => (this.errorReceived = res));
    this.readable.on("error", (error: Error) => {
      try {
        this.errorReceived();
        this.interruptReading(error);
      } finally {
        if ("close" in this.readable && this.autoClose) {
          this.readable.close();
        }
      }
    });
    this.readable.on("end", () => {
      try {
        this.isFinished = true;
        this.doneReading();
      } finally {
        if ("close" in this.readable && this.autoClose) {
          this.readable.close();
        }
      }
    });
    this.readable.on("readable", () => {
      if (this.readyToRead) {
        this.readyToRead();
      }
    });
  }

  async cancel(): Promise<void> {
    this.readable.destroy(new Error("client interrupted stream"));
  }

  async read(): Promise<ReadResult<Uint8Array>> {
    let chunk = await this.readBytes();
    if (chunk) {
      return { value: chunk, done: false };
    } else {
      return { value: undefined, done: true };
    }
  }

  private async readBytes(): Promise<Buffer | null> {
    let waitForReadable = new Promise((res) => (this.readyToRead = res));
    let buf = this.readable.read();
    if (buf) {
      return buf;
    } else {
      await Promise.race([waitForReadable, this.finishedPromise]);
      if (this.isFinished) {
        return null;
      } else {
        return this.readBytes();
      }
    }
  }

  @Memoize()
  get closed(): Promise<void> {
    return Promise.race([this.finishedPromise, this.errorPromise]);
  }

  releaseLock() {
    this.unlock();
  }
}

export class DOMToNodeReadable extends Readable {
  private reader: ReadableStreamDefaultReader<Uint8Array>;

  constructor(stream: ReadableStream, options = {}) {
    super(options);
    this.reader = stream.getReader();
  }

  _read() {
    this.reader
      .read()
      .then((chunk) => {
        if (chunk.done) {
          this.push(null);
        } else {
          this.push(chunk.value);
        }
      })
      .catch((err) => this.destroy(err));
  }
}
