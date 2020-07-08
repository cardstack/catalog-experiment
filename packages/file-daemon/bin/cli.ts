import yargs from "yargs";
import { resolve } from "path";
import { start } from "../daemon";

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

if (argv._.length === 0) {
  console.error(
    `Please specify the directories to watch as command line arguments`
  );
  process.exit(1);
}

let directories = argv._.map((dir) => resolve(process.cwd(), dir));

start({ directories, ...argv });
