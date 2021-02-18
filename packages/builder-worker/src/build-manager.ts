import { merge } from "lodash";
import { Rebuilder } from "./builder";
import { FileSystem } from "./filesystem";
import { warn } from "./logger";
import { Options } from "./nodes/project";

export class BuildManager {
  private hasAlreadyBuilt = false;
  private _rebuilder: Rebuilder<unknown> | undefined;
  private _projects: [URL, URL][] | undefined;
  constructor(
    private fs: FileSystem,
    private recipesURL: URL,
    private options?: Partial<Options>,
    private whenIdle?: () => void
  ) {}

  projects() {
    return this._projects ? [...this._projects] : undefined;
  }

  async configure(projects: [URL, URL][], options: Partial<Options> = {}) {
    if (this._rebuilder) {
      await this._rebuilder.shutdown();
    }
    this._projects = projects;
    this.options = merge({}, this.options, options);
    this._rebuilder = Rebuilder.forProjects(
      this.fs,
      projects,
      this.recipesURL,
      this.options,
      this.whenIdle
    );
  }

  get rebuilder() {
    return this._rebuilder;
  }

  async isIdle(): Promise<void> {
    if (!this.rebuilder) {
      return Promise.resolve();
    }
    await this.rebuilder.isIdle();
    this.hasAlreadyBuilt = true;
    return;
  }

  async reload(): Promise<void> {
    if (!this._projects || !this._rebuilder) {
      throw new Error(`must set projects first before reloading the builder`);
    }
    warn(`reloading builder with options: ${JSON.stringify(this.options)}`);
    await this._rebuilder.shutdown();

    this._rebuilder = Rebuilder.forProjects(
      this.fs,
      this._projects,
      this.recipesURL,
      this.options,
      this.whenIdle,
      this.hasAlreadyBuilt
    );
    this._rebuilder.start();
  }
}
