import yargs from "yargs";
import { resolve } from "path";
import FileWatcherServer from "./file-watcher-server";
import FileHostingServer from "./file-hosting-server";
import { HandlerMaker } from "./test-support/test-request-handler";

interface CommandLineArgs {
  port: number;
  websocketPort: number;
  key?: string;
  _: string[]; // this is yargs' "rest" property that holds all commandline args without names
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
      description: "Sets the application serving port",
    },
    websocketPort: {
      alias: "w",
      type: "number",
      default: 3000,
      description: "Sets the file notification web sock port",
    },
    key: {
      alias: "k",
      type: "string",
      description:
        "Specify a key to use when testing file daemon to permit modifications to the underlying file system",
    },
  }).argv;
  const serverArgs = argv as CommandLineArgs;
  if (serverArgs._.length === 0) {
    console.error(
      `Please specify the directories to watch as command line arguments`
    );
    process.exit(1);
  }

  let { _: unresolvedDirs } = serverArgs;
  let directories = unresolvedDirs.map((dir) => resolve(process.cwd(), dir));
  let watcher = new FileWatcherServer(serverArgs.websocketPort, directories);
  let testRequestHandler =
    makeTestHandler && serverArgs.key
      ? makeTestHandler(directories[0], serverArgs.key)
      : undefined;
  let hoster = new FileHostingServer(
    serverArgs.port,
    directories,
    true,
    testRequestHandler
  );

  hoster.start();
  watcher.start();
}
