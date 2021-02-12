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
k5KVwqcuLzU5LmpzA8LAlcKnLi80My5qcwbCwIGnZGVmYXVsdJWhbKtiYXNlSXNNYXRjaBTAwNwAFpehbwAAA8CQwJmhZAkAAsCRAsDCmaFppVN0YWNrkgIPwACnZGVmYXVsdMDAwJihcgsFwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaatiYXNlSXNFcXVhbJIFEMABp2RlZmF1bHTAwMCYoXILC8DAkQTAwpyhaQESBAeQwMIBwsDAl6FvAQAIE5DAmKFnAAEJDZDAwpmhZAQECguSCgjAwpmhbLRDT01QQVJFX1BBUlRJQUxfRkxBR5IKEcDAwAiQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc01hdGNoLmpzmKFyABTAwJEJwMKZoWQGBAzAkgwIwMKZoWy2Q09NUEFSRV9VTk9SREVSRURfRkxBR5IMEsDAwAiQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc01hdGNoLmpzmKFyABbAwJELwMKZoWQBWw7Alw8QERIOCQvAwpmhbKtiYXNlSXNNYXRjaJIOFcDAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc01hdGNoLmpzmKFyCQvAD5ENwMKYoXLNAqcFwBCRAcDCmKFyzJoLwBGRBMDCmKFyFRTAEpEJwMKYoXIDFsDAkQvAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgALwMCRDcDC
====catalogjs annotation end====*/