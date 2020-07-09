import walkSync from "walk-sync";
import {
  createReadStream,
  outputFileSync,
  ensureDirSync,
  createWriteStream,
} from "fs-extra";
import { Readable } from "stream";
import { Tar } from "tarstream";
import { DIRTYPE, REGTYPE } from "tarstream/constants";
import { NodeReadableToDOM, DOMToNodeReadable } from "./stream-shims";
import { DirectoryEntry } from "tarstream/types";
import { unixTime } from "./utils";
import { basename, join, resolve, dirname } from "path";
import * as webStreams from "web-streams-polyfill/ponyfill/es2018";
import send from "koa-send";
import route, { KoaRoute } from "koa-better-route";
import compose from "koa-compose";
import proxy from "koa-proxies";
import flatMap from "lodash/flatMap";

// polyfill
global = Object.assign(global, webStreams);

const builderServer = "http://localhost:8080";

export function serveFiles(directories: string[]) {
  let mapping = new Map();
  return compose([
    ...flatMap(directories, (dir) => {
      let localName = basename(dir);
      let counter = 0;
      while (mapping.has(localName)) {
        localName = `${localName}/${counter}`;
        counter++;
      }
      mapping.set(localName, dir);
      return [
        route.get(
          `/catalogjs/files/${localName}/(.*)`,
          (ctxt: KoaRoute.Context) => {
            return send(ctxt, ctxt.routeParams[0], { root: dir });
          }
        ),
        route.post(`/catalogjs/files/${localName}/(.*)`, updateFiles(dir)),
      ];
    }),
    route.get(`/catalogjs/files`, (ctxt: KoaRoute.Context) => {
      ctxt.res.setHeader("content-type", "application/x-tar");
      ctxt.body = streamFileSystem(mapping);
    }),
    proxy("/catalogjs/builder", {
      target: builderServer,
      rewrite(path: string) {
        return path.slice("/catalogjs/builder".length);
      },
    }),
  ]);
}

function streamFileSystem(mapping: Map<string, string>): Readable {
  let tar = new Tar();
  for (let [localName, dir] of mapping) {
    for (let entry of walkSync.entries(dir)) {
      let { fullPath, size, mtime, mode, relativePath } = entry;

      relativePath = `${localName}/${relativePath}`;
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

function updateFiles(dir: string) {
  if (!dir.endsWith("/")) {
    // this ensures our startsWith test will do a true path prefix match, which
    // is a security condition.
    dir += "/";
  }
  return async function (ctxt: KoaRoute.Context) {
    let localPath = ctxt.routeParams[0];
    let fullPath = resolve(join(dir, localPath));
    if (!fullPath.startsWith(dir)) {
      ctxt.response.status = 403;
      ctxt.response.body = "Forbidden";
      return;
    }
    ensureDirSync(dirname(fullPath));
    let stream = createWriteStream(fullPath);
    ctxt.req.pipe(stream);
    await new Promise((resolve, reject) => {
      stream.on("close", resolve);
      stream.on("error", reject);
    });
    ctxt.response.status = 200;
  };
}
