import { BuilderNode, Value, NextNode, AllNode } from "./common";
import { EntrypointsJSONNode, HTMLEntrypoint } from "./html";
import { FileNode } from "./file";
import { JSParseNode } from "./js";
import {
  describeModule,
  ImportDescription,
  ExportDescription,
} from "../describe-module";
import { File } from "@babel/types";
import mapValues from "lodash/mapValues";

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
  parsed: File;
  exports: ExportDescription;
  imports: {
    [specifier: string]: {
      desc: ImportDescription;
      resolution: ModuleResolution;
    };
  };
}

interface SpecifierNodes {
  [specifier: string]: {
    desc: ImportDescription;
    resolution: ModuleResolutionNode;
  };
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
    return { parsed: new JSParseNode(new FileNode(this.url)) };
  }
  async run({ parsed }: { parsed: File }): Promise<NextNode<ModuleResolution>> {
    let imports: SpecifierNodes = {};
    let desc = describeModule(parsed);
    await Promise.all(
      desc.imports.map(async (imp) => {
        let depURL = await this.resolver.resolve(imp.specifier, this.url);
        imports[imp.specifier] = {
          desc: imp,
          resolution: new ModuleResolutionNode(depURL, this.resolver),
        };
      })
    );
    return {
      node: new FinishResolutionNode(this.url, imports, desc.exports, parsed),
    };
  }
}

class FinishResolutionNode implements BuilderNode {
  cacheKey: FinishResolutionNode;
  constructor(
    private url: URL,
    private imports: SpecifierNodes,
    private exports: ExportDescription,
    private parsed: File
  ) {
    this.cacheKey = this;
  }
  deps() {
    return mapValues(this.imports, ({ resolution }) => resolution);
  }
  async run(resolutions: {
    [specifier: string]: ModuleResolution;
  }): Promise<Value<ModuleResolution>> {
    return {
      value: {
        url: this.url,
        parsed: this.parsed,
        exports: this.exports,
        imports: mapValues(this.imports, ({ desc }, specifier) => ({
          desc,
          resolution: resolutions[specifier],
        })),
      },
    };
  }
}