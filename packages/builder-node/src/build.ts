import { Logger, log, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { NodeFileSystemDriver } from "./node-filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { ensureDirSync, removeSync } from "fs-extra";

Logger.echoInConsole(true);
Logger.setLogLevel("info");
let inputURL = new URL("https://app-src/");
let outputURL = new URL("https://build-output/");
let projects: [URL, URL][] = [[inputURL, outputURL]];

let appDir: string;
let outputDir = join(process.cwd(), "dist");

if (!process.argv[2]) {
  error("Error: app directory not specified");
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
  let builder = Builder.forProjects(fs, projects);
  await builder.build();
}
