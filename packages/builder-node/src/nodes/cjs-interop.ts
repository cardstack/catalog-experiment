import {
  BuilderNode,
  AllNode,
  Value,
  NodeOutput,
  ConstantNode,
} from "../../../builder-worker/src/nodes/common";
import {
  FileListingNode,
  WriteFileNode,
  FileNode,
} from "../../../builder-worker/src/nodes/file";
import { ListingEntry } from "../../../builder-worker/src/filesystem";
import {
  FileDescription,
  describeFile,
  isModuleDescription,
  CJSDescription,
} from "../../../builder-worker/src/describe-file";
import { JSParseNode } from "../../../builder-worker/src/nodes/js";
import { File } from "@babel/types";
import { RegionEditor } from "../../../builder-worker/src/code-region";
import { PackageSrcNode } from "./package";

export class MakePkgESCompliantNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL, private pkgSrcNode: PackageSrcNode) {
    this.cacheKey = `make-pkg-es-compliant:${pkgURL.href}`;
  }

  deps() {
    return {
      listing: new FileListingNode(this.pkgURL, true),
      src: this.pkgSrcNode,
    };
  }

  async run({
    listing,
  }: {
    listing: ListingEntry[];
  }): Promise<NodeOutput<void[]>> {
    // get all files (and optionally filter thru recipes config) trying to crawl
    // deps from the file description to find files to introspect, because we're
    // not ready to start resolving yet (and we don't want to be forced into
    // node resolution for the CJS files).
    let files = listing
      .filter(
        // TODO need to include .ts too...
        (entry) => entry.stat.type === "file" && entry.url.href.match(/\.js$/)
      )
      .map((entry) => entry.url);
    return {
      node: new AllNode(files.map((file) => new IntrospectSrcNode(file))),
    };
  }
}

class IntrospectSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL) {
    this.cacheKey = `introspect-src:${url.href}`;
  }

  deps() {
    return {
      desc: new AnalyzeFileNode(this.url),
    };
  }

  async run({ desc }: { desc: FileDescription }): Promise<NodeOutput<void>> {
    if (isModuleDescription(desc)) {
      return { value: undefined };
    } else {
      return { node: new ESInteropNode(this.url, desc) };
    }
  }
}

class ESInteropNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL, private desc: CJSDescription) {
    this.cacheKey = `es-interop:${url.href}`;
  }

  deps() {
    return {
      rewrite: new RewriteCJSNode(this.url, this.desc, new FileNode(this.url)),
      shim: new ESModuleShimNode(this.url),
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

class RewriteCJSNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private url: URL,
    private desc: CJSDescription,
    private srcNode: BuilderNode<string>
  ) {
    this.cacheKey = `rewrite-cjs:${url.href}`;
  }

  deps() {
    return {
      src: this.srcNode,
    };
  }

  async run({ src }: { src: string }): Promise<NodeOutput<void>> {
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
      \`${remapRequires(src, this.desc)
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")}\`
    )(module, module.exports, [${deps.join(", ")}]);
  }
  return module.exports;
}
export default implementation;`;
    return {
      node: new WriteFileNode(
        new ConstantNode(newSrc),
        new URL(this.url.href.replace(/\.js$/, ".cjs.js"))
      ),
    };
  }
}

class ESModuleShimNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL) {
    this.cacheKey = `es-shim:${url.href}`;
  }

  deps() {}

  async run(): Promise<NodeOutput<void>> {
    let basename = this.url.pathname.split("/").pop();
    let src = `import implementation from "./${basename}$cjs$";
export default implementation();`;
    return {
      node: new WriteFileNode(new ConstantNode(src), this.url, "es-shim"),
    };
  }
}

class AnalyzeFileNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL) {
    this.cacheKey = `analyze-file:${url.href}`;
  }

  deps() {
    return {
      parsed: new JSParseNode(new FileNode(this.url)),
    };
  }

  async run({ parsed }: { parsed: File }): Promise<Value<FileDescription>> {
    return { value: describeFile(parsed) };
  }
}
