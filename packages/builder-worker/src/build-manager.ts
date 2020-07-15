import { Rebuilder } from "./builder";
import { FileSystem } from "./filesystem";
import { warn } from "./logger";

export class BuildManager {
  private _rebuilder: Rebuilder<unknown> | undefined;
  private _projects: [URL, URL][] | undefined;
  constructor(private fs: FileSystem) {}

  projects() {
    return this._projects ? [...this._projects] : undefined;
  }

  setProjects(projects: [URL, URL][]) {
    this._projects = projects;
    this._rebuilder = Rebuilder.forProjects(this.fs, projects);
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

  async reload(): Promise<void> {
    if (!this._projects || !this._rebuilder) {
      throw new Error(`must set projects first before reloading the builder`);
    }
    warn("reloading builder");
    await this._rebuilder.shutdown();

    this._rebuilder = Rebuilder.forProjects(this.fs, this._projects);
    this._rebuilder.start();
  }
}
