import yargs from "yargs";
import { Logger, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { NpmImportProjectsNode } from "./npm-import";
import { ensureDirSync } from "fs-extra";
import fetch from "node-fetch";

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

  let builderRoot = new NpmImportProjectsNode(pkgs, projectDir, workingDir);
  let builder = new Builder(new FileSystem(), [builderRoot]);
  let output = await builder.build();
  debugger;
  console.log("done");
  process.exit(0);
})().catch((err) => {
  error(`Unhandled error while building`, err);
  process.exit(1);
});
