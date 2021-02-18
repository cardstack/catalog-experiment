import { default as isSymbol } from "../isSymbol.js";
var MAX_ARRAY_LENGTH = 4294967295,
    MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;
var nativeFloor = Math.floor,
    nativeMin = Math.min;
function baseSortedIndexBy(array, value, iteratee, retHighest) {
  var low = 0,
      high = array == null ? 0 : array.length;

  if (high === 0) {
    return 0;
  }

  value = iteratee(value);
  var valIsNaN = value !== value,
      valIsNull = value === null,
      valIsSymbol = isSymbol(value),
      valIsUndefined = value === undefined;

  while (low < high) {
    var mid = nativeFloor((low + high) / 2),
        computed = iteratee(array[mid]),
        othIsDefined = computed !== undefined,
        othIsNull = computed === null,
        othIsReflexive = computed === computed,
        othIsSymbol = isSymbol(computed);

    if (valIsNaN) {
      var setLow = retHighest || othIsReflexive;
    } else if (valIsUndefined) {
      setLow = othIsReflexive && (retHighest || othIsDefined);
    } else if (valIsNull) {
      setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
    } else if (valIsSymbol) {
      setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
    } else if (othIsNull || othIsSymbol) {
      setLow = false;
    } else {
      setLow = retHighest ? computed <= value : computed < value;
    }

    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return nativeMin(high, MAX_ARRAY_INDEX);
}
export { baseSortedIndexBy as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbLFiYXNlU29ydGVkSW5kZXhCeRnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGlzU3ltYm9skwITFcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgQwMCQwMKXoW8BAAYYkMCYoWcAAQcMkMDCmaFkBA0ICZIIBsDCmaFssE1BWF9BUlJBWV9MRU5HVEiSCAvAwMAGkNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU29ydGVkSW5kZXhCeS5qc5ihcgAQwMCRB8DCmaFkBgQKwJQLCgYHwMKZoWyvTUFYX0FSUkFZX0lOREVYkgoXwMDABpDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNvcnRlZEluZGV4QnkuanOYoXIAD8ALkQnAwpihcgMQwMCRB8DCmKFnAQENEZDAwpmhZAQNDg+SDgzAwpmhbKtuYXRpdmVGbG9vcpIOFMDAwAyQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VTb3J0ZWRJbmRleEJ5LmpzmKFyAAvAwJENwMKZoWQGCxDAkhAMwMKZoWypbmF0aXZlTWlukhAWwMDADJDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNvcnRlZEluZGV4QnkuanOYoXIACcDAkQ/AwpmhZAEEEsCZExQVFhcSDQ8JwMKZoWyxYmFzZVNvcnRlZEluZGV4QnmSEhrAwMDAkNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU29ydGVkSW5kZXhCeS5qc5ihcgkRwBOREcDCmKFyzQEACMAUkQHAwpihclsLwBWRDcDCmKFyzNkIwBaRAcDCmKFyzQKHCcAXkQ/AwpihcgcPwMCRCcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyABHAwJERwMI=
====catalogjs annotation end====*/