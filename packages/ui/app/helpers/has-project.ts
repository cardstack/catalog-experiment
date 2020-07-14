import { helper } from "@ember/component/helper";

export function hasProject([projectInputURL, projectRoots]: [
  string,
  [string, string][]
]) {
  return Boolean(projectRoots.find(([input]) => input === projectInputURL));
}

export default helper(hasProject);
