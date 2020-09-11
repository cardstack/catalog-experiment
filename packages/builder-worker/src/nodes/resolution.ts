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

  async deps() {
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
  resolvedImportsWithCyclicGroups: (ModuleResolution | ModuleResolution[])[];
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
  async deps() {
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
  async deps() {
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
    this.cacheKey = `cyclic-module-resolution:${url.href}`;
  }

  async deps() {
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
  async deps() {
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
  async deps() {
    return this.imports;
  }
  async run(resolutions: {
    [importIndex: number]: ModuleResolution | CyclicModuleResolution;
  }): Promise<Value<ModuleResolution>> {
    let module: ModuleResolution = {
      type: "standard",
      url: this.url,
      source: this.source,
      desc: this.desc,
      resolvedImports: this.imports.map((_, index) => resolutions[index]),
      resolvedImportsWithCyclicGroups: [],
    };

    // We accept that whoever first encounters a cyclic edge in our module
    // resolution determines the order that modules evaluate in. This means that
    // javascript that uses cyclic imports and is relying on a particular order
    // of evaluation based on a particular entrypoint may be evaluated in a
    // different order. However, reliance on order of evaluation with cyclic
    // imports is probably in poor form, as the order of evaluation can change
    // depending on the entrypoint used.

    // we are not interested in cycles this module is within nor cycles consumed
    // by this module's dependencies, rather we are only interested in cycles this
    // module directly consumes
    let cycles = gatherCyclicDependencies(module).filter(
      (cycle) =>
        !cycle.find((m) => m.url.href === this.url.href) &&
        module.resolvedImports
          .map((i) => i.url.href)
          .includes(cycle[0].url.href)
    );
    module.resolvedImportsWithCyclicGroups = module.resolvedImports
      .filter((m) => !isCyclicModuleResolution(m))
      .map(
        (m) => cycles.find((cycle) => cycle[0].url.href === m.url.href) ?? m
      ) as (ModuleResolution | ModuleResolution[])[];
    return {
      value: module,
    };
  }
}

function gatherCyclicDependencies(
  module: ModuleResolution,
  stack: ModuleResolution[] = []
): ModuleResolution[][] {
  let cycles: ModuleResolution[][] = [];
  for (let dep of module.resolvedImports) {
    if (isCyclicModuleResolution(dep)) {
      cycles = [
        ...cycles,
        [
          ...stack.slice(stack.findIndex((m) => m.url.href === dep.url.href)),
          module,
        ],
      ];
    } else {
      cycles = [
        ...cycles,
        ...gatherCyclicDependencies(dep, [...stack, module]),
      ];
    }
  }
  return cycles;
}
