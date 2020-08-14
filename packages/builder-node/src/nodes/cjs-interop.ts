import {
  BuilderNode,
  AllNode,
  Value,
  NodeOutput,
  ConstantNode,
} from "../../../builder-worker/src/nodes/common";
import { promisify } from "util";
import fsExtra, { readFileSync } from "fs-extra";
import { basename } from "path";
import {
  FileDescription,
  describeFile,
  isModuleDescription,
  CJSDescription,
} from "../../../builder-worker/src/describe-file";
import { JSParseNode } from "../../../builder-worker/src/nodes/js";
import { PackageEntrypointsNode } from "./npm-import";
import { File } from "@babel/types";
import { RegionEditor } from "../../../builder-worker/src/code-region";
import _glob from "glob";

const glob = promisify(_glob);
const writeFile = promisify(fsExtra.writeFile);
const remove = promisify(fsExtra.remove);

export class MakePkgESCompliantNode implements BuilderNode {
  cacheKey: string;
  constructor(
    pkgPath: string,
    private entrypointsNode: PackageEntrypointsNode
  ) {
    this.cacheKey = `make-pkg-es-compliant:${pkgPath}`;
  }

  deps() {
    return {
      srcPath: this.entrypointsNode,
    };
  }

  async run({ srcPath }: { srcPath: string }): Promise<NodeOutput<void[]>> {
    // using a glob here instead of trying to crawl deps from the file
    // description to find files to introspect, because we're not ready to start
    // resolving yet (and we don't want to be forced into node resolution for
    // the CJS files).
    let files = await glob("**/*.js", {
      cwd: srcPath,
      absolute: true,
      ignore: `${srcPath}/node_modules/**`,
    }); // TODO need to include .ts too...
    return {
      node: new AllNode(files.map((file) => new IntrospectSrcNode(file))),
    };
  }
}

class IntrospectSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string) {
    this.cacheKey = `introspect-src:${path}`;
  }

  deps() {
    return {
      desc: new AnalyzeFileNode(this.path),
    };
  }

  async run({ desc }: { desc: FileDescription }): Promise<NodeOutput<void>> {
    if (isModuleDescription(desc)) {
      // TODO copy into output area
      return { value: undefined };
    } else {
      return { node: new ESInteropNode(this.path, desc) };
    }
  }
}

class ESInteropNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string, private desc: CJSDescription) {
    this.cacheKey = `es-interop:${path}`;
  }

  deps() {
    let src = readFileSync(this.path, { encoding: "utf8" });
    return {
      rewrite: new RewriteCJSNode(this.path, this.desc, src),
      shim: new ESModuleShimNode(this.path),
    };
  }

  async run(): Promise<NodeOutput<void>> {
    return { value: undefined };
  }
}

function remapRequires(origSrc: string, desc: CJSDescription): string {
  let editor = new RegionEditor(origSrc, desc, () => {
    throw new Error(`Cannot obtain unused binding name for CJS file`);
  });
  // TODO need to make sure "dependencies" does not collide with another binding
  // in origSrc--the desc be able to tell us this...
  for (let [index, require] of desc.requires.entries()) {
    editor.replace(require.requireRegion, `dependencies[${index}]()`);
  }
  return editor.serialize();
}

function depFactoryName(specifier: string): string {
  return `${specifier.replace(/\W/g, "_")}Factory`.replace(/^_+/, "");
}

// This can just be a function (since it has no deps()
class RewriteCJSNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private path: string,
    private desc: CJSDescription,
    private src: string
  ) {
    this.cacheKey = `rewrite-cjs:${path}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<void>> {
    let imports = this.desc.requires.map(
      ({ specifier }) =>
        `import ${depFactoryName(specifier)} from "${specifier}$cjs$";`
    );
    let deps: string[] = this.desc.requires.map(({ specifier }) =>
      depFactoryName(specifier)
    );
    let newSrc = `${imports.join("\n")}
let module;
function implementation() {
  if (!module) {
    module = { exports: {} };
    Function(
      "module",
      "exports",
      "dependencies",
      \`${remapRequires(this.src, this.desc)
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")}\`
    )(module, module.exports, [${deps.join(", ")}]);
  }
  return module.exports;
}
export default implementation;`;
    await writeFile(this.path.replace(/\.js$/, ".cjs.js"), newSrc);
    return { value: undefined };
  }
}

class ESModuleShimNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string) {
    this.cacheKey = `es-shim:${path}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<void>> {
    await remove(this.path);
    await writeFile(
      this.path,
      `import implementation from "./${basename(this.path)}$cjs$";
export default implementation();`
    );
    return { value: undefined };
  }
}

class AnalyzeFileNode implements BuilderNode {
  cacheKey: string;
  constructor(private path: string) {
    this.cacheKey = `analyze-file:${path}`;
  }

  deps() {
    return {
      parsed: new JSParseNode(
        new ConstantNode(readFileSync(this.path, { encoding: "utf8" }))
      ),
    };
  }

  async run({ parsed }: { parsed: File }): Promise<Value<FileDescription>> {
    return { value: describeFile(parsed) };
  }
}
