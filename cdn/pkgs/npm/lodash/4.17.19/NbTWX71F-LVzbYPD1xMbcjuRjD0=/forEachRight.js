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
k5OVwqwuL2Rpc3QvNzguanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAlcKsLi9pc0FycmF5LmpzCcLAgadkZWZhdWx0laFsrGZvckVhY2hSaWdodBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprWJhc2VFYWNoUmlnaHSSAhLAAKdkZWZhdWx0wMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGNhc3RGdW5jdGlvbpIFE8ABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmnaXNBcnJheZIIEMACp2RlZmF1bHTAwMCYoXILB8DAkQfAwpyhaQEXBwqQwMICwsDAl6FvAQALDZDAmaFkAMzADMCRDMDCmaFsrmFycmF5RWFjaFJpZ2h0kgwRwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlFYWNoUmlnaHQuanOYoXIJDsDAkQvAwpehbwEADhSQwJmhZAAOD8CVEBESEw/AwpmhbKxmb3JFYWNoUmlnaHSSDxbAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZvckVhY2hSaWdodC5qc5ihcgkMwBCRDsDCmKFyJgfAEZEHwMKYoXIPDsASkQvAwpihcgMNwBORAcDCmKFyHAzAwJEEwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIADMDAkQ7Awg==
====catalogjs annotation end====*/