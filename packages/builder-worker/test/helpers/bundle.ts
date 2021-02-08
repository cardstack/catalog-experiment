import { origin, url } from "./file-assertions";
import { Builder, Rebuilder } from "../../src/builder";
import { FileSystem } from "../../src/filesystem";
import { recipesURL } from "../../src/recipes";
import { extractDescriptionFromSource } from "../../src/description-encoder";
import { Options } from "../../src/nodes/project";
import { FileDescriptor } from "../../src/filesystem-drivers/filesystem-driver";
import { FileDescription } from "../../src/describe-file";
import { RegionEditor } from "../../src/region-editor";

export const outputOrigin = `http://output`;

export async function bundleSource(
  fs: FileSystem,
  bundleURL: URL = url("output/index.js"),
  options?: Partial<Options>
) {
  let builder = makeBuilder(fs, new URL("/output/", origin), options);
  await builder.build();
  let fd: FileDescriptor | undefined;
  try {
    fd = await fs.openFile(bundleURL);
    return await fd.readText();
  } finally {
    if (fd) {
      await fd.close();
    }
  }
}
export async function bundle(
  fs: FileSystem,
  bundleURL: URL = url("output/index.js"),
  options?: Partial<Options>
) {
  return extractDescriptionFromSource(
    await bundleSource(fs, bundleURL, options)
  );
}

export async function bundleCode(
  fs: FileSystem,
  bundleURL: URL = url("output/index.js"),
  options?: Partial<Options>
) {
  let { source } = await bundle(fs, bundleURL, options);
  return source;
}

export async function bundleDescription(
  fs: FileSystem,
  bundleURL: URL = url("output/index.js"),
  options?: Partial<Options>
) {
  let { desc } = await bundle(fs, bundleURL, options);
  return desc!;
}

export function makeBuilder(
  fs: FileSystem,
  outputURL = new URL("/output/", origin),
  options?: Partial<Options>
) {
  return Builder.forProjects(
    fs,
    [[new URL(origin), outputURL]],
    recipesURL,
    options
  );
}

export function makeRebuilder(
  fs: FileSystem,
  outputURL = new URL("/output/", outputOrigin)
) {
  return Rebuilder.forProjects(fs, [[new URL(origin), outputURL]], recipesURL);
}

export function makeEditor(
  source: string,
  desc: FileDescription,
  moduleURL: URL = url("index.js")
) {
  return new RegionEditor(source, desc, moduleURL.href);
}
