import { satisfies, coerce } from "semver";
import { FileSystem } from "./filesystem";
import { FileDescriptor } from "./filesystem-drivers/filesystem-driver";

export const recipesURL = new URL(`https://catalogjs.com/recipes/`);

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

  // By default the optional chaining and nullish coalescing operator plugins
  // will be used when performing the build, as well as we'll continue to add
  // other plugins for late stage TC39 proposals that are on the verge of
  // becoming part of the spec. To utilize additional babel plugins, specify
  // those in the "babelPlugins" property
  babelPlugins?: (string | [string, { [optName: string]: any }])[];

  // If you wish to override the resolver and provide a specific resolution,
  // then use the "resolution" property. This is an object whose keys are
  // specifier strings that appear in the import statements you wish to resolve
  // yourself. The values are the catalogjs URLs to modules you would like the
  // specifier to resolve to. For instance, in order to add a resolution for the
  // builtin node module "assert" to leverage the catalogjs assert polyfill you
  // can specify:
  //   "assert":  "https://catalogjs.com/pkgs/@catalogjs/polyfills/0.0.1/assert.js"
  resolutions?: {
    [specifier: string]: string;
  };

  // If you want to override the package.json dependencies in order to specify a
  // consumption range for the package because the consumed dependency is
  // actually shadowing the consumption range of another consumer's
  // package.json, then use the "dependencies" property. This is an object whose
  // keys are the dependencies' package names, and whose values are the semver
  // range to use for the dependency. Any values declared here will override
  // what is in the package.json. It's worth paying attention to what the
  // resolved package dependency actually is so you don't provide a conflicting
  // consumption range. The resolved version is available in the catalogjs.lock
  // file.
  dependencies: {
    [pkgName: string]: string;
  };

  // If you wish to replace macros with specific values at build time, then use
  // the "macros" property. This is an object whose keys are the macros that you
  // wish to replace, and whose corresponding values are the macro replacements.
  // Note that macro is the body of a regex, so make sure to escape any regex
  // chars. Also if you are replacing the macro with a string literal, make sure
  // to include quotes in the macro value:
  //   "MY_VERSION": "'5.6.4'"
  macros?: {
    [macro: string]: string;
  };
}

let cache: Map<string, Recipe | undefined> = new Map();

export async function getRecipe(
  pkgName: string,
  version: string,
  fs: FileSystem,
  _recipesURL: URL = recipesURL
): Promise<Recipe | undefined> {
  if (cache.has(`${pkgName}:${version}`)) {
    return cache.get(`${pkgName}:${version}`);
  }

  let url = new URL(`${pkgName}.json`, _recipesURL);
  let fd: FileDescriptor | undefined;
  let recipes: Recipe[];
  try {
    fd = await fs.openFile(url);
    recipes = JSON.parse(await fd.readText()).recipes;
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      cache.set(`${pkgName}:${version}`, undefined);
      return undefined;
    }
    throw err;
  } finally {
    if (fd) {
      await fd.close();
    }
  }

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
        .join(", ")} collide in ${url.href}`
    );
  }
  if (matchingRecipes.length === 0) {
    cache.set(`${pkgName}:${version}`, undefined);
    return undefined;
  }
  cache.set(`${pkgName}:${version}`, matchingRecipes[0]);
  return matchingRecipes[0];
}
