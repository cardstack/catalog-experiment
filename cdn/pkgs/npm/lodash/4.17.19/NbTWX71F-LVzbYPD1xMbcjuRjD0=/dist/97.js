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
k5SVwqcuLzk4LmpzA8LAlcKoLi8xMjMuanMGwsCVwqguLzEzNS5qcwnCwJXCqC4vMTE3LmpzDMLAgadkZWZhdWx0laFsq2Jhc2VQdWxsQWxsIsDA3AAkl6FvAAADwJDAmaFkCQACwJECwMKZoWmoYXJyYXlNYXCSAh3AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2Jhc2VJbmRleE9mkgUbwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARMECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaliYXNlVW5hcnmSCB7AAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqWNvcHlBcnJheZILHMADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQETCg2QwMIDwsDAl6FvAQAOEJDAmaFkAMzYD8CRD8DCmaFsr2Jhc2VJbmRleE9mV2l0aJIPGsDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJbmRleE9mV2l0aC5qc5ihcgkPwMCRDsDCl6FvAQARIZDAmKFnAAESFJDAwpmhZAQSE8CSExHAwpmhbKphcnJheVByb3RvkhMXwMDAEZDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVB1bGxBbGwuanOYoXIACsDAkRLAwpihZwEBFRiQwMKZoWQEBxbAlBcWFBLAwpmhbKZzcGxpY2WTFh8gwMDAFJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVB1bGxBbGwuanOYoXIABsAXkRXAwpihcgMKwMCREsDCmaFkATgZwJkaGxwdHh8gGRXAwpmhbKtiYXNlUHVsbEFsbJIZI8DAwMCQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VQdWxsQWxsLmpzmKFyCQvAGpEYwMKYoXJFD8AbkQ7AwpihcgMLwByRBMDCmKFybgnAHZEKwMKYoXIsCMAekQHAwpihcggJwB+RB8DCmKFyzQERBsAgkRXAwpihcioGwMCRFcDCmKFnAQMiwJDAwpihZwkLI8CRI8DCmKFyAAvAwJEYwMI=
====catalogjs annotation end====*/