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
k5SVwq0uL2Rpc3QvMTM5LmpzA8LAlcKsLi9kaXN0Lzg1LmpzBsLAlcKtLi9kaXN0LzExNy5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJShbKZjb25jYXQVwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqWFycmF5UHVzaJICEMAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaatiYXNlRmxhdHRlbpIFE8ABp2RlZmF1bHTAwJihcgsLwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaljb3B5QXJyYXmSCBLAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmnaXNBcnJheZILEcADp2RlZmF1bHTAwJihcgsHwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4UkMCZoWQADQ/AlRAREhMPwMKYoWymY29uY2F0kg8WwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvbmNhdC5qc5ihcgkGwBCRDsDCmKFyzOkJwBGRAcDCmKFyAQfAEpEKwMKYoXIKCcATkQfAwpihchMLwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAbAwJEOwMI=
====catalogjs annotation end====*/