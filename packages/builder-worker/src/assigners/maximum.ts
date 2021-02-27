import {
  AbstractAssigner,
  InternalAssignment,
  ensureExposed,
  internalAssignmentForEntrypoint,
} from "./default";
import { ModuleResolution } from "../nodes/resolution";
import { Entrypoint } from "../nodes/entrypoint";
import { getExports } from "../describe-file";

export class MaximumAssigner extends AbstractAssigner {
  constructor(
    projectInput: URL,
    projectOutput: URL,
    resolutions: ModuleResolution[],
    entrypoints: Entrypoint[],
    htmlJSEntrypointURLs?: URL[]
  ) {
    super(
      "maximum",
      projectInput,
      projectOutput,
      resolutions,
      entrypoints,
      false,
      htmlJSEntrypointURLs
    );
  }
  protected doAssignments(leaves: Set<ModuleResolution>): void {
    for (let leaf of leaves) {
      this.assignModule(leaf);
    }
  }

  private assignModule(module: ModuleResolution): InternalAssignment {
    let alreadyAssigned = this.assignmentMap.get(module.url.href);
    if (alreadyAssigned) {
      return alreadyAssigned;
    }

    let consumerAssignments = this.assignConsumersOfModule(
      module,
      this.assignModule.bind(this)
    );
    let entrypoint = this.entrypoints.get(module.url.href);
    if (entrypoint) {
      return internalAssignmentForEntrypoint(
        this.type,
        module,
        entrypoint,
        consumerAssignments,
        this.assignmentMap
      );
    }

    // every module is a bundle in this assigner
    let bundleURL = this.inputToOutput(module.url.href);
    let internalAssignment = {
      assignment: {
        assigner: this.type,
        bundleURL,
        module,
        exposedNames: new Map(),
        entrypointModuleURL: module.url,
      },
      enclosingBundles: new Set([bundleURL.href]),
    };
    this.assignmentMap.set(module.url.href, internalAssignment);
    for (let [exportedName] of getExports(module)) {
      ensureExposed(exportedName, internalAssignment.assignment);
    }
    return internalAssignment;
  }
}
