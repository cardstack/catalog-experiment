import FileWatcherServer from "./file-watcher-server";
import { serveFiles } from "./file-hosting-server";
import Koa from "koa";
import compose from "koa-compose";
import route, { KoaRoute } from "koa-better-route";
import { cors, serverLog, errorHandler } from "./koa-util";
import send from "koa-send";
import { Project } from "./project";

interface Options {
  port: number;
  websocketPort: number;
  directories: string[];
  builderServer?: string;
  uiServer?: string;
  key?: string;
  pkgsPath?: string;
  ignore: string;
}

export function start(opts: Options) {
  let { port, websocketPort, directories, pkgsPath } = opts;
  let projects = Project.forDirs(directories);
  new FileWatcherServer(websocketPort, projects).start();
  let app = server(
    projects,
    opts.ignore.split(","),
    opts.builderServer,
    opts.uiServer
  );
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
  projects: Project[],
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
      serveFiles(projects, ignore, builderServer, uiServer),
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
