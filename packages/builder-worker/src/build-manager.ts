import { Rebuilder } from "./builder";
import { FileSystem } from "./filesystem";
import { warn } from "./logger";

export class BuildManager {
  private _rebuilder: Rebuilder<unknown>;
  constructor(
    private fs: FileSystem,
    readonly projects: [URL, URL][] // [input, output][]
  ) {
    this._rebuilder = this.newRebuilder();
  }

  private newRebuilder(): Rebuilder<unknown> {
    return Rebuilder.forProjects(this.fs, this.projects);
  }

  get rebuilder() {
    return this._rebuilder;
  }

  async reload(): Promise<void> {
    warn("reloading builder");
    await this._rebuilder.shutdown();

    this._rebuilder = this.newRebuilder();
    this._rebuilder.start();
  }
}
