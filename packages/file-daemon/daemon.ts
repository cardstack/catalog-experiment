import yargs from "yargs";
import { resolve } from "path";
import FileWatcherServer from "./file-watcher-server";
import FileHostingServer from "./file-hosting-server";

interface CommandLineArgs {
  port: number;
  websocketPort: number;
  directory: string;
}

function polyfill() {
  // TODO use this as an npm dependency--dont vendor
  const webStreams = require("../../vendor/web-streams");
  global = Object.assign(global, webStreams);
}

export function start() {
  polyfill();

  const argv = yargs.options({
    port: {
      alias: "p",
      type: "number",
      default: 4200,
      description: "Sets the file server port",
    },
    websocketPort: {
      alias: "w",
      type: "number",
      default: 3000,
      description: "Sets the file notification web sock port",
    },
    directory: {
      alias: "d",
      type: "string",
      default: process.cwd(),
      description: "Set the directory to serve and watch for changes",
    },
  }).argv;
  const serverArgs = argv as CommandLineArgs;

  let rootDir = resolve(process.cwd(), serverArgs.directory);
  let watcher = new FileWatcherServer(serverArgs.websocketPort, rootDir);
  let hoster = new FileHostingServer(serverArgs.port, rootDir, true);

  hoster.start();
  watcher.start();
}
