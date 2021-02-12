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
k5eVwqcuLzY3LmpzA8LAlcKqLi4vbm9vcC5qcwbCwJXCqC4vMTU0LmpzCcLAlcKnLi82NC5qcwzCwJXCqC4vMTIwLmpzD8LAlcKoLi8xNjIuanMSwsCVwqguLzE1Mi5qcxXCwIGnZGVmYXVsdJWhbKhiYXNlVW5pcTHAwNwAM5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFppFNldDCUAh0fIsAAp2RlZmF1bHTAwMCYoXILBMDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmkbm9vcJIFIcABp2RlZmF1bHTAwMCYoXILBMDAkQTAwpyhaQEVBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmqc2V0VG9BcnJheZMIHi3AAqdkZWZhdWx0wMDAmKFyCwrAwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqFNldENhY2hlkgsvwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARIKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaa1hcnJheUluY2x1ZGVzkg4pwASnZGVmYXVsdMDAwJihcgsNwMCRDcDCnKFpARMNEpDAwgTCwMCZoWQJABHAkRHAwpmhabFhcnJheUluY2x1ZGVzV2l0aJIRKsAFp2RlZmF1bHTAwMCYoXILEcDAkRDAwpyhaQETEBWQwMIFwsDAmaFkCQAUwJEUwMKZoWmoY2FjaGVIYXOSFC7ABqdkZWZhdWx0wMDAmKFyCwjAwJETwMKcoWkBExMWkMDCBsLAwJehbwEAFyOQwJihZwABGBqQwMKZoWQECBnAkhkXwMKZoWyoSU5GSU5JVFmSGSDAwMAXkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVTZXQuanOYoXIACMDAkRjAwpihZwEBG8CQwMKZoWQECxzAmR0eHyAhIhwaGMDCmaFsqWNyZWF0ZVNldJIcLMDAwBqQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZVNldC5qc5ihcgAJwB2RG8DCmKFyBQTAHpEBwMKYoXIICsAfkQfAwpihcgUEwCCRAcDCmKFyEAjAIZEYwMKYoXIEBMAikQTAwpihciQEwMCRAcDCl6FvAQAkMJDAmKFnAAElJ5DAwpmhZAQGJsCSJiTAwpmhbLBMQVJHRV9BUlJBWV9TSVpFkiYrwMDAJJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVVuaXEuanOYoXIAEMDAkSXAwpmhZAHNArIowJkpKissLS4vKCXAwpmhbKhiYXNlVW5pcZIoMsDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VVbmlxLmpzmKFyCQjAKZEnwMKYoXJDDcAqkQ3AwpihcsyYEcArkRDAwpihchkQwCyRJcDCmKFyJAnALZEbwMKYoXImCsAukQfAwpihcjMIwC+RE8DCmKFyEQjAwJEKwMKYoWcBAzHAkMDCmKFnCQsywJEywMKYoXIACMDAkSfAwg==
====catalogjs annotation end====*/