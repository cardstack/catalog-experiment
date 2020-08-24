import yargs from "yargs";
import { Logger, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { NpmImportPackagesNode } from "./nodes/npm-import";
import { ensureDirSync } from "fs-extra";
import fetch from "node-fetch";
import { closeAll } from "./node-filesystem-driver";
import { Resolver } from "../../builder-worker/src/resolver";

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
  let resolver = new Resolver(fs);
  let builderRoot = new NpmImportPackagesNode(
    pkgs,
    projectDir,
    workingDir,
    resolver
  );
  let builder = new Builder(fs, [builderRoot]);
  await builder.build();

  console.log("done");
  process.exit(0);
})()
  .catch((err) => {
    error(`Unhandled error while building`, err);
    process.exit(1);
  })
  .finally(() => closeAll());
