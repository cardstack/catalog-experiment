import { satisfies, coerce } from "semver";
import { readJSONSync, existsSync } from "fs-extra";
import { sync as resolve } from "resolve";
import { join, dirname } from "path";
import { Recipe } from "../../builder-worker/src/recipes";

export { Recipe }; // make life easier while I move things around...

// TODO remove this and replace references with the builder-worker's getRecipes()
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
