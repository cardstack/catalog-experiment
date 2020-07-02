import {
  BuilderNode,
  Value,
  NextNode,
  AllNode,
  annotationRegex,
  ConstantNode,
} from "./common";
import {
  EntrypointsJSONNode,
  HTMLEntrypoint,
  Entrypoint,
  Dependencies,
} from "./entrypoint";
import { FileNode, BundleFileNode } from "./file";
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
    let jsEntrypoints: Map<string, Dependencies | undefined> = new Map();
    for (let project of Object.values(projects)) {
      for (let entrypoint of project) {
        if (entrypoint instanceof HTMLEntrypoint) {
          for (let jsHref of entrypoint.jsEntrypoints.keys()) {
            jsEntrypoints.set(jsHref, entrypoint.dependencies);
          }
        } else {
          jsEntrypoints.set(entrypoint.url.href, entrypoint.dependencies);
        }
      }
    }
    let resolutions = [...jsEntrypoints].map(
      ([jsEntrypoint, dependencies]) =>
        new ModuleResolutionNode(
          new URL(jsEntrypoint),
          new Resolver(),
          this.projectRoots,
          dependencies
        )
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
  }): Promise<NextNode<ModuleDescription>> {
    let match = annotationRegex.exec(source);
    if (match) {
      let desc = decodeModuleDescription(match[1]);
      return { node: new ConstantNode(desc) };
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
    return { value: describeModule(parsed) };
  }
}

export class ModuleResolutionNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private url: URL,
    private resolver: Resolver,
    private projectRoots: [URL, URL][],
    private dependencies: Dependencies | undefined
  ) {
    this.cacheKey = `module-resolution:${url.href}`;
  }
  deps() {
    let fileNode: FileNode;
    let dependencyHrefs = this.dependencies
      ? Object.values(this.dependencies)
      : [];
    let depHref = dependencyHrefs.find(
      (dep) => this.url.href.indexOf(dep) === 0
    );
    if (this.dependencies && depHref) {
      let [inputRoot, outputRoot] = this.projectRoots.find(
        ([, outputRoot]) => depHref === outputRoot.href
      )!;
      fileNode = new BundleFileNode(this.url, inputRoot, outputRoot);
    } else {
      fileNode = new FileNode(this.url);
    }
    return { desc: new ModuleAnnotationNode(fileNode), source: fileNode };
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
        return new ModuleResolutionNode(
          depURL,
          this.resolver,
          this.projectRoots,
          this.dependencies
        );
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
