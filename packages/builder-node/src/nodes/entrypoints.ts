import {
  BuilderNode,
  ConstantNode,
  AllNode,
  NextNode,
} from "../../../builder-worker/src/nodes/common";
import { PackageJSON } from "./package";
import { MakePkgESCompliantNode } from "./cjs-interop";
import { getRecipe } from "../recipes";
import {
  FileExistsNode,
  WriteFileNode,
} from "../../../builder-worker/src/nodes/file";
import {
  Dependencies,
  EntrypointsJSON,
} from "../../../builder-worker/src/nodes/entrypoint";

export class EntrypointsNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgJSON: PackageJSON,
    private pkgURL: URL,
    private esCompliantNode: MakePkgESCompliantNode
  ) {
    this.cacheKey = `pkg-entrypoints:${pkgURL.href}`;
  }

  deps() {
    let { name, version, main } = this.pkgJSON;
    let recipe = getRecipe(name, version);
    let entrypoints = recipe?.entrypoints ?? (main ? [main!] : ["./index.js"]);
    if (entrypoints.length === 0) {
      throw new Error(
        `No entrypoints were specified for the package ${name} ${version} at ${this.pkgURL.href}`
      );
    }

    return {
      esCompliant: this.esCompliantNode,
      entrypoints: new ConstantNode(entrypoints),
      entrypointsExist: new AllNode(
        entrypoints.map(
          (e) => new FileExistsNode(new URL(e, `${this.pkgURL}src/`))
        )
      ),
    };
  }

  async run({
    entrypoints,
    entrypointsExist,
  }: {
    entrypoints: string[];
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
        url: `https://catalogjs.com/pkgs/npm/${name}/`,
        //TODO: this is a bit awkward as npm shoves a lot of things besides the
        // range on the right-hand side of the dep name (src URL, SHA, tag,
        // branch, etc). work with Ed to figure out a better/less npm-ish
        // thing(s) to capture here
        range: range,
      };
    }

    let entrypointsJSON: EntrypointsJSON = {
      js: entrypoints,
      dependencies,
    };

    return {
      node: new WriteFileNode(
        new ConstantNode(JSON.stringify(entrypointsJSON, null, 2)),
        new URL("entrypoints.json", `${this.pkgURL}src/`)
      ),
    };
  }
}
