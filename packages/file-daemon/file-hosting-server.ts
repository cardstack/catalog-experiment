const { stat, open } = Deno;
import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { posix } from "https://deno.land/std/path/mod.ts";
import { contentType, lookup } from "https://deno.land/x/media_types/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";
import {
  listenAndServe,
  ServerRequest,
  Response,
} from "https://deno.land/std/http/mod.ts";
import { Tar } from "http://localhost:8081/tarstream.ts";
import { DenoStreamToDOM } from "http://localhost:8081/stream-shims.ts";

const encoder = new TextEncoder();

export default class FileHostingServer {
  addr: string;
  constructor(
    port: string | number,
    private directory: string,
    private corsEnabled = true
  ) {
    this.addr = `0.0.0.0:${port}`;
  }

  async start() {
    console.log(`HTTP server listening on http://${this.addr}/`);
    listenAndServe(
      String(this.addr),
      async (req: ServerRequest): Promise<void> => {
        let normalizedUrl = posix.normalize(req.url);
        try {
          normalizedUrl = decodeURIComponent(normalizedUrl);
        } catch (e) {
          if (!(e instanceof URIError)) {
            throw e;
          }
        }
        const fsPath = posix.join(this.directory, normalizedUrl);

        let response: Response | undefined;
        try {
          console.log(
            `Handling URL: ${normalizedUrl}, with accept header: ${req.headers.get(
              "accept"
            )}`
          );
          if (["/service-worker.js"].includes(normalizedUrl)) {
            let originRes = await fetch(
              `http://localhost:8080${normalizedUrl}`
            );
            response = originRes;
          } else {
            if (
              req.headers.has("accept") &&
              req.headers
                .get("accept")
                ?.split(",")
                .includes("application/x-tar")
            ) {
              response = await streamFileSystem(this.directory, fsPath);
            } else {
              const info = await stat(fsPath);
              if (info.isDirectory()) {
                response = await serveFile(posix.join(fsPath, "index.html"));
              } else if (info.isFile()) {
                response = await serveFile(fsPath);
              }
            }
          }
        } catch (e) {
          console.error(e.message);
          response = await serveFallback(e);
        } finally {
          try {
            if (this.corsEnabled) {
              assert(response);
              setCORS(response);
            }
            serverLog(req, response!);
            await req.respond(response!);
          } finally {
            // Note that there is an open issue in Deno around having to manually
            // close files like this: https://github.com/denoland/deno/issues/3982
            if (response && isCloser(response.body)) {
              response.body.close();
            }
          }
        }
      }
    );
  }
}

async function streamFileSystem(root: string, path: string): Promise<Response> {
  console.log(`streaming filesystem: ${path}`);

  const headers = new Headers();
  headers.set("content-type", "application/x-tar");

  // TODO need to walk the file system getting the file sizes and file readers
  // to pass into the tarstream. (TODO need to think thru when to close files
  // that we open for streaming into the tarstream).

  let tar = new Tar();
  for (let { filename, info } of walkSync(path)) {
    tar.addFile({
      name: filename.substring(root.length),
      stream: new DenoStreamToDOM(await open(path)),
      size: info.size,
    });
  }
  // then finalize the tar
  // figure out how we should close the files

  const res = {
    status: 200,
    headers,
  };
  return res;
}

async function serveFile(filePath: string): Promise<Response> {
  const [file, fileInfo] = await Promise.all([open(filePath), stat(filePath)]);
  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());
  headers.set(
    "content-type",
    contentType(lookup(filePath) ?? "application/octet-stream")!
  );

  const res = {
    status: 200,
    body: file,
    headers,
  };
  return res;
}

async function serveFallback(e: Error): Promise<Response> {
  if (e instanceof Deno.errors.NotFound) {
    return Promise.resolve({
      status: 404,
      body: encoder.encode("Not found"),
    });
  } else {
    return Promise.resolve({
      status: 500,
      body: encoder.encode("Internal server error"),
    });
  }
}

function setCORS(res: Response): void {
  if (!res.headers) {
    res.headers = new Headers();
  }
  res.headers.append("access-control-allow-origin", "*");
  res.headers.append(
    "access-control-allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Range"
  );
}

function serverLog(req: ServerRequest, res: Response): void {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  const s = `${dateFmt} "${req.method} ${req.url} ${req.proto}" ${res.status}`;
  console.log(s);
}

function isCloser(object: any): object is Deno.Closer {
  return "close" in object;
}
