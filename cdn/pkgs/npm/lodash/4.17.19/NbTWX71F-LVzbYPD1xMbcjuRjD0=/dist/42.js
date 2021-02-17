import { default as Stack } from "./59.js";
import { default as baseIsEqual } from "./43.js";
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }

  object = Object(object);

  while (index--) {
    var data = matchData[index];

    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }

  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();

      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }

      if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
        return false;
      }
    }
  }

  return true;
}
export { baseIsMatch as default };
/*====catalogjs annotation start====
k5KVwqcuLzU5LmpzA8LAlcKnLi80My5qcwfCwIGnZGVmYXVsdJWhbKtiYXNlSXNNYXRjaBbAwNwAGJehbwAAA8CQwJmhZAkAAgSRAsDCmaFppVN0YWNrkgIRwACnZGVmYXVsdMDAwJihcgsFwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFpq2Jhc2VJc0VxdWFskgYSwAGnZGVmYXVsdMDAwJihcgsLwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAnAwJDAwpehbwEAChWQwJihZwABCw+QwMKZoWQEBAwNkgwKwMKZoWy0Q09NUEFSRV9QQVJUSUFMX0ZMQUeSDBPAwMAKkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNNYXRjaC5qc5ihcgAUwMCRC8DCmaFkBgQOwJIOCsDCmaFstkNPTVBBUkVfVU5PUkRFUkVEX0ZMQUeSDhTAwMAKkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNNYXRjaC5qc5ihcgAWwMCRDcDCmaFkAVsQwJcREhMUEAsNwMKZoWyrYmFzZUlzTWF0Y2iSEBfAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNNYXRjaC5qc5ihcgkLwBGRD8DCmKFyzQKnBcASkQHAwpihcsyaC8ATkQXAwpihchUUwBSRC8DCmKFyAxbAwJENwMKYoWcBAxbAkMDCmKFnCQsXwJEXwMKYoXIAC8DAkQ/Awg==
====catalogjs annotation end====*/