import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max;
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}
export { findIndex as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwq4uL3RvSW50ZWdlci5qcwnCwIGnZGVmYXVsdJWhbKlmaW5kSW5kZXgVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaa1iYXNlRmluZEluZGV4kgISwACnZGVmYXVsdMDAwJihcgsNwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxiYXNlSXRlcmF0ZWWSBRPAAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqXRvSW50ZWdlcpIIEMACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALFJDAmKFnAAEMDpDAwpmhZAQLDcCSDQvAwpmhbKluYXRpdmVNYXiSDRHAwMALkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRJbmRleC5qc5ihcgAJwMCRDMDCmaFkARkPwJYQERITDwzAwpmhbKlmaW5kSW5kZXiSDxbAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRJbmRleC5qc5ihcgkJwBCRDsDCmKFyzJ0JwBGRB8DCmKFyLQnAEpEMwMKYoXIjDcATkQHAwpihcggMwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAnAwJEOwMI=
====catalogjs annotation end====*/