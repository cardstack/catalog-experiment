import FileWatcherServer from "./file-watcher-server";
import { serveFiles } from "./file-hosting-server";
import Koa from "koa";
import compose from "koa-compose";
import route, { KoaRoute } from "koa-better-route";
import { cors, serverLog, errorHandler } from "./koa-util";
import { basename } from "path";

interface Options {
  port: number;
  websocketPort: number;
  directories: string[];
  key?: string;
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
  let { port, websocketPort, directories } = opts;
  let mapping = new ProjectMapping(directories);
  new FileWatcherServer(websocketPort, mapping).start();
  let app = server({ mapping });
  app.listen(port);
}

export function server({ mapping }: { mapping: ProjectMapping }) {
  let app = new Koa();
  app.use(
    compose([
      serverLog,
      errorHandler,
      cors,
      route.get("/catalogjs/alive", (ctxt: KoaRoute.Context) => {
        ctxt.status = 200;
      }),
      serveFiles(mapping),
    ])
  );
  return app;
}
