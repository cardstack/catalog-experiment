import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}
export { take as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQyLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWykdGFrZQ3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqWJhc2VTbGljZZICC8AAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaal0b0ludGVnZXKSBQrAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkABwJwJMKCwnAwpihbKR0YWtlkgkOwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Rha2UuanOYoXIJBMAKkQjAwpihcm8JwAuRBMDCmKFyDgnAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABMDAkQjAwg==
====catalogjs annotation end====*/