import yargs from "yargs";
import { Logger } from "../../builder-worker/src/logger";
import { resolve, join } from "path";
import { readFileSync } from "fs-extra";
import { extractDescriptionFromSource } from "../../builder-worker/src/description-encoder";
import { stringifyReplacer } from "../../builder-worker/src/utils";

Logger.echoInConsole(true);
Logger.setLogLevel("info");
let { _: bundle } = yargs.argv;

if (!bundle || bundle.filter(Boolean).length === 0) {
  console.log(`You must supply the path of a catalogjs bundle`);
  process.exit(1);
}
let bundlePath = resolve(join(process.cwd(), bundle[0]));
let bundleSrc = readFileSync(bundlePath, "utf8");

let { desc } = extractDescriptionFromSource(bundleSrc);
console.log(
  `Bundle description for ${bundle}:\n${JSON.stringify(
    desc,
    stringifyReplacer,
    2
  )}`
);
process.exit(0);
