import {
  BuilderNode,
  AllNode,
  NodeOutput,
  ConstantNode,
  RecipeGetter,
} from "../../../builder-worker/src/nodes/common";
import {
  FileListingNode,
  FileNode,
  WriteFileNode,
} from "../../../builder-worker/src/nodes/file";
import { transform } from "@babel/core";
import { ListingEntry } from "../../../builder-worker/src/filesystem";
import { PackageJSON } from "./package";

export class SrcTransformNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL, private pkgJSON: PackageJSON) {
    this.cacheKey = `src-transform:${pkgURL.href}`;
  }

  async deps() {
    return {
      listingEntries: new FileListingNode(
        new URL("__stage1/", this.pkgURL),
        true
      ),
    };
  }

  async run({
    listingEntries,
  }: {
    listingEntries: ListingEntry[];
  }): Promise<NodeOutput<void[]>> {
    let urls = listingEntries
      .filter(
        (entry) =>
          entry.stat.type === "file" &&
          // TODO what about .ts?
          (entry.url.href.endsWith(".js") || entry.url.href.endsWith(".json"))
      )
      .map((entry) => entry.url);
    return {
      node: new AllNode(
        urls.map(
          (url) => new BabelTransformNode(url, this.pkgURL, this.pkgJSON)
        )
      ),
    };
  }
}

class BabelTransformNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private url: URL,
    private pkgURL: URL,
    private pkgJSON: PackageJSON
  ) {
    this.cacheKey = `babel-transform:${url.href}`;
  }

  async deps() {
    return {
      src: new FileNode(this.url),
    };
  }

  async run(
    { src }: { src: string },
    getRecipe: RecipeGetter
  ): Promise<NodeOutput<void>> {
    let code: string;
    if (this.url.href.endsWith(".json")) {
      code = src;
    } else {
      let { name, version } = this.pkgJSON;
      let { babelPlugins: plugins = [] } =
        (await getRecipe(name, version)) ?? {};
      let output = transform(src, { plugins, comments: false });
      if (!output || output.code == null) {
        throw new Error(
          `Empty babel result after babel transform of ${this.url.href}`
        );
      }
      code = output.code || "export {};";
    }
    let url = new URL(
      this.url.href.slice(`${this.pkgURL.href}__stage1/`.length),
      `${this.pkgURL}__stage2/`
    );
    return {
      node: new WriteFileNode(new ConstantNode(code), url),
    };
  }
}
