import { helper } from "@ember/component/helper";

export function baseName(path: string) {
  if (path.slice(-1) === "/") {
    path = path.slice(0, -1);
  }
  return path.split("/").pop();
}

export default helper(function ([path]) {
  return baseName(path);
});
