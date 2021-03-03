import FileWatcherServer from "./file-watcher-server";
import { serveFiles } from "./file-hosting-server";
import Koa from "koa";
import compose from "koa-compose";
import route, { KoaRoute } from "koa-better-route";
import { cors, serverLog, errorHandler } from "./koa-util";
import { basename } from "path";
import send from "koa-send";

interface Options {
  port: number;
  websocketPort: number;
  directories: string[];
  builderServer?: string;
  uiServer?: string;
  key?: string;
  pkgsPath?: string;
  ignore: string[];
}

export class ProjectMapping {
  nameToPath: Map<string, string> = new Map();
  pathToName: Map<string, string> = new Map();
  constructor(directories: string[]) {
    for (let dir of directories) {
      let localName = basename(dir);
      let counter = 0;
      while (this.nameToPath.has(localName)) {
        localName = `${localName}/${counter}`;
        counter++;
      }
      this.nameToPath.set(localName, dir);
      this.pathToName.set(dir, localName);
    }
  }
}

export function start(opts: Options) {
  let { port, websocketPort, directories, pkgsPath } = opts;
  let mapping = new ProjectMapping(directories);
  new FileWatcherServer(websocketPort, mapping).start();
  let app = server({ mapping }, opts.ignore, opts.builderServer, opts.uiServer);
  app.listen(port);
  if (pkgsPath) {
    let pkgsPort = port + 1;
    let pkgsApp = pkgServer(pkgsPath);
    pkgsApp.listen(pkgsPort);
    console.log(`serving catalogjs pkgs on port: ${pkgsPort}`);
  }
  console.log(`server listening on port: ${port}`);
}

export function server(
  { mapping }: { mapping: ProjectMapping },
  ignore: string[] = [],
  builderServer?: string,
  uiServer?: string
) {
  let app = new Koa();
  app.use(
    compose([
      serverLog("fileDaemon"),
      errorHandler,
      cors,
      route.get("/catalogjs/alive", (ctxt: KoaRoute.Context) => {
        ctxt.status = 200;
      }),
      serveFiles(mapping, ignore, builderServer, uiServer),
    ])
  );
  return app;
}

export function pkgServer(pkgsPath: string) {
  let app = new Koa();
  app.use(
    compose([
      serverLog("pkgServer"),
      errorHandler,
      cors,
      route.get("/(.*)", (ctxt: KoaRoute.Context) => {
        let file = ctxt.routeParams[0];
        if (file === "alive") {
          ctxt.status = 200;
          return;
        }
        return send(ctxt, file, { root: pkgsPath });
      }),
    ])
  );
  return app;
}
