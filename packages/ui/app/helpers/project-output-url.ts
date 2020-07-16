import { helper } from "@ember/component/helper";

export function projectOutputURL([projectInputURL, projectRoots]: [
  string,
  [string, string][]
]) {
  let [, output] =
    projectRoots.find(([input]) => input === projectInputURL) ?? [];
  if (output) {
    return output;
  }
  return `${location.origin}/`;
}

export default helper(projectOutputURL);
