import yargs from "yargs";
import { resolve } from "path";
import { start } from "../daemon";
import { gte } from "semver";

if (!gte(process.version, "14.5.0")) {
  console.error(
    `NodeJS version 14.5.0 or greater is required. Currently ${process.version} is being used.`
  );
}

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
  builderServer: {
    type: "string",
    description:
      "For active development of catalogjs, instead of relying upon the bundled builder service worker code, you can point the file daemon at a server that is hosting the service worker. This is nice for auto-rebuilds of the service worker as you are developing catalogjs.",
  },
  uiServer: {
    type: "string",
    description:
      "For active development of catalogjs, instead of relying upon the bundled catalogjs UI code, you can point the file daemon at a server that is hosting the ui. This is nice for auto rebuilds of the UI as you are developing catalogjs.",
  },
}).argv;

if (argv._.length === 0) {
  console.error(
    `Please specify the directories to watch as command line arguments`
  );
  process.exit(1);
}

let directories = argv._.map((dir) => resolve(process.cwd(), dir));

start({ directories, ...argv });
