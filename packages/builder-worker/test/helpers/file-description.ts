import {
  describeFile as astDescribeFile,
  FileDescription,
  isModuleDescription,
  ModuleDescription,
  CJSDescription,
} from "../../src/describe-file";
import { RegionEditor } from "../../src/code-region";
import { parse } from "@babel/core";

export function describeFile(
  js: string
): { desc: FileDescription; editor: RegionEditor } {
  js = js.trim();
  let parsed = parse(js);
  if (parsed?.type !== "File") {
    throw new Error(`unexpected babel output`);
  }
  let desc = astDescribeFile(parsed);
  return {
    desc,
    editor: new RegionEditor(js, desc),
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