import {
  BuilderNode,
  Value,
  NextNode,
  AllNode,
  annotationRegex,
  ConstantNode,
} from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { FileNode } from "./file";
import { JSParseNode } from "./js";
import { describeModule, ModuleDescription } from "../describe-module";
import { File } from "@babel/types";
import { decodeModuleDescription } from "../description-encoder";

export class ModuleResolutionsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: [URL, URL][]) {}

  deps() {
    return this.projectRoots.map(
      ([inputRoot, outputRoot]) =>
        new EntrypointsJSONNode(inputRoot, outputRoot)
    );
  }

  async run(projects: {
    [index: string]: Entrypoint[];
  }): Promise<NextNode<ModuleResolution[]>> {
    let jsEntrypoints: Set<string> = new Set();
    for (let project of Object.values(projects)) {
      for (let entrypoint of project) {
        if (entrypoint instanceof HTMLEntrypoint) {
          for (let js of entrypoint.jsEntrypoints.keys()) {
            jsEntrypoints.add(js);
          }
        } else {
          jsEntrypoints.add(entrypoint.url.href);
        }
      }
    }
    let resolutions = [...jsEntrypoints].map(
      (jsEntrypoint) =>
        new ModuleResolutionNode(new URL(jsEntrypoint), new Resolver())
    );
    return { node: new AllNode(resolutions) };
  }
}

export interface ModuleResolution {
  url: URL;
  source: string;
  desc: ModuleDescription;
  resolvedImports: ModuleResolution[];
}

export class Resolver {
  async resolve(specifier: string, source: URL): Promise<URL> {
    return new URL(specifier, source);
  }
}

export class ModuleAnnotationNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL) {
    this.cacheKey = `module-annotation:${url.href}`;
  }
  deps() {
    return { source: new FileNode(this.url) };
  }
  async run({
    source,
  }: {
    source: string;
  }): Promise<NextNode<ModuleDescription>> {
    let match = annotationRegex.exec(source);
    if (match) {
      let desc = decodeModuleDescription(match[1]);
      return { node: new ConstantNode(desc) };
    }
    return { node: new ModuleDescriptionNode(this.url) };
  }
}

export class ModuleDescriptionNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL) {
    this.cacheKey = `module-description:${url.href}`;
  }
  deps() {
    return { parsed: new JSParseNode(new FileNode(this.url)) };
  }
  async run({ parsed }: { parsed: File }): Promise<Value<ModuleDescription>> {
    return { value: describeModule(parsed) };
  }
}

export class ModuleResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL, private resolver: Resolver) {
    this.cacheKey = `module-resolution:${url.href}`;
  }
  deps() {
    let fileNode = new FileNode(this.url);
    return { desc: new ModuleAnnotationNode(this.url), source: fileNode };
  }
  async run({
    desc,
    source,
  }: {
    desc: ModuleDescription;
    source: string;
  }): Promise<NextNode<ModuleResolution>> {
    let imports = await Promise.all(
      desc.imports.map(async (imp) => {
        let depURL = await this.resolver.resolve(imp.specifier, this.url);
        return new ModuleResolutionNode(depURL, this.resolver);
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
    private imports: ModuleResolutionNode[],
    private desc: ModuleDescription,
    private source: string
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.imports;
  }
  async run(resolutions: {
    [importIndex: number]: ModuleResolution;
  }): Promise<Value<ModuleResolution>> {
    return {
      value: {
        url: this.url,
        source: this.source,
        desc: this.desc,
        resolvedImports: this.imports.map((_, index) => resolutions[index]),
      },
    };
  }
}
