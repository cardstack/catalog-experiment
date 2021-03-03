import FileWatcherServer from "./file-watcher-server";
import { serveFiles } from "./file-hosting-server";
import Koa from "koa";
import compose from "koa-compose";
import route, { KoaRoute } from "koa-better-route";
import { cors, serverLog, errorHandler } from "./koa-util";
import { basename, join } from "path";
import send from "koa-send";
import { readFileSync } from "fs-extra";
import { transformSync } from "@babel/core";

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

export type FileSource =
  | string
  | { streamFile: string }
  | { status: number; message?: string };

export class Project {
  constructor(public localName: string, public dir: string) {}

  static forDirs(dirs: string[]): Project[] {
    let usedNames = new Set<string>();
    let projects: Project[] = [];
    for (let dir of dirs) {
      let localName = basename(dir);
      let counter = 0;
      while (usedNames.has(localName)) {
        localName = `${localName}/${counter}`;
        counter++;
      }
      projects.push(new Project(localName, dir));
    }
    return projects;
  }

  outputFiles(
    inputRelativePath: string
  ): {
    outputRelativePath: string;
    load: () => FileSource;
  }[] {
    if (inputRelativePath.endsWith(".js")) {
      return [
        {
          outputRelativePath: inputRelativePath,
          load: applyBabel(this.dir, inputRelativePath),
        },
      ];
    }

    if (inputRelativePath.endsWith(".hbs")) {
      return [
        {
          outputRelativePath: `${inputRelativePath}.js`,
          load: () => {
            return `export default template = "I am template ${inputRelativePath}"`;
          },
        },
      ];
    }

    return [
      {
        outputRelativePath: inputRelativePath,
        load() {
          return { streamFile: inputRelativePath };
        },
      },
    ];
  }

  loadFile(outputRelativePath: string): FileSource {
    if (outputRelativePath.endsWith(".hbs")) {
      return { status: 404 };
    }

    if (outputRelativePath.endsWith(".hbs.js")) {
      return `export default template = "I am template ${outputRelativePath.slice(
        0,
        -3
      )}"`;
    }
    if (outputRelativePath.endsWith(".js")) {
      return (
        `// I was transformed\n` +
        readFileSync(join(this.dir, outputRelativePath), "utf8")
      );
    }
    return {
      streamFile: outputRelativePath,
    };
  }
}

export function start(opts: Options) {
  let { port, websocketPort, directories, pkgsPath } = opts;
  let projects = Project.forDirs(directories);
  new FileWatcherServer(websocketPort, projects).start();
  let app = server(projects, opts.ignore, opts.builderServer, opts.uiServer);
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

function applyBabel(projectDir: string, relativePath: string): () => string {
  return function () {
    let filename = join(projectDir, relativePath);
    // we're depending on embroider from branch catalogjs-experiment in the
    // snowpack-experiment repo. However, the hack section in
    // adjust-imports-plugin must be enabled when we're running babel here, but
    // disabled when we're running it in the node build for importing npm
    // dependencies.
    let config = require(join(projectDir, "_babel_config_.js"));
    return transformSync(readFileSync(filename, "utf8"), {
      ...config,
      filename,
    })!.code!;
  };
}
