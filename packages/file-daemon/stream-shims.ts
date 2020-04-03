type Chunk =
  | { value: Uint8Array; done: false }
  | { value: undefined; done: true };

export class DenoStreamToDOM implements __domTypes.ReadableStream {
  private _locked = false;

  constructor(private denoReader: Deno.Reader) {}

  get locked() {
    return this._locked;
  }

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  getReader(): __domTypes.ReadableStreamReader {
    this._locked = true;
    return new DenoStreamToDOMReader(this.denoReader, () => {
      this._locked = false;
    });
  }

  tee(): [__domTypes.ReadableStream, __domTypes.ReadableStream] {
    throw new Error("unimplemented");
  }
}

class DenoStreamToDOMReader implements __domTypes.ReadableStreamReader {
  constructor(private denoReader: Deno.Reader, private unlock: () => void) {}

  async cancel(): Promise<void> {
    throw new Error(`unimplemented`);
  }

  async read(): Promise<Chunk> {
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

  releaseLock() {
    this.unlock();
  }
}

export class DOMToDenoStream implements Deno.Reader {
  private reader: __domTypes.ReadableStreamReader;
  private pendingBuffer: Uint8Array | undefined;

  constructor(stream: __domTypes.ReadableStream) {
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
