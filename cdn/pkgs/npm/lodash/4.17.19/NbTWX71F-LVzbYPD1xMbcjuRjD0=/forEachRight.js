import { default as baseEachRight } from "./dist/78.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";
function arrayEachRight(array, iteratee) {
  var length = array == null ? 0 : array.length;

  while (length--) {
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }

  return array;
}
function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, castFunction(iteratee));
}
export { forEachRight as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNzguanMDwsCVwq0uL2Rpc3QvMTA4LmpzB8LAlcKsLi9pc0FycmF5LmpzC8LAgadkZWZhdWx0laFsrGZvckVhY2hSaWdodBjAwNwAGpehbwAAA8CQwJmhZAkAAgSRAsDCmaFprWJhc2VFYWNoUmlnaHSSAhXAAKdkZWZhdWx0wMDAmKFyCw3AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmsY2FzdEZ1bmN0aW9ukgYWwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpp2lzQXJyYXmSChPAAqdkZWZhdWx0wMDAmKFyCwfAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIDsDAkMDCl6FvAQAOEJDAmaFkAMzAD8CRD8DCmaFsrmFycmF5RWFjaFJpZ2h0kg8UwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlFYWNoUmlnaHQuanOYoXIJDsDAkQ7AwpehbwEAEReQwJmhZAAOEsCVExQVFhLAwpmhbKxmb3JFYWNoUmlnaHSSEhnAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZvckVhY2hSaWdodC5qc5ihcgkMwBOREcDCmKFyJgfAFJEJwMKYoXIPDsAVkQ7AwpihcgMNwBaRAcDCmKFyHAzAwJEFwMKYoWcBAxjAkMDCmKFnCQsZwJEZwMKYoXIADMDAkRHAwg==
====catalogjs annotation end====*/