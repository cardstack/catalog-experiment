import { BundleAssignment } from "../nodes/bundle";
import { ModuleResolution } from "../nodes/resolution";
import { Entrypoint } from "../nodes/entrypoint";
import { Assigner, DefaultAssigner } from "./default";
import { MaximumAssigner } from "./maximum";
import { assertNever } from "@catalogjs/shared/util";

export function getAssigner(
  type: BundleAssignment["assigner"],
  projectInput: URL,
  projectOutput: URL,
  resolutions: ModuleResolution[],
  entrypoints: Entrypoint[],
  mountedPkgSource: URL,
  htmlJSEntrypointURLs?: URL[]
): Assigner {
  switch (type) {
    case "minimum": // TODO
    case "default":
      return new DefaultAssigner(
        projectInput,
        projectOutput,
        resolutions,
        entrypoints,
        mountedPkgSource,
        htmlJSEntrypointURLs
      );
    case "maximum":
      return new MaximumAssigner(
        projectInput,
        projectOutput,
        resolutions,
        entrypoints,
        mountedPkgSource,
        htmlJSEntrypointURLs
      );
    default:
      assertNever(type);
  }
}
