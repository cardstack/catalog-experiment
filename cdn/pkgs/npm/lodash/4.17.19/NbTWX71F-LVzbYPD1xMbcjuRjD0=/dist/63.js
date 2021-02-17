import { default as Set0 } from "./67.js";
import { default as noop } from "../noop.js";
import { default as setToArray } from "./154.js";
import { default as SetCache } from "./64.js";
import { default as arrayIncludes } from "./120.js";
import { default as arrayIncludesWith } from "./162.js";
import { default as cacheHas } from "./152.js";
var INFINITY = 1 / 0;
var createSet = !(Set0 && 1 / setToArray(new Set0([, -0]))[1] == INFINITY) ? noop : function (values) {
  return new Set0(values);
};
var LARGE_ARRAY_SIZE = 200;
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);

    if (set) {
      return setToArray(set);
    }

    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = iteratee ? [] : result;
  }

  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;
    value = comparator || value !== 0 ? value : 0;

    if (isCommon && computed === computed) {
      var seenIndex = seen.length;

      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }

      if (iteratee) {
        seen.push(computed);
      }

      result.push(value);
    } else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }

      result.push(value);
    }
  }

  return result;
}
export { baseUniq as default };
/*====catalogjs annotation start====
k5eVwqcuLzY3LmpzA8LAlcKqLi4vbm9vcC5qcwfCwJXCqC4vMTU0LmpzC8LAlcKnLi82NC5qcw/CwJXCqC4vMTIwLmpzE8LAlcKoLi8xNjIuanMXwsCVwqguLzE1Mi5qcxvCwIGnZGVmYXVsdJWhbKhiYXNlVW5pcTjAwNwAOpehbwAAA8CQwJmhZAkAAgSRAsDCmaFppFNldDCUAiQmKcAAp2RlZmF1bHTAwMCYoXILBMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaaRub29wkgYowAGnZGVmYXVsdMDAwJihcgsEwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCAzAwJDAwpmhZAkACgyRCsDCmaFpqnNldFRvQXJyYXmTCiU0wAKnZGVmYXVsdMDAwJihcgsKwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpqFNldENhY2hlkg42wAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCAnAwJDAwpmhZAkAEhSREsDCmaFprWFycmF5SW5jbHVkZXOSEjDABKdkZWZhdWx0wMDAmKFyCw3AwJERwMKcoWkBAREXkRTAwgTCwMCYoWcICsDAkMDCmaFkCQAWGJEWwMKZoWmxYXJyYXlJbmNsdWRlc1dpdGiSFjHABadkZWZhdWx0wMDAmKFyCxHAwJEVwMKcoWkBARUbkRjAwgXCwMCYoWcICsDAkMDCmaFkCQAaHJEawMKZoWmoY2FjaGVIYXOSGjXABqdkZWZhdWx0wMDAmKFyCwjAwJEZwMKcoWkBARkdkRzAwgbCwMCYoWcICsDAkMDCl6FvAQAeKpDAmKFnAAEfIZDAwpmhZAQIIMCSIB7AwpmhbKhJTkZJTklUWZIgJ8DAwB6Q2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVNldC5qc5ihcgAIwMCRH8DCmKFnAQEiwJDAwpmhZAQLI8CZJCUmJygpIyEfwMKZoWypY3JlYXRlU2V0kiMzwMDAIZDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlU2V0LmpzmKFyAAnAJJEiwMKYoXIFBMAlkQHAwpihcggKwCaRCcDCmKFyBQTAJ5EBwMKYoXIQCMAokR/AwpihcgQEwCmRBcDCmKFyJATAwJEBwMKXoW8BACs3kMCYoWcAASwukMDCmaFkBAYtwJItK8DCmaFssExBUkdFX0FSUkFZX1NJWkWSLTLAwMArkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVW5pcS5qc5ihcgAQwMCRLMDCmaFkAc0Csi/AmTAxMjM0NTYvLMDCmaFsqGJhc2VVbmlxki85wMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVVuaXEuanOYoXIJCMAwkS7AwpihckMNwDGREcDCmKFyzJgRwDKRFcDCmKFyGRDAM5EswMKYoXIkCcA0kSLAwpihciYKwDWRCcDCmKFyMwjANpEZwMKYoXIRCMDAkQ3AwpihZwEDOMCQwMKYoWcJCznAkTnAwpihcgAIwMCRLsDC
====catalogjs annotation end====*/