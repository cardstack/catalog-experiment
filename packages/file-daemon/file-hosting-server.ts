import { join, resolve } from "path";
import http from "http";
import { parse as urlParse } from "url";
import { parse as qsParse } from "qs";
import httpProxy from "http-proxy";
import { statSync, ensureFileSync, outputFileSync, removeSync } from "fs-extra";
import walkSync from "walk-sync";
import { createReadStream, existsSync, createWriteStream, mkdirSync } from "fs";
import { Readable } from "stream";
import { contentType, lookup } from "mime-types";
import { Tar } from "tarstream";
import { DIRTYPE, REGTYPE } from "tarstream/constants";
import { NodeReadableToDOM, DOMToNodeReadable } from "./stream-shims";
import { DirectoryEntry } from "tarstream/types";
import { unixTime } from "./utils";

const builderServer = "http://localhost:8080";

export default class FileHostingServer {
  constructor(
    private port: number,
    private directory: string,
    private key?: string,
    private corsEnabled = true
  ) {}

  start() {
    let proxy = httpProxy.createProxyServer();

    console.log(`HTTP server listening on port: ${this.port}`);
    const server = http.createServer((req, res) => {
      let path = req.url!;
      console.log(
        `Handling ${req.method} ${path}, with accept header: ${req.headers.accept}`
      );

      if (path === "/__alive__") {
        res.statusCode = 200;
        res.end();
        return;
      }

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

        let query = qsParse(urlParse(path).query || "");
        if (req.method === "POST" && query.key === this.key) {
          if (query.scenario) {
            removeSync(this.directory);
            mkdirSync(this.directory);
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              let scenario = JSON.parse(body);
              for (let [path, contents] of Object.entries(scenario)) {
                outputFileSync(join(this.directory, path), contents);
              }
              res.statusCode = 200;
              res.end("ok");
            });
          } else if (query.reset) {
            removeSync(this.directory);
            mkdirSync(this.directory);
            res.statusCode = 200;
            res.end();
          } else {
            ensureFileSync(filePath);
            req.pipe(createWriteStream(filePath));
            res.statusCode = 200;
            res.end();
          }
          return;
        }

        if (
          req.headers.accept &&
          req.headers.accept.split(",").includes("application/x-tar")
        ) {
          res.setHeader("content-type", "application/x-tar");
          if (existsSync(filePath)) {
            streamFileSystem(filePath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end();
          }
        } else {
          if (existsSync(filePath)) {
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

function streamFileSystem(path: string): Readable {
  console.log(`streaming filesystem: ${path}`);

  let tar = new Tar();
  // walk sync ignores the current directory, so we add that first
  tar.addFile({
    name: "/",
    type: DIRTYPE,
    mode: statSync(path).mode,
    modifyTime: unixTime(statSync(path).mtime.getTime()),
  });

  for (let entry of walkSync.entries(path)) {
    let { fullPath, size, mtime, mode, relativePath } = entry;
    relativePath = `/${relativePath}`;
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
