import { sep } from "path";
// TODO we don't need to use this pkg anymore--core node should be able to
// resolve a module from a given directory
import { sync as resolveModule } from "resolve";

export function resolveNodePkg(pkgName: string, basedir?: string): string {
  let entrypointPath = resolveModule(pkgName, { basedir });
  let pathParts = entrypointPath.split(sep);
  while (pathParts.pop() !== "node_modules") {
    if (pathParts.length === 0) {
      throw new Error(
        `bug: could not find node_modules folder in module resolution ${entrypointPath}`
      );
    }
  }

  return [...pathParts, "node_modules", pkgName].join(sep);
}
