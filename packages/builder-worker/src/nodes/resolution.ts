import {
  BuilderNode,
  Value,
  NextNode,
  AllNode,
  annotationRegex,
  NodeOutput,
} from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { FileNode } from "./file";
import { JSParseNode } from "./js";
import {
  describeFile,
  ModuleDescription,
  isModuleDescription,
} from "../describe-file";
import { File } from "@babel/types";
import { decodeModuleDescription } from "../description-encoder";
import { Resolver } from "../resolver";

export class ModuleResolutionsNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    private resolver: Resolver
  ) {
    this.cacheKey = `module-resolutions:input=${projectInput.href},output=${projectOutput.href}`;
  }

  deps() {
    return {
      entrypoints: new EntrypointsJSONNode(
        this.projectInput,
        this.projectOutput
      ),
    };
  }

  async run({
    entrypoints,
  }: {
    entrypoints: Entrypoint[];
  }): Promise<NextNode<(ModuleResolution | CyclicModuleResolution)[]>> {
    let jsEntrypoints: Set<string> = new Set();
    for (let entrypoint of entrypoints) {
      if (entrypoint instanceof HTMLEntrypoint) {
        for (let jsHref of entrypoint.jsEntrypoints.keys()) {
          jsEntrypoints.add(jsHref);
        }
      } else {
        jsEntrypoints.add(entrypoint.url.href);
      }
    }
    let resolutions = [...jsEntrypoints].map(
      (jsEntrypoint) =>
        new ModuleResolutionNode(new URL(jsEntrypoint), this.resolver)
    );
    return { node: new AllNode(resolutions) };
  }
}

export interface ModuleResolution {
  type: "standard";
  url: URL;
  source: string;
  desc: ModuleDescription;
  resolvedImports: (ModuleResolution | CyclicModuleResolution)[];
}

export interface CyclicModuleResolution {
  type: "cyclic";
  url: URL;
  desc: ModuleDescription;
  imports: URL[];
  hrefStack: string[];
}

export function isCyclicModuleResolution(
  resolution: ModuleResolution | CyclicModuleResolution
): resolution is CyclicModuleResolution {
  return resolution.type === "cyclic";
}

export class ModuleAnnotationNode implements BuilderNode {
  cacheKey: string;
  constructor(private fileNode: FileNode) {
    this.cacheKey = `module-annotation:${fileNode.url.href}`;
  }
  deps() {
    return { source: this.fileNode };
  }
  async run({
    source,
  }: {
    source: string;
  }): Promise<NodeOutput<ModuleDescription>> {
    let match = annotationRegex.exec(source);
    if (match) {
      let value = decodeModuleDescription(match[1]);
      return { value };
    }
    return { node: new ModuleDescriptionNode(this.fileNode) };
  }
}

export class ModuleDescriptionNode implements BuilderNode {
  cacheKey: string;
  constructor(private fileNode: FileNode) {
    this.cacheKey = `module-description:${fileNode.url.href}`;
  }
  deps() {
    return { parsed: new JSParseNode(this.fileNode) };
  }
  async run({ parsed }: { parsed: File }): Promise<Value<ModuleDescription>> {
    let desc = describeFile(parsed);
    if (!isModuleDescription(desc)) {
      throw Error(
        `cannot build module description for CJS file ${this.fileNode.url.href}`
      );
    }
    return { value: desc };
  }
}

export class CyclicModuleResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private url: URL,
    private resolver: Resolver,
    private stack: string[]
  ) {
    this.cacheKey = `cyclic-module-resolution:${url.href},stack:${stack.join(
      ","
    )}`;
  }

  deps() {
    let fileNode = new FileNode(this.url);
    return { desc: new ModuleAnnotationNode(fileNode) };
  }
  async run({
    desc,
  }: {
    desc: ModuleDescription;
  }): Promise<Value<CyclicModuleResolution>> {
    return {
      value: {
        type: "cyclic",
        url: this.url,
        desc,
        hrefStack: this.stack,
        imports: await Promise.all(
          desc.imports.map((imp) =>
            this.resolver.resolve(imp.specifier, this.url)
          )
        ),
      },
    };
  }
}

export class ModuleResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private url: URL,
    private resolver: Resolver,
    private stack: string[] = []
  ) {
    this.cacheKey = `module-resolution:${url.href}`;
  }
  deps() {
    let fileNode = new FileNode(this.url);
    return { desc: new ModuleAnnotationNode(fileNode), source: fileNode };
  }
  async run({
    desc,
    source,
  }: {
    desc: ModuleDescription;
    source: string;
  }): Promise<NextNode<ModuleResolution | CyclicModuleResolution>> {
    let imports: (ModuleResolutionNode | CyclicModuleResolutionNode)[];
    imports = await Promise.all(
      desc.imports.map(async (imp) => {
        let depURL = await this.resolver.resolve(imp.specifier, this.url);
        if (this.stack.includes(depURL.href)) {
          return new CyclicModuleResolutionNode(depURL, this.resolver, [
            ...this.stack,
            this.url.href,
          ]);
        } else {
          return new ModuleResolutionNode(depURL, this.resolver, [
            ...this.stack,
            this.url.href,
          ]);
        }
      })
    );
    source = source.replace(annotationRegex, "");

    return {
      node: new FinishResolutionNode(this.url, imports, desc, source),
    };
  }
}

class FinishResolutionNode implements BuilderNode {
  cacheKey: FinishResolutionNode;
  constructor(
    private url: URL,
    private imports: (ModuleResolutionNode | CyclicModuleResolutionNode)[],
    private desc: ModuleDescription,
    private source: string
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.imports;
  }
  async run(resolutions: {
    [importIndex: number]: ModuleResolution | CyclicModuleResolution;
  }): Promise<Value<ModuleResolution>> {
    return {
      value: {
        type: "standard",
        url: this.url,
        source: this.source,
        desc: this.desc,
        resolvedImports: this.imports.map((_, index) => resolutions[index]),
      },
    };
  }
}
