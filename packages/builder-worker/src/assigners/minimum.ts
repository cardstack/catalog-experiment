import { AbstractAssigner, InternalAssignment, ensureExposed } from "./default";
import { makeNonCyclic, ModuleResolution } from "../nodes/resolution";
import { Entrypoint } from "../nodes/entrypoint";
import { getExports } from "../describe-file";
import { BundleAssignment } from "../nodes/bundle";
import { setDoubleNestedMapping } from "../utils";
import { flatMap } from "lodash";

export class MinimumAssigner extends AbstractAssigner {
  private internalAssignments: Map<
    string,
    Map<string, InternalAssignment>
  > = new Map();
  constructor(
    projectInput: URL,
    projectOutput: URL,
    resolutions: ModuleResolution[],
    entrypoints: Entrypoint[],
    htmlJSEntrypointURLs?: URL[]
  ) {
    super(
      "minimum",
      projectInput,
      projectOutput,
      resolutions,
      entrypoints,
      false,
      htmlJSEntrypointURLs
    );
    this.doAssignments();
  }

  get assignments(): BundleAssignment[] {
    return flatMap([...this.internalAssignments.values()], (assignmentMap) =>
      [...assignmentMap.values()].map((a) => a.assignment)
    );
  }

  protected doAssignments(): void {
    for (let entrypoint of this.entrypoints.values()) {
      let module = this.resolutions.find(
        (r) => this.inputToOutput(r.url.href).href === entrypoint.url.href
      );
      if (!module) {
        throw new Error(
          `Could not determine module for entrypoint ${entrypoint.url.href}`
        );
      }
      let internalAssignment = {
        assignment: {
          assigner: this.type,
          bundleURL: entrypoint.url,
          module,
          exposedNames: new Map(),
          entrypointModuleURL: module.url,
        },
        enclosingBundles: new Set([entrypoint.url.href]),
      };
      setDoubleNestedMapping(
        entrypoint.url.href,
        module.url.href,
        internalAssignment,
        this.internalAssignments
      );
      for (let [exportedName] of getExports(module)) {
        ensureExposed(exportedName, internalAssignment.assignment);
      }

      for (let dep of module.resolvedImports) {
        this.assignModule(
          makeNonCyclic(dep),
          internalAssignment.assignment.bundleURL
        );
      }
    }
  }

  private assignModule(module: ModuleResolution, entrypointBundleURL: URL) {
    if (
      this.internalAssignments
        .get(entrypointBundleURL.href)
        ?.get(module.url.href)
    ) {
      return;
    }

    let internalAssignment = {
      assignment: {
        assigner: this.type,
        bundleURL: entrypointBundleURL,
        module,
        exposedNames: new Map(),
        entrypointModuleURL: module.url,
      },
      enclosingBundles: new Set([entrypointBundleURL.href]),
    };
    setDoubleNestedMapping(
      entrypointBundleURL.href,
      module.url.href,
      internalAssignment,
      this.internalAssignments
    );
    for (let dep of module.resolvedImports) {
      this.assignModule(makeNonCyclic(dep), entrypointBundleURL);
    }
  }
}
