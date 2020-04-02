#!/usr/bin/env -S deno --allow-net --allow-read

import { posix } from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import FileWatcherServer from "http://localhost:8081/file-watcher-server.ts";
import FileHostingServer from "http://localhost:8081/file-hosting-server.ts";

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

await Promise.all([hoster.start(), watcher.start()]);
