import FileWatcherServer from "./file-watcher-server";
import { serveFiles } from "./file-hosting-server";
import Koa from "koa";
import compose from "koa-compose";
import route, { KoaRoute } from "koa-better-route";
import { cors } from "./cors";
import { serverLog } from "./server-log";

interface Options {
  port: number;
  websocketPort: number;
  directories: string[];
  key?: string;
}

export function start(opts: Options) {
  let { port, websocketPort, directories } = opts;
  new FileWatcherServer(websocketPort, directories).start();
  let app = server({ directories: opts.directories });
  app.listen(port);
}

export function server({ directories }: { directories: string[] }) {
  let app = new Koa();
  app.use(
    compose([
      serverLog,
      cors,
      route.get("/catalogjs/alive", (ctxt: KoaRoute.Context) => {
        ctxt.status = 200;
      }),
      serveFiles(directories),
    ])
  );
  return app;
}
