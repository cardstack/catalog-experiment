import { default as isArray } from "./isArray.js";
function castArray() {
  if (!arguments.length) {
    return [];
  }

  var value = arguments[0];
  return isArray(value) ? value : [value];
}
export { castArray as default };
/*====catalogjs annotation start====
k5GVwqwuL2lzQXJyYXkuanMDwsCBp2RlZmF1bHSUoWypY2FzdEFycmF5CcCbl6FvAAADwJDAmaFkCQACwJECwMKYoWmnaXNBcnJheZICB8AAp2RlZmF1bHTAwJihcgsHwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUIkMCZoWQAHAbAkgcGwMKYoWypY2FzdEFycmF5kgYKwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Nhc3RBcnJheS5qc5ihcgkJwAeRBcDCmKFyWQfAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACcDAkQXAwg==
====catalogjs annotation end====*/