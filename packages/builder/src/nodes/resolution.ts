import { BuilderNode, Value, NextNode, AllNode } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint } from "./html";
import { FileNode } from "./file";
import { JSParseNode } from "./js";
import { describeImports } from "../describe-imports";
import { File } from "@babel/types";

export class ModuleResolutionsNode implements BuilderNode {
  cacheKey = this;

  constructor(private projectRoots: URL[]) {}

  deps() {
    let entrypoints: { [href: string]: EntrypointsJSONNode } = {};
    for (let root of this.projectRoots) {
      entrypoints[root.href] = new EntrypointsJSONNode(root);
    }
    return entrypoints;
  }

  async run(projects: {
    [href: string]: HTMLEntrypoint[];
  }): Promise<NextNode<ModuleResolution[]>> {
    let jsEntrypoints: Set<string> = new Set();
    for (let project of Object.values(projects)) {
      for (let entrypoint of project) {
        for (let js of entrypoint.jsEntrypoints.keys()) {
          jsEntrypoints.add(js);
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
  imports: { [specifier: string]: ModuleResolution };
}

class Resolver {
  async resolve(specifier: string, source: URL): Promise<URL> {
    return new URL(specifier, source);
  }
}

class ModuleResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL, private resolver: Resolver) {
    this.cacheKey = `module-resolution-node:${url.href}`;
  }
  deps() {
    return { parsed: new JSParseNode(new FileNode(this.url)) };
  }
  async run({ parsed }: { parsed: File }): Promise<NextNode<ModuleResolution>> {
    let imports = {} as { [specifier: string]: ModuleResolutionNode };
    await Promise.all(
      describeImports(parsed).map(async (desc) => {
        let depURL = await this.resolver.resolve(desc.specifier, this.url);
        imports[desc.specifier] = new ModuleResolutionNode(
          depURL,
          this.resolver
        );
      })
    );
    return { node: new FinishResolutionNode(this.url, imports) };
  }
}

class FinishResolutionNode implements BuilderNode {
  cacheKey: FinishResolutionNode;
  constructor(
    private url: URL,
    private imports: { [specifier: string]: ModuleResolutionNode }
  ) {
    this.cacheKey = this;
  }
  deps() {
    return this.imports;
  }
  async run(imports: {
    [specifier: string]: ModuleResolution;
  }): Promise<Value<ModuleResolution>> {
    return {
      value: {
        url: this.url,
        imports,
      },
    };
  }
}
