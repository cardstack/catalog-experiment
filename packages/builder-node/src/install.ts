import yargs from "yargs";
import { Logger, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { NpmImportPackagesNode } from "./nodes/npm-import";
import { resolveNodePkg } from "./pkg-resolve";
import { ensureDirSync } from "fs-extra";
import fetch from "node-fetch";
import { closeAll, NodeFileSystemDriver } from "./node-filesystem-driver";
import { recipesURL } from "../../builder-worker/src/recipes";
import { NodeResolver } from "./resolver";
import { catalogjsHref } from "../../builder-worker/src/resolver";

if (!globalThis.fetch) {
  (globalThis.fetch as any) = fetch;
}

Logger.echoInConsole(true);
Logger.setLogLevel("info");
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
let projectDir = resolve(process.cwd(), project);

(async () => {
  // TODO this should probably come from the command line. the src cloning is a
  // very expensive task, so it is beneficial to retain this directory for
  // future executions of this command
  let workingDir = join(process.cwd(), "working");
  let cdnDir = join(workingDir, "cdn", "pkgs");
  ensureDirSync(cdnDir);

  let fs = new FileSystem();
  let driver = new NodeFileSystemDriver(cdnDir);
  await fs.mount(new URL(catalogjsHref), driver);
  let resolver = new NodeResolver(fs, workingDir);
  let builderRoot = new NpmImportPackagesNode(
    pkgs,
    projectDir,
    workingDir,
    resolver
  );
  let recipesPath = join(resolveNodePkg("@catalogjs/recipes"), "recipes");
  await fs.mount(recipesURL, new NodeFileSystemDriver(recipesPath));
  let builder = new Builder(fs, [builderRoot], recipesURL);
  await builder.build();

  console.log("done");
  process.exit(0);
})()
  .catch((err) => {
    error(`Unhandled error while building`, err);
    process.exit(1);
  })
  .finally(() => closeAll());
