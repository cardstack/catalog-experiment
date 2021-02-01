import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}
export { drop as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQyLmpzA8LAlcKuLi90b0ludGVnZXIuanMGwsCBp2RlZmF1bHSUoWykZHJvcA3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqWJhc2VTbGljZZICC8AAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaal0b0ludGVnZXKSBQrAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIDJDAmaFkACEJwJMKCwnAwpihbKRkcm9wkgkOwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Ryb3AuanOYoXIJBMAKkQjAwpihcsyQCcALkQTAwpihcg4JwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAATAwJEIwMI=
====catalogjs annotation end====*/