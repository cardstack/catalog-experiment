import yargs from "yargs";
import { Logger, log, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { NodeFileSystemDriver, closeAll } from "./node-filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { resolveNodePkg } from "./resolve";
import { ensureDirSync, removeSync } from "fs-extra";
import fetch from "node-fetch";
import { recipesURL } from "../../builder-worker/src/recipes";

if (!globalThis.fetch) {
  (globalThis.fetch as any) = fetch;
}

Logger.echoInConsole(true);
Logger.setLogLevel("info");

let outputDir = join(process.cwd(), "dist");
let projectRoots: [URL, URL][] = [];

let { project: rawProjects, overlay } = yargs
  .usage(
    "Usage: $0 --project=<filePath_1>,<outputURL_1> ... --project=<filePath_N>,<outputURL_N>"
  )
  .options({
    project: {
      alias: "p",
      type: "string",
      description:
        "the project to include as a comma separated string of file path (where the input lives on disk) and output URL (where other projects can find this project). Use the output URL of http://build-output to write to the dist/ folder.",
    },
    overlay: {
      alias: "o",
      type: "boolean",
      default: false,
      description:
        "a flag indicating if the un-built assets in the input URL should be included in the output URL. This is would include application assets like images. Otherwise the build output is purely artifacts emitted from the build.",
    },
  })
  .boolean("overlay")
  .array("project")
  .demandOption(["project"]).argv;

if (!rawProjects || rawProjects.filter(Boolean).length === 0) {
  console.log(
    `You must supply a list of projects to build. each project should be in the form of 'project_file_path,http://project/output/url'`
  );
  process.exit(1);
}
let projects = (rawProjects as unknown) as string[];

let fs = new FileSystem();
(async () => {
  await prepare();
  await build();
  log(`build complete: ${outputDir}`);
  process.exit(0);
})()
  .catch((err) => {
    error(`Unhandled error while building`, err);
    process.exit(1);
  })
  .finally(() => {
    closeAll();
  });

async function prepare() {
  let count = 0;
  for (let project of projects) {
    let [path, outputHref] = project.split(",");
    if (!path || !outputHref) {
      console.error(
        `project '${project}' needs to be in the form of 'project_file_path,http://project/output/url'`
      );
      process.exit(1);
    }
    let inputURL = new URL(`http://project-src${count++}`);
    let driver = new NodeFileSystemDriver(resolve(path));
    await fs.mount(inputURL, driver);
    let recipesPath = join(resolveNodePkg("@catalogjs/recipes"), "recipes");
    await fs.mount(recipesURL, new NodeFileSystemDriver(recipesPath));
    projectRoots.push([inputURL, new URL(outputHref)]);
  }
}

async function doOverlay() {
  for (let [input, output] of projectRoots) {
    await fs.copy(input, output);
  }
}

async function build() {
  log(
    `building projects: ${projects.map((p) => p.split(",").shift()).join(", ")}`
  );
  removeSync(outputDir);
  ensureDirSync(outputDir);
  await fs.mount(
    new URL("http://build-output"),
    new NodeFileSystemDriver(outputDir)
  );
  if (overlay) {
    await doOverlay();
  }

  let builder = Builder.forProjects(fs, projectRoots, recipesURL);
  await builder.build();
}
