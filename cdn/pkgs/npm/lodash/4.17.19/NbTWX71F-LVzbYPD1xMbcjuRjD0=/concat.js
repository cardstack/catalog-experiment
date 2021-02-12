import { default as arrayPush } from "./dist/139.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
function concat() {
  var length = arguments.length;

  if (!length) {
    return [];
  }

  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }

  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
export { concat as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTM5LmpzA8LAlcKsLi9kaXN0Lzg1LmpzBsLAlcKtLi9kaXN0LzExNy5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJWhbKZjb25jYXQVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaalhcnJheVB1c2iSAhDAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2Jhc2VGbGF0dGVukgUTwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaljb3B5QXJyYXmSCBLAAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpp2lzQXJyYXmSCxHAA6dkZWZhdWx0wMDAmKFyCwfAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhSQwJmhZAAND8CVEBESEw/AwpmhbKZjb25jYXSSDxbAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvbmNhdC5qc5ihcgkGwBCRDsDCmKFyzOkJwBGRAcDCmKFyAQfAEpEKwMKYoXIKCcATkQfAwpihchMLwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAbAwJEOwMI=
====catalogjs annotation end====*/