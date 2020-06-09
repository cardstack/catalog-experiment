import { dispatchEvent } from "../event-bus";
import {
  FileSystem,
  eventCategory as category,
  eventGroup,
  FileSystemError,
  Event as FSEvent,
} from "../filesystem";
import {
  FileSystemDriver,
  Volume,
  DirectoryDescriptor,
  FileDescriptor,
  Stat,
  readStream,
} from "./filesystem-driver";
import { assertURLEndsInDir } from "../path";
import moment from "moment";

const textEncoder = new TextEncoder();
const utf8 = new TextDecoder("utf8");

interface Options {
  useHttpPostForUpdate: boolean;
}

export class HttpFileSystemDriver implements FileSystemDriver {
  constructor(private httpURL: URL, private opts: Partial<Options> = {}) {}

  async mountVolume(_fs: FileSystem, id: string, url: URL) {
    return new HttpVolume(
      id,
      this.httpURL,
      url,
      Object.assign(
        {
          useHttpPostForUpdate: false,
        },
        this.opts
      )
    );
  }
}

interface CacheEntry {
  headers: Headers;
  buffer: Uint8Array;
}
type HttpResponseCache = Map<string, Promise<CacheEntry>>;

export class HttpVolume implements Volume {
  root: HttpFileDescriptor;
  httpResponseCache: HttpResponseCache = new Map();

  constructor(
    readonly id: string,
    private httpURL: URL,
    private mountURL: URL,
    readonly opts: Options
  ) {
    this.root = new HttpFileDescriptor(this, mountURL, httpURL);
  }

  async createDirectory(parent: DirectoryDescriptor, name: string) {
    let underlyingURL: URL;
    let url: URL;
    if (!name || !(parent instanceof HttpDirectoryDescriptor)) {
      underlyingURL = new URL(name, assertURLEndsInDir(this.httpURL));
      url = new URL(name, assertURLEndsInDir(this.mountURL));
    } else {
      underlyingURL = new URL(name, assertURLEndsInDir(parent.underlyingURL));
      url = new URL(name, assertURLEndsInDir(parent.url));
    }
    return new HttpDirectoryDescriptor(this, url, underlyingURL);
  }

  async createFile(
    parent: HttpDirectoryDescriptor,
    name: string
  ): Promise<HttpFileDescriptor> {
    let underlyingURL = new URL(name, assertURLEndsInDir(parent.underlyingURL));
    // this is awkward as we'll not have any data to POST until write() is
    // called... and really this is in the realm of the webserver policy around
    // how it wants to create resources...
    throw new Error(
      `Unimplemented: HTTP volumes currently cant create files. cannot create ${underlyingURL}`
    );
  }
}

export class HttpDirectoryDescriptor implements DirectoryDescriptor {
  readonly type = "directory";
  readonly inode: string;

  constructor(
    readonly volume: HttpVolume,
    readonly url: URL,
    readonly underlyingURL: URL
  ) {
    this.inode = underlyingURL.href;
  }

  close() {}

  async stat(): Promise<Stat> {
    throw new Error(`directory stat is not supported for HTTP Volumes`);
  }

  async getDirectory(name: string) {
    let underlyingURL = new URL(name, assertURLEndsInDir(this.underlyingURL));
    let url = new URL(name, assertURLEndsInDir(this.url));
    return new HttpDirectoryDescriptor(this.volume, url, underlyingURL);
  }

  async getFile(name: string) {
    let underlyingURL = new URL(name, assertURLEndsInDir(this.underlyingURL));
    let url = new URL(name, assertURLEndsInDir(this.url));
    // we're doing this for the side effect of a 404 being thrown if the
    // URL does not exist.
    await getIfNoneMatch(underlyingURL, undefined);
    return new HttpFileDescriptor(this.volume, url, underlyingURL);
  }

  async children(): Promise<string[]> {
    throw new Error(`directory listing is not supported for HTTP Volumes`);
  }

  async hasDirectory() {
    return true;
  }

  async hasFile(name: string) {
    try {
      await this.getFile(name);
      return true;
    } catch (err) {
      if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
        return false;
      }
      throw err;
    }
  }

  async remove(name: string) {
    let underlyingURL = new URL(name, assertURLEndsInDir(this.underlyingURL));
    throw new Error(
      `Unimplemented: HTTP volumes currently cant remove files. cannot remove ${underlyingURL}`
    );
  }

  async add(name: string, descriptor: HttpFileDescriptor): Promise<void>;
  async add(name: string, descriptor: HttpDirectoryDescriptor): Promise<void>;
  async add(
    _name: string,
    descriptor: HttpFileDescriptor | HttpDirectoryDescriptor
  ): Promise<void> {
    if (descriptor.type === "directory") {
      throw new Error(`The HTTP Volume does not support moving directories`);
    }
  }
}

export class HttpFileDescriptor implements FileDescriptor {
  readonly type = "file";
  readonly inode: string;
  private lastEtag: string | undefined;

  constructor(
    readonly volume: HttpVolume,
    readonly url: URL,
    readonly underlyingURL: URL
  ) {
    this.inode = underlyingURL.href;
  }

  close() {}

  async stat(): Promise<HttpStat> {
    let response = await this.getIfNoneMatch();
    let headers: Headers;
    if (response.status === 304) {
      // the only reason we would get a 304 is if this.lastEtag existed and
      // corresponded to a cached response
      headers = (await this.volume.httpResponseCache.get(this.lastEtag!))!
        .headers;
    } else {
      headers = response.headers;
    }
    let etag = headers.get("ETag") ?? undefined;
    let modified = headers.get("Last-Modified");
    let mtime = modified ? moment(modified).valueOf() : Date.now();
    // there is no guarantee that the webserver is populating this (e.g.
    // ember-cli), we could read this file to see its length, but that seems
    // wasteful.
    let sizeStr = headers.get("Content-Length");
    let size = sizeStr ? Number(sizeStr) : undefined;

    return {
      etag,
      mtime,
      size,
      contentType: headers.get("Content-Type") || "application/octet-stream",
      type: "file",
    };
  }

  async write(buffer: Uint8Array): Promise<void>;
  async write(stream: ReadableStream): Promise<void>;
  async write(text: string): Promise<void>;
  async write(streamOrBuffer: ReadableStream | Uint8Array | string) {
    let body: Uint8Array;
    if (streamOrBuffer instanceof Uint8Array) {
      body = streamOrBuffer;
    } else if (typeof streamOrBuffer === "string") {
      body = textEncoder.encode(streamOrBuffer);
    } else {
      body = await readStream(streamOrBuffer);
    }

    let method = this.volume.opts.useHttpPostForUpdate ? "POST" : "PUT";
    let res = await fetch(this.underlyingURL.href, { method, body });

    if (!res.ok) {
      throw new Error(
        `Could not HTTP ${method} to ${this.underlyingURL}. Received error: ${
          res.status
        }: ${await res.text()}`
      );
    }

    dispatchEvent<FSEvent>(eventGroup, {
      category,
      href: this.url.href,
      type: "write",
    });
  }

  async read(): Promise<Uint8Array> {
    let response = await this.getIfNoneMatch();
    return await getResponseBuffer(
      response,
      this.volume.httpResponseCache,
      this.lastEtag
    );
  }

  async readText(): Promise<string> {
    let response = await this.getIfNoneMatch();
    let buffer = await getResponseBuffer(
      response,
      this.volume.httpResponseCache,
      this.lastEtag
    );
    return utf8.decode(buffer);
  }

  async getReadbleStream(): Promise<ReadableStream> {
    let response = await this.getIfNoneMatch();
    let stream = await getResponseReadableStream(
      response,
      this.volume.httpResponseCache,
      this.lastEtag
    );
    if (stream == null) {
      throw new Error(
        `Cannot load underlying URL stream ${this.underlyingURL} for file ${this.url}, stream is null`
      );
    }
    return stream;
  }

  private async getIfNoneMatch(): Promise<Response> {
    let response = await getIfNoneMatch(this.underlyingURL, this.lastEtag);
    let etag = response.headers.get("ETag");
    if (etag) {
      this.lastEtag = etag;
    }
    // consume the body so we have it handy in our cache for later
    if (etag && response.status !== 304) {
      await getResponseBuffer(response, this.volume.httpResponseCache, etag);
    }
    return response;
  }
}

async function getIfNoneMatch(
  url: URL,
  etag: string | undefined
): Promise<Response> {
  let response = etag
    ? await fetch(url.href, {
        method: "GET",
        headers: { "If-None-Match": etag },
      })
    : await fetch(url.href);
  if (!response.ok) {
    if (response.status === 404) {
      throw new FileSystemError(
        "NOT_FOUND",
        `Cannot load underlying URL ${url}: ${
          response.status
        } ${await response.text()}`
      );
    } else {
      throw new Error(
        `Cannot load underlying URL ${url}: ${
          response.status
        } ${await response.text()}`
      );
    }
  }
  return response;
}

export interface HttpStat extends Stat {
  contentType: string;
}

async function getResponseBuffer(
  response: Response,
  cache: HttpResponseCache,
  etag: string | undefined
): Promise<Uint8Array> {
  let cacheKey: string | undefined;
  if (etag) {
    cacheKey = `${response.url}_${etag}`;
    if (cache.has(cacheKey)) {
      return (await cache.get(cacheKey)!).buffer;
    }
  }
  let cacheEntryPromise = new Promise<CacheEntry>(async (res) => {
    res({
      headers: response.headers,
      buffer: new Uint8Array(await response.arrayBuffer()),
    });
  });
  if (cacheKey) {
    cache.set(cacheKey, cacheEntryPromise);
  }
  return (await cacheEntryPromise).buffer;
}

async function getResponseReadableStream(
  response: Response,
  cache: HttpResponseCache,
  etag: string | undefined
): Promise<ReadableStream<Uint8Array> | null> {
  let cacheKey: string | undefined;
  if (etag) {
    cacheKey = `${response.url}_${etag}`;
    if (cache.has(cacheKey)) {
      let buffer = (await cache.get(cacheKey)!).buffer;
      return new ReadableStream({
        start(controller) {
          controller.enqueue(buffer);
          controller.close();
        },
      });
    }
  }

  if (cacheKey) {
    let reader = response.body?.getReader();
    if (!reader) {
      return null;
    }

    let stream: ReadableStream<Uint8Array>;
    let cacheEntryPromise = new Promise<CacheEntry>((res) => {
      // listen to the stream in response.body and cache the buffer when the stream ends
      let buffers: Uint8Array[] = [];
      stream = new ReadableStream({
        start(controller) {
          function push() {
            reader!.read().then(({ done, value }) => {
              if (done) {
                let size = buffers.reduce((a, b) => a + b.length, 0);
                let result = new Uint8Array(size);
                let offset = 0;
                for (let buffer of buffers) {
                  result.set(buffer, offset);
                  offset += buffer.length;
                }
                res({ buffer: result, headers: response.headers });
                controller.close();
                return;
              } else if (value) {
                controller.enqueue(value);
                buffers.push(value);
              }
              push();
            });
          }

          push();
        },
      });
    });
    cache.set(cacheKey, cacheEntryPromise);
    return stream!;
  }
  return response.body;
}
