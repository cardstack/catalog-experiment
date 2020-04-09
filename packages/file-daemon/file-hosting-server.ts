import { join, resolve } from "path";
import http from "http";
import httpProxy from "http-proxy";
import { statSync } from "fs-extra";
import walkSync from "walk-sync";
import { createReadStream, existsSync } from "fs";
import { Readable } from "stream";
import { contentType, lookup } from "mime-types";
import { Tar } from "tarstream";
import { DIRTYPE } from "tarstream/constants";
import { NodeReadableToDOM, DOMToNodeReadable } from "./stream-shims";

const webpackDevServer = "http://localhost:8080";

export default class FileHostingServer {
  constructor(
    private port: number,
    private directory: string,
    private corsEnabled = true
  ) {}

  start() {
    let proxy = httpProxy.createProxyServer();

    console.log(`HTTP server listening on port: ${this.port}`);
    const server = http.createServer((req, res) => {
      let path = req.url!;
      console.log(
        `Handling URL: ${path}, with accept header: ${req.headers.accept}`
      );

      try {
        let filePath = resolve(join(this.directory, decodeURIComponent(path)));
        if (filePath.indexOf(this.directory) !== 0) {
          res.statusCode = 403;
          res.end();
          return;
        }

        if (this.corsEnabled) {
          res.setHeader("access-control-allow-origin", "*");
          res.setHeader(
            "access-control-allow-headers",
            "Origin, X-Requested-With, Content-Type, Accept, Range"
          );
        }
        if (
          req.headers.accept &&
          req.headers.accept.split(",").includes("application/x-tar")
        ) {
          res.setHeader("content-type", "application/x-tar");
          streamFileSystem(this.directory, filePath).pipe(res);
        } else {
          if (existsSync(filePath)) {
            let stat = statSync(filePath);
            if (stat.isDirectory()) {
              serveFile(res, join(filePath, "index.html"));
            } else {
              serveFile(res, filePath);
            }
          } else {
            proxy.web(req, res, { target: webpackDevServer });
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

function streamFileSystem(root: string, path: string): Readable {
  console.log(`streaming filesystem: ${path}`);

  let tar = new Tar();
  // walk sync ignores the current directory, so we add that first
  console.log(`Adding directory ${path} to tar`);
  tar.addFile({ name: "/", type: DIRTYPE });
  for (let entry of walkSync.entries(path)) {
    let { fullPath, size } = entry;
    let relativePath = fullPath.substring(root.length);
    if (entry.isDirectory()) {
      console.log(`Adding directory ${fullPath} to tar`);
      tar.addFile({ name: relativePath, type: DIRTYPE });
    } else {
      console.log(`Adding file ${fullPath} to tar`);
      tar.addFile({
        name: relativePath,
        stream: () => new NodeReadableToDOM(createReadStream(fullPath)),
        size,
      });
    }
  }
  return new DOMToNodeReadable(tar.finish());
}

function serveFile(res: http.ServerResponse, path: string) {
  let mime = lookup(path) || "application/octet-stream";
  res.setHeader("content-length", statSync(path).size);
  res.setHeader("content-type", contentType(mime) as Exclude<string, false>);
  createReadStream(path).pipe(res);
}

function serverLog(req: http.IncomingMessage, res: http.ServerResponse): void {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  console.log(`${dateFmt} "${req.method} ${req.url}" ${res.statusCode}`);
}
