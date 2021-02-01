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
k5OVwqwuL2Rpc3QvNzguanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAlcKsLi9pc0FycmF5LmpzCcLAgadkZWZhdWx0lKFsrGZvckVhY2hSaWdodBXA3AAXl6FvAAADwJDAmaFkCQACwJECwMKYoWmtYmFzZUVhY2hSaWdodJICEsAAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxjYXN0RnVuY3Rpb26SBRPAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmnaXNBcnJheZIIEMACp2RlZmF1bHTAwJihcgsHwMCRB8DCnKFpARcHCpDAwgLCwMCXoW8BAAsNkMCZoWQAzMAMwJEMwMKYoWyuYXJyYXlFYWNoUmlnaHSSDBHAwMDA2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5RWFjaFJpZ2h0LmpzmKFyCQ7AwJELwMKXoW8BAA4UkMCZoWQADg/AlRAREhMPwMKYoWysZm9yRWFjaFJpZ2h0kg8WwMDAwNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZvckVhY2hSaWdodC5qc5ihcgkMwBCRDsDCmKFyJgfAEZEHwMKYoXIPDsASkQvAwpihcgMNwBORAcDCmKFyHAzAwJEEwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIADMDAkQ7Awg==
====catalogjs annotation end====*/