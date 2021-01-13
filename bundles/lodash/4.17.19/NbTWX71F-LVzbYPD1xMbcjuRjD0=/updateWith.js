import { default as baseUpdate } from "./dist/13.js";
import { default as castFunction } from "./dist/108.js";
function updateWith(object, path, updater, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}
export { updateWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTMuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0lKFsqnVwZGF0ZVdpdGgNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmqYmFzZVVwZGF0ZZICCsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxjYXN0RnVuY3Rpb26SBQvAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIDJDAmaFkABkJwJMKCwnAwpihbKp1cGRhdGVXaXRokgkOwMDAwNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VwZGF0ZVdpdGguanOYoXIJCsAKkQjAwpihcsySCsALkQHAwpihcg8MwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAArAwJEIwMI=
====catalogjs annotation end====*/