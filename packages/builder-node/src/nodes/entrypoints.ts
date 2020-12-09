import {
  BuilderNode,
  ConstantNode,
  AllNode,
  NextNode,
  RecipeGetter,
} from "../../../builder-worker/src/nodes/common";
import { PackageJSON, buildSrcDir } from "./package";
import {
  FileExistsNode,
  WriteFileNode,
} from "../../../builder-worker/src/nodes/file";
import {
  Dependencies,
  EntrypointsJSON,
} from "../../../builder-worker/src/nodes/entrypoint";
import { MakePkgESCompliantNode } from "./cjs-interop";

export class EntrypointsNode implements BuilderNode {
  cacheKey: string;
  private jsEntrypoints: string[] = [];
  constructor(
    private pkgJSON: PackageJSON,
    private pkgURL: URL,
    private esCompliantNode: MakePkgESCompliantNode
  ) {
    this.cacheKey = `pkg-entrypoints:${pkgURL.href}`;
  }

  async deps(getRecipe: RecipeGetter) {
    let { name, version, main } = this.pkgJSON;
    let recipe = await getRecipe(name, version);
    let entrypoints = recipe?.entrypoints ?? (main ? [main!] : ["./index.js"]);
    if (entrypoints.length === 0) {
      throw new Error(
        `No entrypoints were specified for the package ${name} ${version} at ${this.pkgURL.href}`
      );
    }
    this.jsEntrypoints = entrypoints;

    return {
      esCompliance: this.esCompliantNode,
      entrypointsExist: new AllNode(
        entrypoints.map(
          (e) => new FileExistsNode(new URL(e, `${this.pkgURL}${buildSrcDir}`))
        )
      ),
    };
  }

  async run({
    entrypointsExist,
  }: {
    entrypointsExist: boolean[];
  }): Promise<NextNode<void>> {
    let { name, version } = this.pkgJSON;
    if (entrypointsExist.some((exist) => !exist)) {
      throw new Error(
        `The package is missing entrypoint(s) files for the package ${name} ${version} at ${this.pkgURL.href}`
      );
    }
    let dependencies: Dependencies = {};
    for (let [name, range] of Object.entries(this.pkgJSON.dependencies ?? {})) {
      dependencies[name] = {
        type: "npm",
        pkgName: name,
        range,
      };
    }

    let entrypointsJSON: EntrypointsJSON = {
      js: this.jsEntrypoints,
      dependencies,
    };

    return {
      node: new WriteFileNode(
        new ConstantNode(JSON.stringify(entrypointsJSON, null, 2)),
        new URL("entrypoints.json", `${this.pkgURL}${buildSrcDir}`)
      ),
    };
  }
}
