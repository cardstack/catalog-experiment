// @deno-types="./vendor/web-streams/index.d.ts"
import * as webstreams from "http://localhost:8081/vendor/web-streams/index.js";

// deno-types are described here: https://github.com/denoland/deno/blob/92f1c71a6fde3701224f213f48e14776f9f8adee/std/manual.md#compiler-hint
// Hmmmm, deno doesn't seem to like the IFFE that web-stream utilizes for the
// ponyfill.

export class DenoStreamToDOM implements webstreams.ReadableStream {
  private _locked = false;

  constructor(private denoReader: Deno.Reader) {}

  get locked() {
    return this._locked;
  }

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  getReader({ mode }: { mode: "byob" }): webstreams.ReadableStreamBYOBReader;
  getReader(): webstreams.ReadableStreamDefaultReader<Uint8Array>;
  getReader(
    _opts?: any
  ):
    | webstreams.ReadableStreamDefaultReader<Uint8Array>
    | webstreams.ReadableStreamBYOBReader {
    this._locked = true;
    return new DenoStreamToDOMReader(this.denoReader, () => {
      this._locked = false;
    });
  }

  tee(): [webstreams.ReadableStream, webstreams.ReadableStream] {
    throw new Error("unimplemented");
  }

  pipeThrough(): webstreams.ReadableStream {
    throw new Error("unimplemented");
  }

  pipeTo(): Promise<void> {
    throw new Error("unimplemented");
  }

  getIterator(): webstreams.ReadableStreamAsyncIterator<Uint8Array> {
    throw new Error("unimplemented");
  }

  async *[Symbol.asyncIterator]() {
    throw new Error("unimplemented");
  }
}

class DenoStreamToDOMReader
  implements webstreams.ReadableStreamDefaultReader<Uint8Array> {
  constructor(private denoReader: Deno.Reader, private unlock: () => void) {}

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  async read(): Promise<webstreams.ReadResult<Uint8Array>> {
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
  private reader: webstreams.ReadableStreamDefaultReader<Uint8Array>;
  private pendingBuffer: Uint8Array | undefined;

  constructor(stream: webstreams.ReadableStream) {
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
