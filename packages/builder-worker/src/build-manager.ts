import { merge } from "lodash";
import { Rebuilder } from "./builder";
import { FileSystem } from "./filesystem";
import { warn } from "./logger";
import { Options } from "./nodes/project";

export class BuildManager {
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

  setProjects(projects: [URL, URL][]) {
    this._projects = projects;
    this._rebuilder = Rebuilder.forProjects(
      this.fs,
      projects,
      this.recipesURL,
      this.options,
      this.whenIdle
    );
  }

  setOptions(options: Partial<Options>) {
    if (!this._projects) {
      throw new Error(`must first call setProjects()`);
    }
    this.options = merge({}, this.options, options);
    this._rebuilder = Rebuilder.forProjects(
      this.fs,
      this._projects,
      this.recipesURL,
      options,
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
    return this.rebuilder.isIdle();
  }

  async reload(options?: Partial<Options>): Promise<void> {
    if (!this._projects || !this._rebuilder) {
      throw new Error(`must set projects first before reloading the builder`);
    }
    this.options = options;
    warn(
      `reloading builder with options: ${
        options ? JSON.stringify(options) : "none"
      }`
    );
    await this._rebuilder.shutdown();

    this._rebuilder = Rebuilder.forProjects(
      this.fs,
      this._projects,
      this.recipesURL,
      this.options,
      this.whenIdle
    );
    this._rebuilder.start();
  }
}
