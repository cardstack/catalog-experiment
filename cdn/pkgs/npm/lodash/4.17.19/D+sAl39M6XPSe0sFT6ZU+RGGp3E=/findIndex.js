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
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKrLi9kaXN0LzYuanMHwsCVwq4uL3RvSW50ZWdlci5qcwvCwIGnZGVmYXVsdJWhbKlmaW5kSW5kZXgYwMDcABqXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa1iYXNlRmluZEluZGV4kgIVwACnZGVmYXVsdMDAwJihcgsNwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprGJhc2VJdGVyYXRlZZIGFsABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgNwMCQwMKZoWQJAAoMkQrAwpmhaal0b0ludGVnZXKSChPAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIEMDAkMDCl6FvAQAOF5DAmKFnAAEPEZDAwpmhZAQLEMCSEA7AwpmhbKluYXRpdmVNYXiSEBTAwMAOkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRJbmRleC5qc5ihcgAJwMCRD8DCmaFkARkSwJYTFBUWEg/AwpmhbKlmaW5kSW5kZXiSEhnAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRJbmRleC5qc5ihcgkJwBOREcDCmKFyzJ0JwBSRCcDCmKFyLQnAFZEPwMKYoXIjDcAWkQHAwpihcggMwMCRBcDCmKFnAQMYwJDAwpihZwkLGcCRGcDCmKFyAAnAwJERwMI=
====catalogjs annotation end====*/