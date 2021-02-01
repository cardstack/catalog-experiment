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
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwq4uL3RvSW50ZWdlci5qcwnCwIGnZGVmYXVsdJShbKlmaW5kSW5kZXgVwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprWJhc2VGaW5kSW5kZXiSAhLAAKdkZWZhdWx0wMCYoXILDcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYmFzZUl0ZXJhdGVlkgUTwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIEMACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHCpDAwgLCwMCXoW8BAAsUkMCYoWcAAQwOkMDCmaFkBAsNwJINC8DCmKFsqW5hdGl2ZU1heJINEcDAwAvZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kSW5kZXguanOYoXIACcDAkQzAwpmhZAEZD8CWEBESEw8MwMKYoWypZmluZEluZGV4kg8WwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRJbmRleC5qc5ihcgkJwBCRDsDCmKFyzJ0JwBGRB8DCmKFyLQnAEpEMwMKYoXIjDcATkQHAwpihcggMwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAnAwJEOwMI=
====catalogjs annotation end====*/