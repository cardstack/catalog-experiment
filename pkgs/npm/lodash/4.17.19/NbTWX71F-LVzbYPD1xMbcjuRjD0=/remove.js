import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAt } from "./dist/9.js";
function remove(array, predicate) {
  var result = [];

  if (!(array && array.length)) {
    return result;
  }

  var index = -1,
      indexes = [],
      length = array.length;
  predicate = baseIteratee(predicate, 3);

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result.push(value);
      indexes.push(index);
    }
  }

  basePullAt(array, indexes);
  return result;
}
export { remove as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vZGlzdC85LmpzBsLAgadkZWZhdWx0lKFspnJlbW92ZQ3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VJdGVyYXRlZZICCsAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapiYXNlUHVsbEF0kgULwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAAkCcCTCgsJwMKYoWymcmVtb3ZlkgkOwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3JlbW92ZS5qc5ihcgkGwAqRCMDCmKFyzLQMwAuRAcDCmKFyzLkKwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAbAwJEIwMI=
====catalogjs annotation end====*/