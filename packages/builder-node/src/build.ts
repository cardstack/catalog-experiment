import { Logger, log, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { NodeFileSystemDriver } from "./node-filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { ensureDirSync, removeSync } from "fs-extra";

Logger.echoInConsole(true);
Logger.setLogLevel("info");
let inputURL = new URL("https://app-src/");
let outputURL = new URL("https://build-output");

let appDir: string;
let outputDir = join(process.cwd(), "dist");

if (!process.argv[2]) {
  error(
    "Error: must specify the app directory to be built as a commandline argument"
  );
  process.exit(1);
} else {
  appDir = resolve(process.argv[2]);
}

(async () => {
  await build();
  log(`build complete: ${outputDir}`);
  process.exit(0);
})();

async function build() {
  log(`building app: ${appDir}`);
  removeSync(outputDir);
  ensureDirSync(outputDir);
  let fs = new FileSystem();
  await fs.mount(inputURL, new NodeFileSystemDriver(appDir));
  await fs.mount(outputURL, new NodeFileSystemDriver(outputDir));
  // this ensures that we can provide resource layering that emulates how our
  // service worker web server works
  await fs.copy(inputURL, outputURL);
  let builder = Builder.forProjects(fs, [[outputURL, outputURL]]);
  await builder.build();
}
