import yargs from "yargs";
import { resolve } from "path";
import FileWatcherServer from "./file-watcher-server";
import FileHostingServer from "./file-hosting-server";
import { HandlerMaker } from "./test-support/test-request-handler";

interface CommandLineArgs {
  port: number;
  websocketPort: number;
  directory: string;
  key?: string;
}

function polyfill() {
  const webStreams = require("web-streams-polyfill/ponyfill/es2018");
  global = Object.assign(global, webStreams);
}

export function start(makeTestHandler?: HandlerMaker) {
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
    key: {
      alias: "k",
      type: "string",
      description:
        "Specify a key to use when testing file daemon to permit modifications to the underlying file system",
    },
  }).argv;
  const serverArgs = argv as CommandLineArgs;

  let rootDir = resolve(process.cwd(), serverArgs.directory);
  let watcher = new FileWatcherServer(serverArgs.websocketPort, rootDir);
  let testRequestHandler =
    makeTestHandler && serverArgs.key
      ? makeTestHandler(rootDir, serverArgs.key)
      : undefined;
  let hoster = new FileHostingServer(
    serverArgs.port,
    rootDir,
    true,
    testRequestHandler
  );

  hoster.start();
  watcher.start();
}
