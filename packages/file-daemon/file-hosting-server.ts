const { stat, open } = Deno;
import { posix } from "https://deno.land/std/path/mod.ts";
import { contentType, lookup } from "https://deno.land/std/media_types/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";
import {
  listenAndServe,
  ServerRequest,
  Response
} from "https://deno.land/std/http/mod.ts";

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
          console.log(`Handling URL: ${normalizedUrl}`);
          if (["/service-worker.js"].includes(normalizedUrl)) {
            let originRes = await fetch(
              `http://localhost:8080${normalizedUrl}`
            );
            response = originRes;
          } else {
            const info = await stat(fsPath);
            if (info.isDirectory()) {
              response = await serveFile(req, posix.join(fsPath, "index.html"));
            } else if (info.isFile()) {
              response = await serveFile(req, fsPath);
            }
          }
        } catch (e) {
          console.error(e.message);
          response = await serveFallback(req, e);
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

async function serveFile(
  req: ServerRequest,
  filePath: string
): Promise<Response> {
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
    headers
  };
  return res;
}

async function serveFallback(req: ServerRequest, e: Error): Promise<Response> {
  if (e instanceof Deno.errors.NotFound) {
    return Promise.resolve({
      status: 404,
      body: encoder.encode("Not found")
    });
  } else {
    return Promise.resolve({
      status: 500,
      body: encoder.encode("Internal server error")
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
