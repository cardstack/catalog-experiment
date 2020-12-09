import {
  BuilderNode,
  AllNode,
  Value,
  NodeOutput,
  ConstantNode,
  NextNode,
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
import upperFirst from "lodash/upperFirst";
import { RegionEditor } from "../../../builder-worker/src/code-region";
import {
  pkgInfoFromCatalogJsURL,
  pkgInfoFromSpecifier,
} from "../../../builder-worker/src/resolver";
import { PackageSrcNode, buildSrcDir } from "./package";
// @ts-ignore repl.builtinModules is a new API added in node 14.5.0, looks like TS lint has not caught up
import { builtinModules } from "repl";

export class MakePkgESCompliantNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL, private pkgSrcNode: PackageSrcNode) {
    this.cacheKey = `make-pkg-es-compliant:${pkgURL.href}`;
  }

  async deps() {
    return {
      listing: new PreparePkgForEsCompliance(this.pkgURL, this.pkgSrcNode),
    };
  }

  async run({
    listing,
  }: {
    listing: ListingEntry[];
  }): Promise<NodeOutput<(void[] | void[][])[]>> {
    // get all files (and optionally filter thru recipes config) trying to crawl
    // deps from the file description to find files to introspect, because we're
    // not ready to start resolving yet (and we don't want to be forced into
    // node resolution for the CJS files).
    let files = listing
      .filter(
        // TODO need to include .ts too...
        (entry) =>
          entry.stat.type === "file" &&
          (entry.url.href.endsWith(".js") || entry.url.href.endsWith(".json"))
      )
      .map((entry) => entry.url);
    return {
      node: new AllNode(
        files.map((file) => new IntrospectSrcNode(file, this.pkgURL))
      ),
    };
  }
}

class PreparePkgForEsCompliance implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL, private pkgSrcNode: PackageSrcNode) {
    this.cacheKey = `prepare-pkg-es-compliance:${pkgURL.href}`;
  }

  async deps() {
    return {
      src: this.pkgSrcNode,
    };
  }

  async run(): Promise<NextNode<ListingEntry[]>> {
    return {
      node: new FileListingNode(new URL("__stage2/", this.pkgURL), true),
    };
  }
}

class IntrospectSrcNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL, private pkgURL: URL) {
    this.cacheKey = `introspect-src:${url.href}`;
  }

  async deps() {
    if (this.url.href.endsWith(".json")) {
      return {};
    }
    return {
      desc: new AnalyzeFileNode(this.url),
    };
  }

  async run({
    desc,
  }: {
    desc: FileDescription | undefined;
  }): Promise<NodeOutput<void[] | void[][]>> {
    let url = new URL(
      this.url.href.slice(`${this.pkgURL.href}__stage2/`.length),
      `${this.pkgURL}${buildSrcDir}`
    );
    if (!desc || isModuleDescription(desc)) {
      let jsonDeps = new Set<string>();
      for (let { declaration: importDesc } of desc?.declarations.values() ||
        []) {
        if (
          importDesc.type === "import" &&
          desc!.imports[importDesc.importIndex].specifier.endsWith(".json")
        ) {
          jsonDeps.add(desc!.imports[importDesc.importIndex].specifier);
        }
      }
      for (let exportDesc of desc?.exports.values() || []) {
        if (
          exportDesc.type === "reexport" &&
          desc!.imports[exportDesc.importIndex].specifier.endsWith(".json")
        ) {
          jsonDeps.add(desc!.imports[exportDesc.importIndex].specifier);
        }
      }
      let nodes: BuilderNode<void>[] = [
        new WriteFileNode(new FileNode(this.url), url),
        ...[...jsonDeps].map(
          (specifier) =>
            new JSONRewriterNode(
              new URL(specifier, this.url),
              new URL(specifier, url)
            )
        ),
      ];
      return { node: new AllNode(nodes) };
    } else {
      return { node: new ESInteropNode(this.url, url, desc) };
    }
  }
}

class ESInteropNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private inputURL: URL,
    private outputURL: URL,
    private desc: CJSDescription
  ) {
    this.cacheKey = `es-interop:${outputURL.href}`;
  }

  async deps() {
    return {
      src: new FileNode(this.inputURL),
    };
  }

  async run({ src }: { src: string }): Promise<NodeOutput<void[][]>> {
    return {
      node: new AllNode([
        new RewriteCJSNode(this.inputURL, this.outputURL, this.desc, src),
        new ESModuleShimNode(this.outputURL, this.desc),
      ]),
    };
  }
}

function remapRequires(
  origSrc: string,
  desc: CJSDescription,
  depBindingName: string
): string {
  let editor = new RegionEditor(origSrc, desc);
  for (let [pointer] of editor.regions.entries()) {
    editor.keepRegion(pointer);
  }
  for (let [index, require] of desc.requires.entries()) {
    editor.replace(require.requireRegion, `${depBindingName}[${index}]()`);
  }
  return editor.serialize().code;
}

function depFactoryName(specifier: string): string {
  return `${specifier.replace(/\W/g, "_")}Factory`.replace(/^_+/, "");
}
function depJSONName(specifier: string): string {
  return `${specifier.replace(/\.json$/, "").replace(/\W/g, "_")}JSON`.replace(
    /^_+/,
    ""
  );
}

function isLocalJSON(specifier: string): boolean {
  if (!specifier.startsWith(".") && !specifier.startsWith("/")) {
    return false;
  }
  let moduleBasename = specifier.split("/").pop()!;
  return Boolean(
    moduleBasename &&
      moduleBasename.includes(".") &&
      moduleBasename.split(".").pop() === "json"
  );
}

class RewriteCJSNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private inputURL: URL,
    private outputURL: URL,
    private desc: CJSDescription,
    private src: string
  ) {
    this.cacheKey = `rewrite-cjs:${outputURL.href}`;
  }

  async deps() {}

  async run(): Promise<NodeOutput<void[]>> {
    let jsonSpecifiers = new Set<string>();
    let imports = new Set<string>(
      this.desc.requires.map(({ specifier }) => {
        if (specifier == null) {
          return `import { requireHasNonStringLiteralSpecifier } from "@catalogjs/loader";`;
        }
        let pkgInfo = pkgInfoFromSpecifier(specifier);
        if (builtinModules.includes(pkgInfo?.pkgName)) {
          return `import { requireNodeBuiltin } from "@catalogjs/loader";`;
        }
        if (isLocalJSON(specifier)) {
          jsonSpecifiers.add(specifier); // side-effecty, but we're right here anyways...
          return `import ${depJSONName(specifier)} from "${specifier}.js";`;
        }
        return `import ${depFactoryName(specifier)} from "${specifier}$cjs$";`;
      })
    );
    let deps: string[] = this.desc.requires.map(({ specifier }) => {
      if (specifier == null) {
        // the module output URL is the temp working URL which is not the same
        // as the final URL. The final URL is impossible to know at this point
        // in the build. Split the output URL apart into info that is useful
        // enough to track down the problem at runtime.
        let pkgInfo = pkgInfoFromCatalogJsURL(this.outputURL)!;
        let { pkgName, version, modulePath } = pkgInfo;
        return `requireHasNonStringLiteralSpecifier("${pkgName}", "${version}", ${
          modulePath ? '"' + modulePath + '"' : "undefined"
        })`;
      }
      let pkgInfo = pkgInfoFromSpecifier(specifier);
      if (builtinModules.includes(pkgInfo?.pkgName)) {
        return `requireNodeBuiltin("${pkgInfo!.pkgName}")`;
      }
      if (isLocalJSON(specifier)) {
        return `get${upperFirst(depJSONName(specifier))}`;
      }
      return depFactoryName(specifier);
    });
    let depBindingName = "dependencies";
    let count = 0;
    while (this.desc.declarations.has(depBindingName)) {
      depBindingName = `dependencies${count++}`;
    }
    let newSrc = `${[...imports].join("\n")}
let module;
function implementation() {
  if (!module) {
    module = { exports: {} };
    Function(
      "module",
      "exports",
      "${depBindingName}",
      \`${remapRequires(this.src, this.desc, depBindingName)
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")}\`
    )(module, module.exports, [${deps.join(", ")}]);
  }
  return module.exports;
}
${[...jsonSpecifiers]
  .map(
    (specifier) =>
      `function get${upperFirst(
        depJSONName(specifier)
      )}() { return ${depJSONName(specifier)}; }`
  )
  .join("\n")}

export default implementation;`;
    let nodes: BuilderNode<void>[] = [];
    nodes.push(
      new WriteFileNode(
        new ConstantNode(newSrc),
        new URL(this.outputURL.href.replace(/\.js$/, ".cjs.js"))
      )
    );
    // note that we are only rewriting relatively referenced JSON. We are not
    // rewriting JSON in different packages (this might need to change...)
    for (let specifier of jsonSpecifiers) {
      nodes.push(
        new JSONRewriterNode(
          new URL(specifier, this.inputURL),
          new URL(specifier, this.outputURL)
        )
      );
    }
    return {
      node: new AllNode(nodes),
    };
  }
}

class JSONRewriterNode implements BuilderNode {
  cacheKey: string;
  constructor(private inputURL: URL, private outputURL: URL) {
    this.cacheKey = `json-rewriter:${outputURL.href}`;
  }

  async deps() {
    return {
      json: new FileNode(this.inputURL),
    };
  }

  async run({ json }: { json: string }): Promise<NodeOutput<void>> {
    let obj = JSON.parse(json);
    let varName = "json";
    let counter = 0;
    let safeKeys = Object.keys(obj).filter((key) => key.match(/^\w+$/));
    while (safeKeys.includes(varName)) {
      varName = `json${counter++}`;
    }

    let output: string[] = [`const ${varName} = ${json};`];
    if (safeKeys.length) {
      output.push(`const { ${safeKeys.join(", ")} } = ${varName};`);
    }
    output.push(`export default ${varName};`);
    if (safeKeys.length) {
      output.push(`export { ${safeKeys.join(", ")} };`);
    }
    return {
      node: new WriteFileNode(
        new ConstantNode(output.join("\n")),
        new URL(`${this.outputURL.href}.js`)
      ),
    };
  }
}

class ESModuleShimNode implements BuilderNode {
  cacheKey: string;
  constructor(private outputURL: URL, private desc: CJSDescription) {
    this.cacheKey = `es-shim:${outputURL.href}`;
  }

  async deps() {}

  async run(): Promise<NodeOutput<void[]>> {
    let basename = this.outputURL.pathname.split("/").pop();
    let src: string;
    if (Array.isArray(this.desc.esTranspiledExports)) {
      let exports: string[] = [];
      let nonDefaultExports = this.desc.esTranspiledExports.filter(
        (e) => e !== "default"
      );
      if (nonDefaultExports.length > 0) {
        exports.push(
          `const { ${nonDefaultExports.join(", ")} } = implementation();`
        );
        exports.push(`export { ${nonDefaultExports.join(", ")} };`);
      }
      if (this.desc.esTranspiledExports.includes("default")) {
        exports.push(`export default implementation().default;`);
      }
      src = `import implementation from "./${basename}$cjs$";
${exports.join("\n")}`;
    } else {
      src = `import implementation from "./${basename}$cjs$";
export default implementation();`;
    }
    return {
      node: new AllNode([
        new WriteFileNode(new ConstantNode(src), this.outputURL),
      ]),
    };
  }
}

class AnalyzeFileNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL) {
    this.cacheKey = `analyze-file:${url.href}`;
  }

  async deps() {
    return {
      parsed: new JSParseNode(new FileNode(this.url)),
    };
  }

  async run({ parsed }: { parsed: File }): Promise<Value<FileDescription>> {
    return { value: describeFile(parsed, { filename: this.url.href }) };
  }
}
