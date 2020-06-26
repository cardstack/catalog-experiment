import yargs from "yargs";
import { Logger, log, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { NodeFileSystemDriver } from "./node-filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { ensureDirSync, removeSync } from "fs-extra";
import fetch from "node-fetch";

if (!globalThis.fetch) {
  (globalThis.fetch as any) = fetch;
}

Logger.echoInConsole(true);
Logger.setLogLevel("info");
let inputURL = new URL("https://app-src/");
let outputURL = new URL("https://build-output");

let appDir: string;
let outputDir = join(process.cwd(), "dist");

let { _: projectDirs, overlay } = yargs
  .options({
    overlay: {
      alias: "o",
      type: "boolean",
      default: false,
      description:
        "overlay output on top of input (otherwise input is not included in the output)",
    },
  })
  .boolean("overlay").argv;

console.log(`overlay: ${overlay}`);

if (projectDirs.length === 0) {
  error(
    "Error: must specify the app directory to be built as a commandline argument"
  );
  process.exit(1);
} else {
  appDir = resolve(projectDirs[0]);
}

(async () => {
  await build();
  log(`build complete: ${outputDir}`);
  process.exit(0);
})().catch((err) => {
  error(`Unhandled error while building`, err);
  process.exit(1);
});

async function build() {
  log(`building app: ${appDir}`);
  removeSync(outputDir);
  ensureDirSync(outputDir);
  let fs = new FileSystem();
  await fs.mount(inputURL, new NodeFileSystemDriver(appDir));
  await fs.mount(outputURL, new NodeFileSystemDriver(outputDir));

  let builder;
  if (overlay) {
    // this ensures that we can provide resource layering that emulates how our
    // service worker web server works
    await fs.copy(inputURL, outputURL);
    builder = Builder.forProjects(fs, [[outputURL, outputURL]]);
  } else {
    builder = Builder.forProjects(fs, [[inputURL, outputURL]]);
  }

  await builder.build();
}
