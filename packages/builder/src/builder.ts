import { FileSystem } from "./filesystem";
import { parse } from "@babel/core";
import { File } from "@babel/types";
import { describeImports } from "./describe-imports";
import {
  OutputTypes,
  BuilderNode,
  MaybeNode,
  FileNode,
  WriteFileNode,
  EntrypointsJSONNode,
} from "./builder-nodes";

export class Builder<Input> {
  constructor(private fs: FileSystem, private roots: Input) {}

  static forProject(fs: FileSystem, root: URL | string) {
    let url: URL;
    if (typeof root === "string") {
      url = new URL(root);
    } else {
      url = root;
    }
    return new Builder(fs, [new EntrypointsJSONNode(url)]);
  }

  async build(): Promise<OutputTypes<Input>> {
    return await this.evalNodes(this.roots);
  }

  async evalNodes<LocalInput>(
    nodes: LocalInput
  ): Promise<OutputTypes<LocalInput>> {
    let results = {} as OutputTypes<LocalInput>;
    for (let [name, node] of Object.entries(nodes)) {
      (results as any)[name] = await this.evalNode(node);
    }
    return results;
  }

  async evalNode(node: BuilderNode): Promise<unknown> {
    let deps = node.deps();
    let result: MaybeNode<unknown>;
    if (typeof deps === "object" && deps != null) {
      let inputs = await this.evalNodes(deps);
      if (WriteFileNode.isWriteFileNode(node)) {
        let fd = await this.fs.open(node.url, "file");
        await fd.write(Object.values(inputs)[0]);
        result = { value: undefined };
      } else {
        result = await node.run(inputs);
      }
    } else {
      if (FileNode.isFileNode(node)) {
        let fd = await this.fs.open(node.url);
        result = { value: await fd.readText() };
      } else {
        result = await (node as BuilderNode<unknown, void>).run();
      }
    }
    if ("node" in result) {
      return this.evalNode(result.node);
    } else {
      return result.value;
    }
  }
}

interface ResolvedModule {
  url: URL;
  imports: Map<string, ResolvedModule>;
}

interface AssignedModule extends ResolvedModule {
  bundle: URL;
}

class Other {
  private async resolveDependencies(moduleURL: URL): Promise<ResolvedModule> {
    let parsed = await this.parseJS(moduleURL);
    let imports = new Map() as Map<string, ResolvedModule>;
    await Promise.all(
      describeImports(parsed).map(async (desc) => {
        let depURL = await this.resolve(desc.specifier, moduleURL);
        imports.set(desc.specifier, await this.resolveDependencies(depURL));
      })
    );
    return {
      imports,
      url: moduleURL,
    };
  }

  private async assignBundles(
    entryModules: ResolvedModule[]
  ): Promise<AssignedModule[]> {
    for (let m of entryModules) {
      (m as AssignedModule).bundle = new URL(`/dist/0.js`, m.url.origin);
      for (let n of m.imports.values()) {
        await this.assignBundles([n]);
      }
    }
    return entryModules as AssignedModule[];
  }

  private async resolve(specifier: string, source: URL): Promise<URL> {
    return new URL(specifier, source);
  }

  private async parseJS(jsURL: URL): Promise<File> {
    let fd = await this.fs.open(jsURL);
    let stat = fd.stat;
    let cached = this.parseCache.get(jsURL.href);
    if (cached && cached.etag === stat.etag && cached.mtime === stat.mtime) {
      return cached.parsed;
    }
    let parsed = parse(await fd.readText(), {});
    if (!parsed || parsed.type !== "File") {
      throw new Error(`unexpected result from babel parse: ${parsed?.type}`);
    }
    this.parseCache.set(jsURL.href, {
      etag: stat.etag,
      mtime: stat.mtime,
      parsed,
    });
    return parsed;
  }
}
