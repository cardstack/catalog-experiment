import {
  BuilderNode,
  Value,
  AllNode,
  ConstantNode,
  NodeOutput,
  NextNode,
} from "../../../builder-worker/src/nodes/common";
import {
  catalogjsHref,
  pkgInfoFromCatalogJsURL,
} from "../../../builder-worker/src/resolver";
import { createHash } from "crypto";
import _glob from "glob";
import {
  WriteFileNode,
  FileListingNode,
  FileNode,
} from "../../../builder-worker/src/nodes/file";
import { ListingEntry } from "../../../builder-worker/src/filesystem";
import {
  LockEntries,
  WriteLockFileNode,
} from "../../../builder-worker/src/nodes/lock-file";
import { buildOutputDir, buildSrcDir } from "./package";
import {
  addDescriptionToSource,
  extractDescriptionFromSource,
} from "../../../builder-worker/src/description-encoder";
import groupBy from "lodash/groupBy";
import { declarationsMap } from "../../../builder-worker/src/describe-file";

export class MakePackageHashNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgWorkingURL: URL,
    private writeLockFileNode: WriteLockFileNode
  ) {
    this.cacheKey = `make-pkg-hash:${pkgWorkingURL.href}`;
  }
  async deps() {
    return {
      lockEntries: this.writeLockFileNode,
    };
  }

  async run({
    lockEntries,
  }: {
    lockEntries: LockEntries;
  }): Promise<Value<string>> {
    let pkgInfo = pkgInfoFromCatalogJsURL(this.pkgWorkingURL);
    if (!pkgInfo || !pkgInfo.version) {
      throw new Error(
        `bug: cannot determine pkg name nor version from URL ${this.pkgWorkingURL.href}`
      );
    }
    let { pkgName, version } = pkgInfo;
    // there might be entries in the lock file that are different entrypoints of
    // the same package version--flatten these down so that we are only considering the
    // pkgs themselves.
    let pkgInfos = [...lockEntries.values()].map((url) =>
      pkgInfoFromCatalogJsURL(url)
    );
    let pkgGroups = groupBy(
      pkgInfos,
      (pkgInfo) =>
        `${catalogjsHref}${pkgInfo!.registry ? pkgInfo!.registry + "/" : ""}${
          pkgInfo!.pkgName
        }/${pkgInfo!.version}/${pkgInfo!.hash}/`
    );

    let depHrefs = Object.keys(pkgGroups).sort();
    let hash = createHash("sha1")
      .update(`${pkgName}${version}${depHrefs.join("")}`)
      .digest("base64")
      .replace(/\//g, "-");
    return { value: hash };
  }
}

export class PackageFinalURLNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgWorkingURL: URL,
    private writeLockFileNode: WriteLockFileNode
  ) {
    this.cacheKey = `pkg-final-url:${pkgWorkingURL.href}`;
  }

  async deps() {
    return {
      hash: new MakePackageHashNode(this.pkgWorkingURL, this.writeLockFileNode),
    };
  }

  async run({ hash }: { hash: string }): Promise<Value<URL>> {
    let pkgInfo = pkgInfoFromCatalogJsURL(this.pkgWorkingURL);
    if (!pkgInfo || !pkgInfo.version) {
      throw new Error(
        `bug: cannot determine pkg name nor version from URL ${this.pkgWorkingURL.href}`
      );
    }
    let { pkgName, version } = pkgInfo;
    return {
      value: new URL(`${catalogjsHref}npm/${pkgName}/${version}/${hash}/`),
    };
  }
}

export class PreparePackagePublishNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgWorkingURL: URL,
    private writeLockFileNode: WriteLockFileNode
  ) {
    this.cacheKey = `prepare-pkg-publish:${pkgWorkingURL.href}`;
  }

  async deps() {
    return {
      pkgFinalURL: new PackageFinalURLNode(
        this.pkgWorkingURL,
        this.writeLockFileNode
      ),
      lockEntries: this.writeLockFileNode,
    };
  }

  async run({ pkgFinalURL }: { pkgFinalURL: URL }): Promise<Value<URL>> {
    return { value: pkgFinalURL };
  }
}

export class PublishPackageNode implements BuilderNode {
  cacheKey: string;
  constructor(private pkgWorkingURL: URL, private lockEntries: LockEntries) {
    this.cacheKey = `publish-pkg:${pkgWorkingURL.href}`;
  }

  async deps() {
    let writeLockFile = new WriteLockFileNode(
      this.pkgWorkingURL,
      this.lockEntries
    ); // this outputs lock entries that are merged with a lock file if it exists..
    return {
      pkgFinalURL: new PreparePackagePublishNode(
        this.pkgWorkingURL,
        writeLockFile
      ),
      listingEntries: new FileListingNode(
        new URL(buildOutputDir, this.pkgWorkingURL),
        true
      ),
      finalLockEntries: writeLockFile,
    };
  }
  async run({
    pkgFinalURL,
    listingEntries,
    finalLockEntries,
  }: {
    pkgFinalURL: URL;
    listingEntries: ListingEntry[];
    finalLockEntries: LockEntries;
  }): Promise<NextNode<URL>> {
    return {
      node: new FinishPackagePublishNode(
        this.pkgWorkingURL,
        pkgFinalURL,
        listingEntries,
        finalLockEntries.size > 0
      ),
    };
  }
}

class FinishPackagePublishNode implements BuilderNode {
  cacheKey: FinishPackagePublishNode;
  private lockFileURL: URL;
  constructor(
    private pkgWorkingURL: URL,
    private pkgFinalURL: URL,
    private listingEntries: ListingEntry[],
    private hasLockFile: boolean
  ) {
    this.cacheKey = this;
    this.lockFileURL = new URL("catalogjs.lock", pkgWorkingURL);
  }

  async deps() {
    return {
      publish: new AllNode([
        ...this.listingEntries
          .filter(({ stat }) => stat.type === "file")
          .map(
            ({ url }) =>
              new PublishFileNode(url, this.pkgFinalURL, this.pkgWorkingURL)
          ),
        ...(this.hasLockFile
          ? [
              new PublishFileNode(
                this.lockFileURL,
                this.pkgFinalURL,
                this.pkgWorkingURL
              ),
            ]
          : []),
        new PublishFileNode(
          new URL(`${buildSrcDir}entrypoints.json`, this.pkgWorkingURL),
          this.pkgFinalURL,
          this.pkgWorkingURL
        ),
      ]),
    };
  }

  async run(): Promise<Value<URL>> {
    return { value: this.pkgFinalURL };
  }
}

class PublishFileNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private url: URL,
    private pkgFinalURL: URL,
    private pkgWorkingURL: URL
  ) {
    this.cacheKey = `publish-pkg:${url.href}`;
  }

  async deps() {
    return { contents: new FileNode(this.url) };
  }

  async run({ contents }: { contents: string }): Promise<NodeOutput<void>> {
    let url = new URL(
      this.url.href.split(buildOutputDir)[1] ?? this.url.href.split("/").pop(), // this is to handle the lock file which is placed at the root of the pkgWorkingURL
      this.pkgFinalURL
    );

    // we need to make sure that in the bundle annotation we update any
    // working pkg URLs in the original.moduleHref to the final pkg URL, as at
    // the time input root folder was created for the pkg, it was not possible
    // to know the final URL (which requires knowledge of all the pkg deps
    // that we discover along the way). The working URLs are fine to
    // disambiguate the same pkgs that have different consumers in the
    // node_modules tree, but the working URL is not capable of detecting
    // changes to transitive dependencies like the final pkg URL can (because
    // the final pkg URL includes a hash of the lock file).
    let { source, desc } = extractDescriptionFromSource(contents);
    if (desc) {
      for (let region of desc.regions) {
        if (
          region.original ||
          (region.type === "declaration" &&
            region.declaration.type === "local" &&
            region.declaration.original)
        ) {
          let original =
            region.type === "declaration" &&
            region.declaration.type === "local" &&
            region.declaration.original
              ? region.declaration.original!
              : region.original!;
          if (
            original.bundleHref &&
            original.bundleHref.startsWith(
              `${this.pkgWorkingURL.href}${buildSrcDir}`
            )
          ) {
            original.bundleHref = original.bundleHref.replace(
              `${this.pkgWorkingURL.href}${buildSrcDir}`,
              this.pkgFinalURL.href
            );
          }
        }
      }

      desc.declarations = declarationsMap(desc.regions);
      source = addDescriptionToSource(desc, source);
    }

    return {
      node: new WriteFileNode(new ConstantNode(source), url),
    };
  }
}
