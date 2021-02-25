import { default as isSymbol } from "../isSymbol.js";
var INFINITY = 1 / 0;
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
export { toKey as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbKV0b0tleQ7AwNwAEJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGlzU3ltYm9skgILwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCBDAwJDAwpehbwEABg2QwJihZwABBwmQwMKZoWQECAjAkggGwMKZoWyoSU5GSU5JVFmSCAzAwMAGkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL190b0tleS5qc5ihcgAIwMCRB8DCmaFkARMKwJQLDAoHwMKZoWyldG9LZXmSCg/AwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL190b0tleS5qc5ihcgkFwAuRCcDCmKFyLAjADJEBwMKYoXJlCMDAkQfAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAFwMCRCcDC
====catalogjs annotation end====*/