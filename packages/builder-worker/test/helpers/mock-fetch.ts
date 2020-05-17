import * as sinon from "sinon";
import moment from "moment";

//@ts-ignore tests are running in the main thread (ugh)...
const win = window;
const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

interface MockResponse {
  status: number;
  body?: string | Uint8Array;
  headers?: { [header: string]: string };
}

type MockResponseFn = (url: string, request?: Request) => Promise<MockResponse>;

interface MockRequest {
  method: string;
  url: string | RegExp;
  response: MockResponse | MockResponseFn;
}

export function stubFetch(mockConfigs: MockRequest[]): sinon.SinonStub {
  let urls = mockConfigs.filter((i) => typeof i.url === "string");
  let patterns = mockConfigs.filter((i) => typeof i.url !== "string");
  return sinon
    .stub(win, "fetch")
    .callsFake(async (url: string, request?: Request) => {
      let method: string;
      if (request) {
        method = request.method;
      } else {
        method = "GET";
      }

      let response = urls.find((i) => i.method === method && i.url === url)
        ?.response;
      if (!response) {
        response = patterns.find(
          (i) => i.method === method && (i.url as RegExp).test(url)
        )?.response;
      }
      if (!response) {
        response = {
          status: 404,
          body: "Not Found",
        } as MockResponse;
      }

      if (typeof response === "function") {
        response = await response(url, request);
      }

      let buffer =
        typeof response.body === "string"
          ? textEncoder.encode(response.body)
          : response.body;
      let status = response.status;
      let responseHeaders = new Headers();
      responseHeaders.set("Content-Type", "application/octet-stream");
      responseHeaders.set(
        "Last-Modified",
        moment.utc().format("ddd, DD MMM YYYY HH:mm:ss GMT")
      );
      if (response.headers) {
        for (let [key, value] of Object.entries(response.headers)) {
          responseHeaders.set(key, value);
        }
      }
      responseHeaders.set(
        "Content-Length",
        buffer ? String(buffer.length) : "0"
      );

      return {
        status,
        url,
        ok: status >= 200 && status <= 299,
        headers: responseHeaders,
        body: buffer
          ? {
              getReader() {
                return new SimpleReader(buffer!);
              },
            }
          : null,
        text() {
          return buffer ? new Promise((res) => res(utf8.decode(buffer))) : null;
        },
        arrayBuffer() {
          return buffer ? new Promise((res) => res(buffer!.buffer)) : null;
        },
        blob() {
          return buffer
            ? new Promise((res) => res(new Blob([buffer!.buffer])))
            : null;
        },
      };
    });
}

class SimpleReader implements ReadableStreamDefaultReader<Uint8Array> {
  readonly closed: Promise<void>;
  private close!: () => void;
  private hasRead = false;
  constructor(private buffer: Uint8Array) {
    this.closed = new Promise((res) => (this.close = res));
  }

  async read(): Promise<ReadableStreamReadResult<Uint8Array>> {
    if (!this.hasRead) {
      this.hasRead = true;
      return { value: this.buffer.slice(0), done: false };
    } else {
      return { value: undefined, done: true };
    }
  }
  async cancel(): Promise<void> {
    return Promise.resolve();
  }
  releaseLock() {
    this.close();
  }
}
