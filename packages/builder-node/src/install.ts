import yargs from "yargs";
import { Logger, error } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { NodeFileSystemDriver } from "./node-filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { Builder } from "../../builder-worker/src/builder";
import { NpmImportProjectsNode } from "../../builder-worker/src/nodes/npm-import";
import { ensureDirSync } from "fs-extra";

Logger.echoInConsole(true);
Logger.setLogLevel("info");
let { pkg: pkgs, nodeModules: rawNodeModules } = yargs
  .options({
    nodeModules: {
      alias: "n",
      type: "string",
      description: "the path of the node_modules/ folder",
    },
    pkg: {
      alias: "p",
      type: "string",
      description:
        "the package name and semver range to install, e.g.: '@babel/core:^7.9.0'",
    },
  })
  .array("pkg")
  .demandOption(["pkg", "nodeModules"]).argv;

if (!pkgs || pkgs.filter(Boolean).length === 0) {
  console.log(
    `You must supply a list of packages to build. each package should be in the form of pkg_name:semver, e.g.: '@babel/core:^7.9.0'`
  );
  process.exit(1);
}
let nodeModulesDir = resolve(join(process.cwd(), rawNodeModules));

let fs = new FileSystem();
(async () => {
  let nodeModules = new NodeFileSystemDriver(nodeModulesDir);
  let nodeModulesURL = new URL("https://node_modules/");
  await fs.mount(nodeModulesURL, nodeModules);

  // TODO this should probably come from the command line. the src cloning is a
  // very expensive task, so it is beneficial to retain this directory for
  // future executions of this command
  let gitRootPath = join(process.cwd(), "pkg-src");
  ensureDirSync(gitRootPath);
  let git = new NodeFileSystemDriver(gitRootPath);
  let gitRootURL = new URL("https://pkg-src/");
  await fs.mount(gitRootURL, git);

  let rootPkgs = pkgs.map((p) => {
    let [name, semver] = p.split(":");
    return { name, semver };
  });
  let builderRoot = new NpmImportProjectsNode(rootPkgs, nodeModulesURL, {
    fsURL: gitRootURL,
    nodeFSPath: gitRootPath,
  });

  let builder = new Builder(fs, [builderRoot]);
  let output = await builder.build();
  debugger;
  console.log(`\nbuild output:\n${JSON.stringify(output, null, 2)} `);
  console.log("done");
  process.exit(0);
})().catch((err) => {
  error(`Unhandled error while building`, err);
  process.exit(1);
});
