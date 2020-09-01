import {
  BuilderNode,
  AllNode,
  NodeOutput,
  ConstantNode,
} from "../../../builder-worker/src/nodes/common";
import {
  FileListingNode,
  FileNode,
  WriteFileNode,
} from "../../../builder-worker/src/nodes/file";
import { transform } from "@babel/core";
import { ListingEntry } from "../../../builder-worker/src/filesystem";

export class SrcTransformNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgURL: URL) {
    this.cacheKey = `src-transform:${pkgURL.href}`;
  }

  deps() {
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
        (entry) => entry.stat.type === "file" && entry.url.href.endsWith(".js")
      )
      .map((entry) => entry.url);
    return {
      node: new AllNode(
        urls.map((url) => new BabelTransformNode(url, this.pkgURL))
      ),
    };
  }
}

class BabelTransformNode implements BuilderNode {
  cacheKey: string;
  constructor(private url: URL, private pkgURL: URL) {
    this.cacheKey = `babel-transform:${url.href}`;
  }

  deps() {
    return {
      src: new FileNode(this.url),
    };
  }

  async run({ src }: { src: string }): Promise<NodeOutput<void>> {
    let output = transform(src, {
      // TODO move this list into recipes
      plugins: [
        // TODO add typescript stripping
        "@babel/plugin-transform-flow-strip-types",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-optional-chaining", // for these items that are almost part of the spec, let's move this into our parse config that we use in describe-files
        "@babel/plugin-proposal-numeric-separator",
        ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
        "@babel/plugin-proposal-logical-assignment-operators",
      ],
    });
    if (!output || output.code == null) {
      throw new Error(
        `Empty babel result after babel transform of ${this.url.href}`
      );
    }
    if (output.code === "") {
      return { value: undefined };
    }

    let url = new URL(
      this.url.href.slice(`${this.pkgURL.href}__stage1/`.length),
      `${this.pkgURL}__stage2/`
    );
    return {
      node: new WriteFileNode(new ConstantNode(output.code), url),
    };
  }
}
