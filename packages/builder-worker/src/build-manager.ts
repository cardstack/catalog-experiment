import { ClientEventHandler } from "./client-event-handler";
import { ReloadEvent } from "./client-reload";
import { Rebuilder } from "./builder";
import { FileSystem } from "./filesystem";
import { Logger } from "./logger";

const { warn } = Logger;

export class BuildManager {
  private _rebuilder: Rebuilder<unknown>;
  constructor(
    private fs: FileSystem,
    readonly projects: [URL, URL][], // [input, output][]
    private reloadEventHandler: ClientEventHandler<ReloadEvent>
  ) {
    this._rebuilder = this.newRebuilder();
  }

  private newRebuilder(): Rebuilder<unknown> {
    return Rebuilder.forProjects(this.fs, this.projects, () =>
      this.reloadEventHandler.handleEvent({})
    );
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
