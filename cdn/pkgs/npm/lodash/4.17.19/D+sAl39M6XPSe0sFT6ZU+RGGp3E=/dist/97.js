import { default as arrayMap } from "./98.js";
import { default as baseIndexOf } from "./123.js";
import { default as baseUnary } from "./135.js";
import { default as copyArray } from "./117.js";
function baseIndexOfWith(array, value, fromIndex, comparator) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }

  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }

  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }

  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }

      splice.call(array, fromIndex, 1);
    }
  }

  return array;
}
export { basePullAll as default };
/*====catalogjs annotation start====
k5SVwqcuLzk4LmpzA8LAlcKoLi8xMjMuanMHwsCVwqguLzEzNS5qcwvCwJXCqC4vMTE3LmpzD8LAgadkZWZhdWx0laFsq2Jhc2VQdWxsQWxsJsDA3AAol6FvAAADwJDAmaFkCQACBJECwMKZoWmoYXJyYXlNYXCSAiHAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmrYmFzZUluZGV4T2aSBh/AAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICsDAkMDCmaFkCQAKDJEKwMKZoWmpYmFzZVVuYXJ5kgoiwAKnZGVmYXVsdMDAwJihcgsJwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpqWNvcHlBcnJheZIOIMADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgKwMCQwMKXoW8BABIUkMCZoWQAzNgTwJETwMKZoWyvYmFzZUluZGV4T2ZXaXRokhMewMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUluZGV4T2ZXaXRoLmpzmKFyCQ/AwJESwMKXoW8BABUlkMCYoWcAARYYkMDCmaFkBBIXwJIXFcDCmaFsqmFycmF5UHJvdG+SFxvAwMAVkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUHVsbEFsbC5qc5ihcgAKwMCRFsDCmKFnAQEZHJDAwpmhZAQHGsCUGxoYFsDCmaFspnNwbGljZZMaIyTAwMAYkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUHVsbEFsbC5qc5ihcgAGwBuRGcDCmKFyAwrAwJEWwMKZoWQBOB3AmR4fICEiIyQdGcDCmaFsq2Jhc2VQdWxsQWxskh0nwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVB1bGxBbGwuanOYoXIJC8AekRzAwpihckUPwB+REsDCmKFyAwvAIJEFwMKYoXJuCcAhkQ3AwpihciwIwCKRAcDCmKFyCAnAI5EJwMKYoXLNAREGwCSRGcDCmKFyKgbAwJEZwMKYoWcBAybAkMDCmKFnCQsnwJEnwMKYoXIAC8DAkRzAwg==
====catalogjs annotation end====*/