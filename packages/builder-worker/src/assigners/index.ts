import { BundleAssignment } from "../nodes/bundle";
import {
  isCyclicModuleResolution,
  ModuleResolution,
  Resolution,
} from "../nodes/resolution";
import { Entrypoint } from "../nodes/entrypoint";
import { Assigner, DefaultAssigner } from "./default";
import { MaximumAssigner } from "./maximum";
import { MinimumAssigner } from "./minimum";
import { assertNever } from "@catalogjs/shared/util";
import { log } from "../logger";

export function getAssigner(
  type: BundleAssignment["assigner"],
  projectInput: URL,
  projectOutput: URL,
  resolutions: ModuleResolution[],
  entrypoints: Entrypoint[],
  htmlJSEntrypointURLs?: URL[]
): Assigner {
  // if there are dynamic imports then use default assigner in place of the
  // minimum assigner.
  if (type === "minimum" && hasDynamicImports(resolutions)) {
    log(
      `Found dynamic imports in project ${projectInput.href}, switching to 'default' bundle assigner for this project`
    );
    type = "default";
  }
  switch (type) {
    case "default":
      return new DefaultAssigner(
        projectInput,
        projectOutput,
        resolutions,
        entrypoints,
        htmlJSEntrypointURLs
      );
    case "maximum":
      return new MaximumAssigner(
        projectInput,
        projectOutput,
        resolutions,
        entrypoints,
        htmlJSEntrypointURLs
      );
    case "minimum":
      return new MinimumAssigner(
        projectInput,
        projectOutput,
        resolutions,
        entrypoints,
        htmlJSEntrypointURLs
      );
    default:
      assertNever(type);
  }
}

function hasDynamicImports(resolutions: Resolution[]): boolean {
  for (let module of resolutions) {
    if (module.desc.imports.find((i) => i.isDynamic)) {
      return true;
    }
    if (!isCyclicModuleResolution(module)) {
      if (hasDynamicImports(module.resolvedImports)) {
        return true;
      }
    }
  }
  return false;
}
