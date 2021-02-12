import { default as SetCache } from "./64.js";
import { default as arrayIncludes } from "./120.js";
import { default as arrayIncludesWith } from "./162.js";
import { default as arrayMap } from "./98.js";
import { default as baseUnary } from "./135.js";
import { default as cacheHas } from "./152.js";
var LARGE_ARRAY_SIZE = 200;
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }

  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }

  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  } else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }

  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);
    value = comparator || value !== 0 ? value : 0;

    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;

      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }

      result.push(value);
    } else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }

  return result;
}
export { baseDifference as default };
/*====catalogjs annotation start====
k5aVwqcuLzY0LmpzA8LAlcKoLi8xMjAuanMGwsCVwqguLzE2Mi5qcwnCwJXCpy4vOTguanMMwsCVwqguLzEzNS5qcw/CwJXCqC4vMTUyLmpzEsLAgadkZWZhdWx0laFsrmJhc2VEaWZmZXJlbmNlIcDA3AAjl6FvAAADwJDAmaFkCQACwJECwMKZoWmoU2V0Q2FjaGWSAh/AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFprWFycmF5SW5jbHVkZXOSBRnAAadkZWZhdWx0wMDAmKFyCw3AwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpsWFycmF5SW5jbHVkZXNXaXRokggcwAKnZGVmYXVsdMDAwJihcgsRwMCRB8DCnKFpARMHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaahhcnJheU1hcJILGsADp2RlZmF1bHTAwMCYoXILCMDAkQrAwpyhaQESCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmpYmFzZVVuYXJ5kg4bwASnZGVmYXVsdMDAwJihcgsJwMCRDcDCnKFpARMNEpDAwgTCwMCZoWQJABHAkRHAwpmhaahjYWNoZUhhc5IRHsAFp2RlZmF1bHTAwMCYoXILCMDAkRDAwpyhaQETEBOQwMIFwsDAl6FvAQAUIJDAmKFnAAEVF5DAwpmhZAQGFsCSFhTAwpmhbLBMQVJHRV9BUlJBWV9TSVpFkhYdwMDAFJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZURpZmZlcmVuY2UuanOYoXIAEMDAkRXAwpmhZAHNAh4YwJkZGhscHR4fGBXAwpmhbK5iYXNlRGlmZmVyZW5jZZIYIsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VEaWZmZXJlbmNlLmpzmKFyCQ7AGZEXwMKYoXJLDcAakQTAwpihcsy2CMAbkQrAwpihcgkJwByRDcDCmKFyNRHAHZEHwMKYoXI2EMAekRXAwpihchMIwB+REMDCmKFyKQjAwJEBwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIADsDAkRfAwg==
====catalogjs annotation end====*/