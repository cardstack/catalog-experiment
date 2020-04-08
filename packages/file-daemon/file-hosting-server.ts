const { stat, open } = Deno;
import { walkSync } from "deno/std/fs/mod";
import { posix } from "deno/std/path/mod";
import { contentType, lookup } from "mime-types";
import { assert } from "deno/std/testing/asserts";
import { listenAndServe, ServerRequest, Response } from "deno/std/http/mod";
import { Tar } from "tarstream";
import { DenoStreamToDOM, DOMToDenoStream } from "./stream-shims";
import { DIRTYPE } from "tarstream/constants";

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
    await listenAndServe(
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

  let tar = new Tar();
  for (let { filename, info } of walkSync(path)) {
    if (info.isDirectory()) {
      console.log(`Adding directory ${filename} to tar`);
      tar.addFile({
        name: filename.substring(root.length),
        type: DIRTYPE,
      });
    } else {
      // we should not open the file until we are ready to start streaming it
      let file = await open(filename);
      console.log(`Adding file ${filename} to tar`);
      tar.addFile({
        name: filename.substring(root.length),
        stream: new DenoStreamToDOM(file), // instead of passing in a stream pass in a closure that will open the steam when it needs to be read
        // move open and closing into the DenoStreamToDOM
        size: info.size,
        close: () => file.close(),
      });
    }
  }

  return {
    status: 200,
    // TODO let's not wait until we call finish to start streaming, start
    // streaming when add file is called. this means that when we get to teh end
    // of the queue, we need to keep waitting in case a new file is added--needs
    // a new state in our state machine
    body: new DOMToDenoStream(tar.finish()),
    headers,
  };
}

async function serveFile(filePath: string): Promise<Response> {
  const [file, fileInfo] = await Promise.all([open(filePath), stat(filePath)]);
  const headers = new Headers();
  let mime = lookup(filePath) || "application/octet-stream";
  headers.set("content-length", fileInfo.size.toString());
  headers.set("content-type", contentType(mime) as Exclude<string, false>);

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
