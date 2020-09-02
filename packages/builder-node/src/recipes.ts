import { satisfies, coerce } from "semver";
import { readJSONSync, existsSync } from "fs-extra";
import { sync as resolve } from "resolve";
import { join, dirname } from "path";

export interface Recipe {
  semverRange: string;

  // By default we will perform the build from the js located in the resolved
  // node_modules package folder. When srcRepo is set to true we will use the
  // package.json "repository" property to locate the source for the package.
  // Otherwise, we'll utilize the properties in the srcRepo object to locate the
  // source repository for this package.
  srcRepo?:
    | true
    | {
        // By default we'll use the package.json "repository" property for the pkg
        // source. Otherwise it can be specified here.
        repoHref?: string;
        // By default we'll use the package.json "version" property to checkout
        // the package source from git. This can be overridden with a specific
        // branch/tag/SHA by setting the version property. The version string
        // supports semver replacement tags, "$major$", "$minor$", and
        // "$patch$". So if you want to checkout a tag that that simply has a
        // prefix or suffix added to the version, you can use replacements tags.
        // For instance if the current version of the package is "3.12.4", and
        // you want to check out tag "3.12.4_es", you can specify:
        //   $major$.$minor$.$patch$_es
        // or to prefix a "v" in front of the version (which is a common practice):
        //   v$major$.$minor$.$patch$
        version?: string;
        // When the repo is actually a mono repo, the package is located in a
        // subdirectory of the repository. By default this will attempted to be
        // derived from the package.json "repository" property by using the part
        // of the repository path that appears after the ../tree/branch_name/
        // part of the path. This can be overridden by setting the subdir
        // property.
        subdir?: string;
      };

  // By default the resulting bundle that is created for the package will have
  // the same relative folder path as the entrypoint js file. So if the
  // entrypoint js files lives in "<pkg root>/src/index.js", the resulting
  // bundle for the package will reside at <pkg URL>/src/index.js. The
  // entrypoints for the package may be hoisted by specifying the folder to
  // hoist the root using the "hoistSrc". Set the "hoistSrc" property to the
  // folder that you wish to hoist to the root of the package. For instance, if
  // the entrypoint file lives in <pkg root>/src/index.js, and you which to have
  // bundles that are created that are placed as direct children of the pkg URL,
  // then set the "hoistSrc" to "src/". Note that the entrypoints.json should
  // point to the hoisted entrypoints file.
  hoistSrc?: string;

  // By default we'll use the package.json "main" property for the pkg
  // entrypoints. If there is no "main" property, then we'll try "./index.js".
  // Otherwise this can be set/overridden by the "entrypoints" property. Note that
  // we are not using the "browser" property in the package.json because
  // typically all the ES modules are compiled out of the browser module.
  entrypoints?: string[];

  // This is a glob that describes all the files to include in the javascript
  // build from the package. By default this is "**/*.{js,json}", and can be
  // overridden using the "srcIncludeGlob" property.
  srcIncludeGlob?: string;

  // This is a glob that describes all the files to ignore in the javascript
  // build from the package. By default this is "{node_modules,test}/**", and can be
  // overridden using the "srcIgnoreGlob" property.
  srcIgnoreGlob?: string;

  // By default only the package.json's "dependencies" will be installed when
  // processing a package. You may also specify additional dependencies, or
  // override the package.json dependencies with the "additionalDependencies"
  // property. This is helpful when the package author is relying on shadowed
  // dependencies that are not explicitly specified, or you want to force a
  // dependency to use a different version.
  additionalDependencies?: {
    [depName: string]: string;
  };

  // In the scenario where a package has defined a dependency that it doesn't
  // actually consume, it can be skipped by including it in the
  // "skipDependencies" list. By default all the package.json "dependencies"
  // will be processed.
  skipDependencies?: string[];
}

export function getRecipe(
  pkgName: string,
  version: string
): Recipe | undefined {
  let recipeFile = join(
    dirname(resolve("@catalogjs/recipes")),
    "recipes",
    `${pkgName}.json`
  );
  if (!existsSync(recipeFile)) {
    return undefined;
  }

  let recipes = readJSONSync(recipeFile).recipes as Recipe[];
  let semver = coerce(version);
  if (semver == null) {
    throw new Error(
      `the version ${version} for package ${name} is not a valid semver`
    );
  }
  let matchingRecipes = recipes.filter(({ semverRange }) =>
    satisfies(semver!, semverRange)
  );
  if (matchingRecipes.length > 1) {
    throw new Error(
      `The semver ranges ${matchingRecipes
        .map((r) => r.semverRange)
        .join(", ")} collide in ${recipeFile}`
    );
  }
  if (matchingRecipes.length === 0) {
    return undefined;
  }
  return matchingRecipes[0];
}
