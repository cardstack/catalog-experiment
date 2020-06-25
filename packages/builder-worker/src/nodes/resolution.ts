import { BuilderNode, Value, NextNode, AllNode } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint, Entrypoint } from "./entrypoint";
import { FileNode } from "./file";
import { JSParseNode } from "./js";
import { describeModule, ModuleDescription } from "../describe-module";
import { File } from "@babel/types";

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

export class ModuleResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL, private resolver: Resolver) {
    this.cacheKey = `module-resolution:${url.href}`;
  }
  deps() {
    let fileNode = new FileNode(this.url);
    return { parsed: new JSParseNode(fileNode), source: fileNode };
  }
  async run({
    parsed,
    source,
  }: {
    parsed: File;
    source: string;
  }): Promise<NextNode<ModuleResolution>> {
    let desc = describeModule(parsed);
    let imports = await Promise.all(
      desc.imports.map(async (imp) => {
        let depURL = await this.resolver.resolve(imp.specifier, this.url);
        return new ModuleResolutionNode(depURL, this.resolver);
      })
    );
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
