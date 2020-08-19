import yargs from "yargs";
import { Logger, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { NpmImportPackagesNode } from "./nodes/npm-import";
import { ensureDirSync } from "fs-extra";
import fetch from "node-fetch";
import { Package } from "./nodes/package";
import { closeAll } from "./node-filesystem-driver";

if (!globalThis.fetch) {
  (globalThis.fetch as any) = fetch;
}

Logger.echoInConsole(true);
Logger.setLogLevel("debug");
let { _: pkgs, project } = yargs
  .options({
    project: {
      alias: "p",
      type: "string",
      description: "the path of the project",
    },
  })
  .demandOption(["project"]).argv;

if (!pkgs || pkgs.filter(Boolean).length === 0) {
  console.log(
    `You must supply a list of packages to npm package to install that are deps of the specified project.`
  );
  process.exit(1);
}
let projectDir = resolve(join(process.cwd(), project));

(async () => {
  // TODO this should probably come from the command line. the src cloning is a
  // very expensive task, so it is beneficial to retain this directory for
  // future executions of this command
  let workingDir = join(process.cwd(), "working");
  ensureDirSync(workingDir);
  let fs = new FileSystem();
  let builderRoot = new NpmImportPackagesNode(pkgs, projectDir, workingDir);
  let nodeBuilder = new Builder(fs, [builderRoot]);
  let packages = (await nodeBuilder.build())[0];
  debugger;
  let projects = packagesToProjects(packages);
  let coreBuilder = Builder.forProjects(fs, projects);
  await coreBuilder.build();

  console.log("done");
  process.exit(0);
})()
  .catch((err) => {
    error(`Unhandled error while building`, err);
    process.exit(1);
  })
  .finally(() => closeAll());

function packagesToProjects(packages: Package[]): [URL, URL][] {
  let projects: [URL, URL][] = [];
  for (let pkg of packages) {
    if (pkg.dependencies.length > 0) {
      projects = [...projects, ...packagesToProjects(pkg.dependencies)];
    } else {
      projects.push([new URL("src/", pkg.url), pkg.url]);
    }
  }

  return projects;
}
