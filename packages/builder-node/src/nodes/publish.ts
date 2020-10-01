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
import { NodeFileSystemDriver } from "../node-filesystem-driver";
import { ensureDirSync } from "fs-extra";
import { join } from "path";
import _glob from "glob";
import {
  WriteFileNode,
  MountNode,
  FileListingNode,
  FileNode,
} from "../../../builder-worker/src/nodes/file";
import { ListingEntry } from "../../../builder-worker/src/filesystem";
import {
  LockEntries,
  WriteLockFileNode,
} from "../../../builder-worker/src/nodes/lock-file";
import { buildOutputDir, buildSrcDir } from "./package";

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
    let depHrefs = [...lockEntries.keys()]
      .sort()
      .map((depName) => lockEntries.get(depName));
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
    private workingDir: string,
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

  async run({ pkgFinalURL }: { pkgFinalURL: URL }): Promise<NodeOutput<URL>> {
    let pkgInfo = pkgInfoFromCatalogJsURL(pkgFinalURL);
    if (!pkgInfo || !pkgInfo.version || !pkgInfo.hash) {
      throw new Error(
        `bug: cannot determine pkg name, version, nor hash from URL ${pkgFinalURL.href}`
      );
    }
    let { pkgName, version, hash } = pkgInfo;
    let underlyingPkgPath = join(
      this.workingDir,
      "cdn",
      pkgName,
      version,
      hash
    ); // this is just temp until we don't need to debug any longer..
    ensureDirSync(underlyingPkgPath);
    return {
      node: new MountNode(
        pkgFinalURL,
        new NodeFileSystemDriver(underlyingPkgPath)
      ),
    };
  }
}

export class PublishPackageNode implements BuilderNode {
  cacheKey: string;
  constructor(
    private pkgWorkingURL: URL,
    private workingDir: string,
    private lockEntries: LockEntries
  ) {
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
        this.workingDir,
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
          .map(({ url }) => new PublishFileNode(url, this.pkgFinalURL)),
        ...(this.hasLockFile
          ? [new PublishFileNode(this.lockFileURL, this.pkgFinalURL)]
          : []),
        new PublishFileNode(
          new URL(`${buildSrcDir}entrypoints.json`, this.pkgWorkingURL),
          this.pkgFinalURL
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
  constructor(private url: URL, private pkgFinalURL: URL) {
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
    return {
      node: new WriteFileNode(new ConstantNode(contents), url),
    };
  }
}
