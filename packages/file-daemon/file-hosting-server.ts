import { join, resolve } from "path";
import http from "http";
import { parse as urlParse } from "url";
import httpProxy from "http-proxy";
import { statSync } from "fs-extra";
import walkSync from "walk-sync";
import { createReadStream, existsSync } from "fs";
import { Readable } from "stream";
import { contentType, lookup } from "mime-types";
import { Tar } from "tarstream";
import { DIRTYPE, REGTYPE } from "tarstream/constants";
import { NodeReadableToDOM, DOMToNodeReadable } from "./stream-shims";
import { DirectoryEntry } from "tarstream/types";
import { unixTime } from "./utils";
import { basename } from "path";

const builderServer = "http://localhost:8080";
export type RequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => boolean;

export default class FileHostingServer {
  private mapping: Map<string, string>;

  constructor(
    private port: number,
    directories: string[],
    private corsEnabled = true,
    private testHandler?: RequestHandler
  ) {
    this.mapping = new Map();
    // the first direcotry as assumed to be the one that will serve requests to "/"
    this.mapping.set("/", directories[0]);
    for (let dir of directories) {
      let localName = basename(dir);
      let counter = 0;
      while (this.mapping.has(localName)) {
        localName = `${localName}/${counter}`;
        counter++;
      }
      this.mapping.set(localName, dir);
    }
  }

  start() {
    let proxy = httpProxy.createProxyServer();

    console.log(`HTTP server listening on port: ${this.port}`);
    const server = http.createServer((req, res) => {
      let path = req.url === "//" ? "/" : req.url!;
      console.log(
        `Handling ${req.method} ${path}, with accept header: ${req.headers.accept}`
      );

      if (path === "/__alive__") {
        res.statusCode = 200;
        res.end();
        return;
      }

      try {
        let pathName = urlParse(path).pathname || "";
        let isRootTarRequest =
          pathName === "/" &&
          req.headers.accept &&
          req.headers.accept.split(",").includes("application/x-tar");
        let top = pathName.split("/")[1];
        let root = this.mapping.get(top);
        if (!isRootTarRequest && (!root || !top || pathName === "/")) {
          // try again, the request may have actually been for the default
          // directory (via a request relative to the root of the origin), e.g.:
          // http://localhost:4200/test
          top = "";
          root = this.mapping.get("/");
        }
        if (!root && !isRootTarRequest) {
          res.statusCode = 404;
          res.end();
          return;
        }
        let filePath = !isRootTarRequest
          ? resolve(join(root!, pathName.slice(top.length)))
          : undefined;
        if (filePath && filePath.indexOf(root!) !== 0) {
          res.statusCode = 403;
          res.end();
          return;
        }

        if (this.corsEnabled) {
          res.setHeader("access-control-allow-origin", "*");
          res.setHeader(
            "access-control-allow-methods",
            "GET, POST, OPTIONS, DELETE"
          );
          res.setHeader(
            "access-control-allow-headers",
            "Origin, X-Requested-With, Content-Type, Accept, Range"
          );
        }

        if (this.testHandler) {
          let handled = this.testHandler(req, res);
          if (handled) {
            return;
          }
        }

        if (
          isRootTarRequest ||
          (req.headers.accept &&
            req.headers.accept.split(",").includes("application/x-tar"))
        ) {
          res.setHeader("content-type", "application/x-tar");
          if (isRootTarRequest) {
            streamFileSystem([...this.mapping.values()]).pipe(res);
          } else if (filePath && existsSync(filePath)) {
            streamFileSystem(filePath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end();
          }
        } else {
          if (filePath && existsSync(filePath)) {
            let stat = statSync(filePath);
            if (stat.isDirectory()) {
              serveFile(res, join(filePath, "index.html"));
            } else {
              serveFile(res, filePath);
            }
          } else {
            proxy.web(req, res, { target: builderServer });
          }
        }
      } catch (e) {
        console.error(
          `Unexpected error serving ${path}: ${e.message} ${e.stack}`
        );
        res.statusCode = 500;
        res.end(e.message);
      } finally {
        serverLog(req, res);
      }
    });

    server.listen(this.port);
  }
}

function streamFileSystem(path: string): Readable;
function streamFileSystem(paths: string[]): Readable;
function streamFileSystem(pathOrPaths: string | string[]): Readable {
  let paths = typeof pathOrPaths === "string" ? [pathOrPaths] : pathOrPaths;
  console.log(`streaming filesystems: ${paths.join()}`);

  let tar = new Tar();
  // walk sync ignores the current directory, so we add that first
  tar.addFile({
    name: "/",
    type: DIRTYPE,
    mode: statSync(paths[0]).mode,
    modifyTime: unixTime(statSync(paths[0]).mtime.getTime()),
  });

  for (let path of paths) {
    let base = path.split("/").pop();
    for (let entry of walkSync.entries(path)) {
      let { fullPath, size, mtime, mode, relativePath } = entry;

      relativePath = `/${base}/${relativePath}`;
      let file = {
        mode,
        size,
        modifyTime: unixTime(mtime),
        type: entry.isDirectory() ? DIRTYPE : REGTYPE,
        name: entry.isDirectory() ? relativePath.slice(0, -1) : relativePath,
      };
      if (entry.isDirectory()) {
        tar.addFile(file as DirectoryEntry);
      } else {
        tar.addFile({
          ...file,
          stream: () => new NodeReadableToDOM(createReadStream(fullPath)),
        });
      }
    }
  }
  return new DOMToNodeReadable(tar.finish());
}

function serveFile(res: http.ServerResponse, path: string) {
  let mime = lookup(path) || "application/octet-stream";
  res.setHeader("content-length", statSync(path).size);
  res.setHeader("content-length", statSync(path).size);
  res.setHeader(
    "etag",
    `${statSync(path).size}_${unixTime(statSync(path).mtime.getTime())}`
  );
  res.setHeader("content-type", contentType(mime) as Exclude<string, false>);
  createReadStream(path).pipe(res);
}

function serverLog(req: http.IncomingMessage, res: http.ServerResponse): void {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  console.log(`${dateFmt} "${req.method} ${req.url}" ${res.statusCode}`);
}
