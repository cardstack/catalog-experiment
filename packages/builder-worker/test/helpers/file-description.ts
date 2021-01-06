import {
  describeFile as astDescribeFile,
  FileDescription,
  isModuleDescription,
  ModuleDescription,
  CJSDescription,
} from "../../src/describe-file";
import { RegionEditor } from "../../src/code-region";
import { parse } from "@babel/core";
import { url } from "./file-assertions";

export function describeFile(
  js: string,
  filename: string = url("index.js").href
): { desc: FileDescription; editor: RegionEditor } {
  let parsed = parse(js);
  if (parsed?.type !== "File") {
    throw new Error(`unexpected babel output`);
  }
  let desc = astDescribeFile(parsed, filename);
  return {
    desc,
    editor: new RegionEditor(js, desc, url("output/index.js")),
  };
}

export function describeESModule(
  js: string
): { desc: ModuleDescription; editor: RegionEditor } {
  let { desc, editor } = describeFile(js);
  if (!isModuleDescription(desc)) {
    throw new Error(`file is CJS, but we were expecting an ES module`);
  }
  return { desc, editor };
}

export function describeCJSFile(
  js: string
): { desc: CJSDescription; editor: RegionEditor } {
  let { desc, editor } = describeFile(js);
  if (isModuleDescription(desc)) {
    throw new Error(`file is ES module, but we were expecting CJS`);
  }
  return { desc, editor };
}
