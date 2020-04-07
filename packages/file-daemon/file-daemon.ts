import { posix } from "deno/std/path/mod";
import { parse } from "deno/std/flags/mod";
import FileWatcherServer from "./file-watcher-server";
import FileHostingServer from "./file-hosting-server";

interface CommandLineArgs {
  p?: number;
  port?: number;
  w?: number;
  websocketPort?: number;
  d?: string;
  directory?: string;
  h?: boolean;
  help?: boolean;
}

const { args, exit } = Deno;
const serverArgs = parse(args) as CommandLineArgs;
if (serverArgs.h ?? serverArgs.help) {
  console.log(`File Daemon
  Runs a websocket filewatcher server and static HTTP file server.

USAGE:
  file-daemon.ts [options]

OPTIONS:
  -h, --help                   Prints help information
  -p, --port <PORT>            Set the file server port
  -w, --websocketPort <PORT>   Set the file notification web socket port
  -d, --directory <DIRECTORY>  Set the directory to serve and watch for changes`);
  exit();
}

let rootDir = posix.resolve(serverArgs.directory ?? serverArgs.d ?? "");
const fileServerPort = serverArgs.port ?? serverArgs.p ?? "4200";
const websocketPort = serverArgs.websocketPort ?? serverArgs.w ?? "3000";
let watcher = new FileWatcherServer(websocketPort, rootDir);
let hoster = new FileHostingServer(fileServerPort, rootDir, true);

hoster.start();
watcher.start();
