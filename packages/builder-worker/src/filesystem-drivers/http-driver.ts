import { FileSystem, FileSystemError } from "../filesystem";
import {
  FileSystemDriver,
  Volume,
  DirectoryDescriptor,
  FileDescriptor,
  assertURLEndsInDir,
  Stat,
  readStream,
} from "./filesystem-driver";
import moment from "moment";

const textEncoder = new TextEncoder();

interface Options {
  useHttpPostForUpdate: boolean;
}

export class HttpFileSystemDriver implements FileSystemDriver {
  constructor(private httpURL: URL, private opts: Partial<Options> = {}) {}

  async mountVolume(url: URL, dispatchEvent: FileSystem["dispatchEvent"]) {
    return new HttpVolume(
      this.httpURL,
      url,
      dispatchEvent,
      Object.assign(
        {
          useHttpPostForUpdate: false,
        },
        this.opts
      )
    );
  }
}

export class HttpVolume implements Volume {
  root: HttpFileDescriptor;
  readonly hasDirectoryAccess = false;
  readonly canCreateFiles = false;

  constructor(
    private httpURL: URL,
    mountURL: URL,
    private dispatchEvent: FileSystem["dispatchEvent"],
    readonly opts: Options
  ) {
    this.root = new HttpFileDescriptor(this, mountURL, httpURL, dispatchEvent);
  }

  async createDirectory(parent: DirectoryDescriptor, name: string) {
    let underlyingURL: URL;
    if (parent instanceof HttpDirectoryDescriptor) {
      underlyingURL = new URL(name, assertURLEndsInDir(parent.underlyingURL));
    } else {
      underlyingURL = new URL(name, assertURLEndsInDir(this.httpURL));
    }
    let url = new URL(name, assertURLEndsInDir(parent.url));
    return new HttpDirectoryDescriptor(
      this,
      url,
      underlyingURL,
      this.dispatchEvent
    );
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
    readonly underlyingURL: URL,
    private dispatchEvent: FileSystem["dispatchEvent"]
  ) {
    this.inode = underlyingURL.href;
  }

  close() {}

  async stat(): Promise<Stat> {
    throw new Error(`directory stat is not supported for HTTP Volumes`);
  }

  async get(name: string) {
    let underlyingURL = new URL(name, assertURLEndsInDir(this.underlyingURL));
    let url = new URL(name, assertURLEndsInDir(this.url));
    let response = await getOkResponse(underlyingURL);
    // it's incredibly unlikely that we'll ever get a directory mime type, but
    // such a thing actually exists, and handling it makes our types work out
    // nicely
    if (response.headers.get("Content-Type") === "text/directory") {
      return new HttpDirectoryDescriptor(
        this.volume,
        url,
        underlyingURL,
        this.dispatchEvent
      );
    } else {
      return new HttpFileDescriptor(
        this.volume,
        url,
        underlyingURL,
        this.dispatchEvent
      );
    }
  }

  async children(): Promise<string[]> {
    throw new Error(`directory listing is not supported for HTTP Volumes`);
  }

  async has(name: string) {
    try {
      this.get(name);
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
    await fetch(underlyingURL.href, {
      method: "DELETE",
    });
    let url = new URL(name, assertURLEndsInDir(this.url));
    this.dispatchEvent(url, "remove");
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

  constructor(
    readonly volume: HttpVolume,
    readonly url: URL,
    readonly underlyingURL: URL,
    private readonly dispatchEvent?: FileSystem["dispatchEvent"]
  ) {
    this.inode = underlyingURL.href;
  }

  close() {}

  async stat(): Promise<HttpStat> {
    let response = await getOkResponse(this.underlyingURL);
    let etag = response.headers.get("ETag") ?? undefined;
    let modified = response.headers.get("Last-Modified");
    let mtime = modified ? moment(modified).valueOf() : Date.now();
    // there is no guarantee that the webserver is populating this (e.g.
    // ember-cli), we could read this file to see its length, but that seems
    // wasteful.
    let sizeStr = response.headers.get("Content-Length");
    let size = sizeStr ? Number(sizeStr) : undefined;

    return {
      etag,
      mtime,
      size,
      contentType:
        response.headers.get("Content-Type") || "application/octet-stream",
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

    this.dispatchEvent!(this.url, "write"); // all descriptors created for files have this dispatcher
  }

  async read(): Promise<Uint8Array> {
    let response = await getOkResponse(this.underlyingURL);
    return new Uint8Array(await response.arrayBuffer());
  }

  async readText(): Promise<string> {
    let response = await getOkResponse(this.underlyingURL);
    return await response.text();
  }

  async getReadbleStream(): Promise<ReadableStream> {
    let response = await getOkResponse(this.underlyingURL);
    if (response.body == null) {
      throw new Error(
        `Cannot load underlying URL stream ${this.underlyingURL} for file ${this.url}, stream is null`
      );
    }
    return response.body;
  }
}

async function getOkResponse(url: URL): Promise<Response> {
  let response = await fetch(url.href);
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
