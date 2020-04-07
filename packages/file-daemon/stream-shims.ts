// @deno-types="./vendor/web-streams/index.d.ts"
import {
  ReadableStream,
  ReadableStreamBYOBReader,
  ReadableStreamDefaultReader,
  ReadableStreamAsyncIterator,
  ReadResult,
} from "./vendor/web-streams";

// deno-types are described here: https://github.com/denoland/deno/blob/92f1c71a6fde3701224f213f48e14776f9f8adee/std/manual.md#compiler-hint
// Hmmmm, deno doesn't seem to like the IFFE that web-stream utilizes for the
// ponyfill.

export class DenoStreamToDOM implements ReadableStream {
  private _locked = false;

  constructor(private denoReader: Deno.Reader) {}

  get locked() {
    return this._locked;
  }

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  getReader({ mode }: { mode: "byob" }): ReadableStreamBYOBReader;
  getReader(): ReadableStreamDefaultReader<Uint8Array>;
  getReader(
    _opts?: any
  ): ReadableStreamDefaultReader<Uint8Array> | ReadableStreamBYOBReader {
    this._locked = true;
    return new DenoStreamToDOMReader(this.denoReader, () => {
      this._locked = false;
    });
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

class DenoStreamToDOMReader implements ReadableStreamDefaultReader<Uint8Array> {
  constructor(private denoReader: Deno.Reader, private unlock: () => void) {}

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  async read(): Promise<ReadResult<Uint8Array>> {
    const bufferSize = 4096;
    let buffer = new Uint8Array(bufferSize);
    let result = await this.denoReader.read(buffer);
    if (typeof result === "number") {
      if (result === bufferSize) {
        return { value: buffer, done: false };
      } else {
        return { value: buffer.subarray(0, result), done: false };
      }
    } else {
      return { value: undefined, done: true };
    }
  }

  get closed(): Promise<void> {
    throw new Error("unimplemented");
  }

  releaseLock() {
    this.unlock();
  }
}

export class DOMToDenoStream implements Deno.Reader {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private pendingBuffer: Uint8Array | undefined;

  constructor(stream: ReadableStream) {
    this.reader = stream.getReader();
  }
  async read(outputBuffer: Uint8Array): Promise<number | typeof Deno.EOF> {
    let sourceBuffer: Uint8Array;
    if (this.pendingBuffer) {
      sourceBuffer = this.pendingBuffer;
      this.pendingBuffer = undefined;
    } else {
      let chunk = await this.reader.read();
      if (chunk.done) {
        return Deno.EOF;
      }
      sourceBuffer = chunk.value;
    }

    if (sourceBuffer.length <= outputBuffer.length) {
      outputBuffer.set(sourceBuffer, 0);
      return sourceBuffer.length;
    } else {
      outputBuffer.set(sourceBuffer.subarray(0, outputBuffer.length), 0);
      this.pendingBuffer = sourceBuffer.subarray(outputBuffer.length);
      return outputBuffer.length;
    }
  }
}
