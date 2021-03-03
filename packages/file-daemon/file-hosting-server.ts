import walkSync from "walk-sync";
import {
  createReadStream,
  ensureDirSync,
  createWriteStream,
  removeSync,
} from "fs-extra";
import { Readable } from "stream";
import { Tar } from "@catalogjs/tarstream";
import { DIRTYPE, REGTYPE } from "@catalogjs/tarstream/constants";
import { NodeReadableToDOM, DOMToNodeReadable } from "./stream-shims";
import { DirectoryEntry } from "@catalogjs/tarstream/types";
import { unixTime } from "./utils";
import { join, resolve, dirname, extname } from "path";
import * as webStreams from "web-streams-polyfill/ponyfill/es2018";
import send from "koa-send";
import route, { KoaRoute } from "koa-better-route";
import compose from "koa-compose";
import proxy from "koa-proxies";
import flatMap from "lodash/flatMap";
import { Project } from "./daemon";

const catalogjsDist = resolve(join(__dirname, ".."));
const builderDist = join(catalogjsDist, "builder");
const uiDist = join(catalogjsDist, "ui");

// polyfill
global = Object.assign(global, webStreams);

export function serveFiles(
  projects: Project[],
  ignore: string[] = [],
  builderServer?: string,
  uiServer?: string
) {
  return compose([
    ...flatMap(projects, (project) => {
      let { localName, dir } = project;
      return [
        route.get(
          `/catalogjs/files/${localName}/(.*)`,
          async (ctxt: KoaRoute.Context) => {
            let source = project.loadFile(ctxt.routeParams[0]);
            if (typeof source === "string") {
              ctxt.set("Content-Length", String(source.length));
              ctxt.body = source;
              ctxt.type = extname(ctxt.routeParams[0]);
            } else if ("status" in source) {
              if (source.message) {
                ctxt.response.body = source.message;
              }
              ctxt.response.status = source.status;
            } else {
              await send(ctxt, source.streamFile, { root: dir });
            }
          }
        ),
        route.post(`/catalogjs/files/${localName}/(.*)`, updateFiles(dir)),
        route.delete(`/catalogjs/files/${localName}/(.*)`, removeFiles(dir)),
      ];
    }),
    route.get(`/catalogjs/files`, (ctxt: KoaRoute.Context) => {
      ctxt.res.setHeader("content-type", "application/x-tar");
      ctxt.body = streamFileSystem(projects, ignore);
    }),

    !builderServer
      ? route.get("/catalogjs/builder/(.*)", (ctxt: KoaRoute.Context) => {
          return send(ctxt, ctxt.routeParams[0], { root: builderDist });
        })
      : proxy("/catalogjs/builder", {
          target: builderServer,
          rewrite(path: string) {
            return path.slice("/catalogjs/builder".length);
          },
        }),
    !builderServer
      ? route.get("/main.js", (ctxt: KoaRoute.Context) => {
          return send(ctxt, "main.js", { root: builderDist });
        })
      : proxy("/main.js", {
          target: builderServer,
        }),
    !builderServer
      ? route.get("/service-worker.js", (ctxt: KoaRoute.Context) => {
          return send(ctxt, "service-worker.js", { root: builderDist });
        })
      : proxy("/service-worker.js", {
          target: builderServer,
        }),

    !uiServer
      ? route.get("/catalogjs/ui/(.*)", (ctxt: KoaRoute.Context) => {
          let segment = ctxt.routeParams[0] ?? "index.html";
          return send(ctxt, segment, { root: uiDist });
        })
      : // UI is being served from /catalogjs/ui/ from ember-cli, this proxy handles
        // the asset references from the ember app's index.html. We serve the ember
        // app in ember-cli in a root path that matches how the UI is mounted in the
        // filesystem abstraction so that the asset references in index.html line up
        // with path that they can be found in the filesystem abstraction. otherwise
        // index.html will have references to UI assets that don't exist in the file
        // system (e.g.: http://localhost:4200/assets/vendor.js vs
        // http://localhost:4200/catalogjs/ui/assets/vendor.js)
        proxy("/catalogjs/ui", {
          target: uiServer,
          rewrite(path: string) {
            return path.slice("/catalogjs/ui".length);
          },
        }),
    // this proxy handles the request for the UI's /index.html and any other
    // fall-through conditions
    !uiServer
      ? route.get("/(.*)", (ctxt: KoaRoute.Context) => {
          let segment = ctxt.routeParams[0] ?? "index.html";
          return send(ctxt, segment, { root: uiDist });
        })
      : proxy("/", {
          target: uiServer,
        }),
  ]);
}

function streamFileSystem(projects: Project[], ignore: string[]): Readable {
  let tar = new Tar();
  for (let project of projects) {
    let { localName, dir } = project;
    for (let entry of walkSync.entries(dir, {
      ignore,
    })) {
      let { size, mtime, mode, relativePath } = entry;

      let file = {
        mode,
        size,
        modifyTime: unixTime(mtime),
        type: entry.isDirectory() ? DIRTYPE : REGTYPE,
      };
      if (entry.isDirectory()) {
        let name = `${localName}/${relativePath}`.slice(0, -1);
        tar.addFile({ ...file, name } as DirectoryEntry);
      } else {
        for (let source of project.outputFiles(relativePath)) {
          let loaded = source.load();
          if (typeof loaded === "string") {
            tar.addFile({
              ...file,
              name: `${localName}/${source.outputRelativePath}`,
              data: Buffer.from(loaded, "utf8"),
            });
          } else if ("status" in loaded) {
            throw new Error(
              `${localName} ${relativePath}->${source.outputRelativePath} generated error ${loaded.status} ${loaded.message}`
            );
          } else {
            let streamFile = resolve(project.dir, loaded.streamFile);
            tar.addFile({
              ...file,
              name: `${localName}/${source.outputRelativePath}`,
              stream: () => new NodeReadableToDOM(createReadStream(streamFile)),
            });
          }
        }
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

function removeFiles(dir: string) {
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
    removeSync(fullPath);
    ctxt.response.status = 200;
  };
}
