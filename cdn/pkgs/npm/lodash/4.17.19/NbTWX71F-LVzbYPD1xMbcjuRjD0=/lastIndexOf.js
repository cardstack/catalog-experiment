import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIsNaN } from "./dist/125.js";
import { default as toInteger } from "./toInteger.js";
function strictLastIndexOf(array, value, fromIndex) {
  var index = fromIndex + 1;

  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }

  return index;
}
var nativeMax = Math.max,
    nativeMin = Math.min;
function lastIndexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = length;

  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }

  return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
}
export { lastIndexOf as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKtLi9kaXN0LzEyNS5qcwbCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0laFsq2xhc3RJbmRleE9mHMDA3AAel6FvAAADwJDAmaFkCQACwJECwMKZoWmtYmFzZUZpbmRJbmRleJICGcAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpYmFzZUlzTmFOkgUawAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaal0b0ludGVnZXKSCBXAAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGQcKkMDCAsLAwJehbwEACw2QwJmhZADMoAzAkQzAwpmhbLFzdHJpY3RMYXN0SW5kZXhPZpIMGMDAwMCQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3N0cmljdExhc3RJbmRleE9mLmpzmKFyCRHAwJELwMKXoW8BAA4bkMCYoWcAAQ8TkMDCmaFkBAsQEZIQDsDCmaFsqW5hdGl2ZU1heJIQFsDAwA6Q2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbGFzdEluZGV4T2YuanOYoXIACcDAkQ/AwpmhZAYLEsCSEg7AwpmhbKluYXRpdmVNaW6SEhfAwMAOkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2xhc3RJbmRleE9mLmpzmKFyAAnAwJERwMKZoWQBERTAmRUWFxgZGhQPEcDCmaFsq2xhc3RJbmRleE9mkhQdwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9sYXN0SW5kZXhPZi5qc5ihcgkLwBWRE8DCmKFyzLcJwBaRB8DCmKFyJQnAF5EPwMKYoXIWCcAYkRHAwpihcjURwBmRC8DCmKFyGA3AGpEBwMKYoXIICcDAkQTAwpihZwEDHMCQwMKYoWcJCx3AkR3AwpihcgALwMCRE8DC
====catalogjs annotation end====*/