import { helper } from "@ember/component/helper";
import { baseName } from "./base-name";

export function projectOutputURL([projectInputURL, projectRoots]: [
  string,
  [string, string][]
]) {
  let [, output] =
    projectRoots.find(([input]) => input === projectInputURL) ?? [];
  if (output) {
    return output;
  }
  return `${location.origin}/${baseName(projectInputURL)}/`;
}

export default helper(projectOutputURL);
