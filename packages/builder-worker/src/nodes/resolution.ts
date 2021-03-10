import {
  BuilderNode,
  Value,
  NextNode,
  AllNode,
  NodeOutput,
  ConstantNode,
  RecipeGetter,
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
import { extractDescriptionFromSource } from "../description-encoder";
import { Resolver, pkgInfoFromCatalogJsURL } from "../resolver";
import { LockFile, GetLockFileNode, LockEntries } from "./lock-file";

export class ModuleResolutionsNode implements BuilderNode {
  cacheKey: string;

  constructor(
    private projectInput: URL,
    private projectOutput: URL,
    private resolver: Resolver,
    private seededResolutions: LockEntries
  ) {
    this.cacheKey = `module-resolutions:input=${projectInput.href},output=${
      projectOutput.href
    },seededResolutions=${JSON.stringify(seededResolutions)}`;
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
  }): Promise<
    NextNode<{ resolutions: Resolution[]; lockEntries: LockEntries }>
  > {
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
        new ModuleResolutionNode(
          new URL(jsEntrypoint),
          this.resolver,
          this.projectInput,
          this.seededResolutions
        )
    );
    return {
      node: new FinishModuleResolutionsNode(
        this.projectInput,
        this.projectOutput,
        this.seededResolutions,
        resolutions
      ),
    };
  }
}

export class FinishModuleResolutionsNode implements BuilderNode {
  cacheKey: string;
  constructor(
    projectInput: URL,
    projectOutput: URL,
    seededResolutions: LockEntries,
    private resolutionNodes: ModuleResolutionNode[]
  ) {
    this.cacheKey = `finish-module-resolutions:input=${projectInput.href},output=${projectOutput.href},seededResolutions=${seededResolutions}`;
  }

  async deps() {
    return {
      results: new AllNode(this.resolutionNodes),
    };
  }
  async run({
    results,
  }: {
    results: { resolution: ModuleResolution; lockEntries: LockEntries }[];
  }): Promise<Value<{ resolutions: Resolution[]; lockEntries: LockEntries }>> {
    let lockEntries = Object.assign(
      {},
      ...results.map(({ lockEntries }) => lockEntries)
    );
    let resolutions = results.map(({ resolution }) => resolution);
    return { value: { resolutions, lockEntries } };
  }
}

export type Resolution = ModuleResolution | CyclicModuleResolution;

export interface ModuleResolution {
  type: "standard";
  url: URL;
  source: string;
  desc: ModuleDescription;
  resolvedImports: Resolution[];
  resolvedImportsWithCyclicGroups: (ModuleResolution | ModuleResolution[])[];
}

export interface CyclicModuleResolution {
  type: "cyclic";
  url: URL;
  desc: ModuleDescription;
  hrefStack: string[];
  cyclicGroup: Set<ModuleResolution>;
}

export function isCyclicModuleResolution(
  resolution: ModuleResolution | CyclicModuleResolution
): resolution is CyclicModuleResolution {
  return resolution.type === "cyclic";
}

export function makeNonCyclic(resolution: Resolution): ModuleResolution {
  if (!isCyclicModuleResolution(resolution)) {
    return resolution;
  }
  return [...resolution.cyclicGroup].find(
    (m) => m.url.href === resolution.url.href
  )!;
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
  }): Promise<NodeOutput<{ desc: ModuleDescription; source: string }>> {
    let { source: unannotatedSource, desc } = extractDescriptionFromSource(
      source
    );
    if (desc) {
      return { value: { desc, source: unannotatedSource } };
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
    return {
      source: this.fileNode,
      parsed: new JSParseNode(this.fileNode),
    };
  }
  async run({
    source,
    parsed,
  }: {
    source: string;
    parsed: File;
  }): Promise<Value<{ desc: ModuleDescription; source: string }>> {
    let desc = describeFile(parsed, this.fileNode.url.href);
    if (!isModuleDescription(desc)) {
      throw Error(
        `cannot build module description for CJS file ${this.fileNode.url.href}`
      );
    }
    return { value: { desc, source } };
  }
}

// TODO we should add some logic such that we can tell if the module resolution
// is different for rebuilds and return an unchanged result if we see that
// module resolution is the same.
export class ModuleResolutionNode
  implements BuilderNode<{ resolution: Resolution; lockEntries: LockEntries }> {
  cacheKey: ModuleResolutionNode | string;
  constructor(
    private url: URL,
    private resolver: Resolver,
    private projectInput: URL,
    private lockEntries: LockEntries = {},
    private stack: string[] = []
  ) {
    this.cacheKey = `module-resolution:${url.href}`;
  }

  async deps() {
    return {
      info: new ModuleAnnotationNode(new FileNode(this.url)),
    };
  }
  async run(
    {
      info: { desc, source },
    }: {
      info: { desc: ModuleDescription; source: string };
    },
    getRecipe: RecipeGetter
  ): Promise<NextNode<{ resolution: Resolution; lockEntries: LockEntries }>> {
    let recipeResolutions: { [specifier: string]: string } | undefined;
    let { pkgName: sourcePkgName, version: sourcePkgVersion } =
      pkgInfoFromCatalogJsURL(this.url) ?? {};
    if (sourcePkgName && sourcePkgVersion) {
      recipeResolutions = (await getRecipe(sourcePkgName, sourcePkgVersion))
        ?.resolutions;
    }

    let urlNodes = await Promise.all(
      desc.imports.map(async (imp) => {
        if (recipeResolutions) {
          let href = recipeResolutions?.[imp.specifier!];
          if (href) {
            return new ConstantNode(new URL(href));
          }
        }
        return new ResolveFromLock(imp.specifier!, this.url, {
          ...this.lockEntries,
        });
      })
    );
    return {
      node: new FinishResolutionsFromLockNode(
        urlNodes,
        this.url,
        desc,
        source,
        this.resolver,
        this.projectInput,
        { ...this.lockEntries },
        this.stack
      ),
    };
  }
}

export class ResolveFromLock implements BuilderNode<URL | undefined> {
  cacheKey: string;
  constructor(
    private specifier: string,
    private moduleURL: URL,
    private lockEntries: LockEntries
  ) {
    this.cacheKey = `resolve-from-lock:${this.specifier},module=${moduleURL.href}`;
  }

  async deps() {
    return {
      lockFile: new GetLockFileNode(this.moduleURL),
    };
  }

  async run({
    lockFile,
  }: {
    lockFile: LockFile | undefined;
  }): Promise<Value<URL | undefined>> {
    let locks = new Map<string, URL>([
      ...new Map(
        Object.entries(lockFile ?? {}).map(([pkgName, lockHref]) => [
          pkgName,
          new URL(lockHref),
        ])
      ),
      ...Object.entries(this.lockEntries),
    ]);
    let resolution = locks.get(this.specifier);
    return { value: resolution };
  }
}

class FinishResolutionsFromLockNode implements BuilderNode {
  cacheKey: FinishResolutionsFromLockNode;
  constructor(
    private depURLNodes: BuilderNode<URL | undefined>[],
    private consumerURL: URL,
    private consumerDesc: ModuleDescription,
    private consumerSource: string,
    private resolver: Resolver,
    private projectInput: URL,
    private lockEntries: LockEntries,
    private stack: string[]
  ) {
    this.cacheKey = this;
  }

  async deps() {
    return {
      urls: new AllNode(this.depURLNodes),
    };
  }
  async run({
    urls,
  }: {
    urls: (URL | undefined)[];
  }): Promise<NextNode<{ resolution: Resolution; lockEntries: LockEntries }>> {
    let depNodes = await Promise.all(
      this.consumerDesc.imports.map(async (imp, index) => {
        if (urls[index]) {
          return new ConstantNode({
            resolution: urls[index]!,
            lockEntries: { ...this.lockEntries },
          });
        }
        return await this.resolver.resolveAsBuilderNode(
          imp.specifier!,
          this.consumerURL,
          this.projectInput
        );
      })
    );
    return {
      node: new FinishResolutionsFromResolverNode(
        depNodes,
        this.consumerURL,
        this.consumerDesc,
        this.consumerSource,
        this.resolver,
        this.projectInput,
        { ...this.lockEntries },
        this.stack
      ),
    };
  }
}
class FinishResolutionsFromResolverNode implements BuilderNode {
  cacheKey: FinishResolutionsFromResolverNode;
  constructor(
    private depURLNodes: BuilderNode<{
      resolution: URL;
      lockEntries: LockEntries;
    }>[],
    private consumerURL: URL,
    private consumerDesc: ModuleDescription,
    private consumerSource: string,
    private resolver: Resolver,
    private projectInput: URL,
    private lockEntries: LockEntries,
    private stack: string[]
  ) {
    this.cacheKey = this;
  }

  async deps() {
    return {
      deps: new AllNode(this.depURLNodes),
    };
  }

  async run({
    deps,
  }: {
    deps: { resolution: URL; lockEntries: LockEntries }[];
  }): Promise<NextNode<{ resolution: Resolution; lockEntries: LockEntries }>> {
    let mergedLockEntries = Object.assign(
      {},
      this.lockEntries,
      ...deps.map(({ lockEntries }) => lockEntries)
    );
    let imports = deps.map(({ resolution: url }) => {
      if (this.stack.includes(url.href)) {
        return new CyclicModuleResolutionNode(url, [
          ...this.stack,
          this.consumerURL.href,
        ]);
      } else {
        return new ModuleResolutionNode(
          url,
          this.resolver,
          this.projectInput,
          mergedLockEntries,
          [...this.stack, this.consumerURL.href]
        );
      }
    });

    return {
      node: new FinishResolutionNode(
        this.consumerURL,
        imports,
        this.consumerDesc,
        this.consumerSource,
        mergedLockEntries
      ),
    };
  }
}

export class CyclicModuleResolutionNode
  implements BuilderNode<{ resolution: Resolution; lockEntries: LockEntries }> {
  cacheKey: CyclicModuleResolutionNode | string;
  constructor(private url: URL, private stack: string[]) {
    this.cacheKey = `cyclic-module-resolution:${url.href}`;
  }

  async deps() {
    return {
      info: new ModuleAnnotationNode(new FileNode(this.url)),
    };
  }
  async run({
    info: { desc },
  }: {
    info: { desc: ModuleDescription; source: string };
  }): Promise<
    Value<{ resolution: CyclicModuleResolution; lockEntries: LockEntries }>
  > {
    return {
      value: {
        resolution: {
          type: "cyclic",
          url: this.url,
          desc,
          hrefStack: this.stack,
          cyclicGroup: new Set(), // we patch this as we exit the recursion stack
        },
        lockEntries: {},
      },
    };
  }
}

class FinishResolutionNode implements BuilderNode {
  cacheKey: FinishResolutionNode;
  constructor(
    private url: URL,
    private imports: BuilderNode[],
    private desc: ModuleDescription,
    private source: string,
    private lockEntries: LockEntries
  ) {
    this.cacheKey = this;
  }
  async deps() {
    return this.imports;
  }
  async run(resolutions: {
    [importIndex: number]: { resolution: Resolution; lockEntries: LockEntries };
  }): Promise<
    Value<{ resolution: ModuleResolution; lockEntries: LockEntries }>
  > {
    let mergedLockEntries = Object.assign(
      {},
      this.lockEntries,
      ...Object.values(resolutions).map(({ lockEntries }) => lockEntries)
    );
    let module: ModuleResolution = {
      type: "standard",
      url: this.url,
      source: this.source,
      desc: this.desc,
      resolvedImports: this.imports.map(
        (_, index) => resolutions[index].resolution
      ),
      resolvedImportsWithCyclicGroups: [],
    };

    // We accept that whoever first encounters a cyclic edge in our module
    // resolution determines the order that modules evaluate in. This means that
    // javascript that uses cyclic imports and is relying on a particular order
    // of evaluation based on a particular entrypoint may be evaluated in a
    // different order. However, reliance on order of evaluation with cyclic
    // imports is probably in poor form, as the order of evaluation can change
    // depending on the entrypoint used.

    let cycles = gatherCyclicDependencies(module);

    // patch the CyclicResolution with the resolutions that are in their cycle
    for (let cycle of cycles) {
      let terminatingModule = cycle[cycle.length - 1];
      for (let cyclicResolution of terminatingModule.resolvedImports.filter(
        (i) => isCyclicModuleResolution(i)
      ) as CyclicModuleResolution[]) {
        cyclicResolution.cyclicGroup = new Set([
          ...[...cyclicResolution.cyclicGroup],
          ...cycle,
        ]);
      }
    }

    // for the module that is consuming the cycle: we are not interested in
    // cycles this module is within nor cycles consumed by this module's
    // dependencies, rather we are only interested in cycles this module
    // directly consumes
    let consumedCycles = cycles.filter(
      (cycle) =>
        !cycle.find((m) => m.url.href === this.url.href) &&
        module.resolvedImports
          .map((i) => i.url.href)
          .includes(cycle[0].url.href)
    );
    module.resolvedImportsWithCyclicGroups = module.resolvedImports
      .filter((m) => !isCyclicModuleResolution(m))
      .map(
        (m) =>
          consumedCycles.find((cycle) => cycle[0].url.href === m.url.href) ?? m
      ) as (ModuleResolution | ModuleResolution[])[];
    return {
      value: { resolution: module, lockEntries: mergedLockEntries },
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
