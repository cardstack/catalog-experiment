import { default as baseSortedIndexBy } from "./31.js";
import { default as identity } from "../identity.js";
import { default as isSymbol } from "../isSymbol.js";
var MAX_ARRAY_LENGTH = 4294967295,
    HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
function baseSortedIndex(array, value, retHighest) {
  var low = 0,
      high = array == null ? low : array.length;

  if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
    while (low < high) {
      var mid = low + high >>> 1,
          computed = array[mid];

      if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return high;
  }

  return baseSortedIndexBy(array, value, identity, retHighest);
}
export { baseSortedIndex as default };
/*====catalogjs annotation start====
k5OVwqcuLzMxLmpzA8LAlcKuLi4vaWRlbnRpdHkuanMHwsCVwq4uLi9pc1N5bWJvbC5qcwvCwIGnZGVmYXVsdJWhbK9iYXNlU29ydGVkSW5kZXgbwMDcAB2XoW8AAAPAkMCZoWQJAAIEkQLAwpmhabFiYXNlU29ydGVkSW5kZXhCeZICGMAAp2RlZmF1bHTAwMCYoXILEcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaahpZGVudGl0eZIGGcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgQwMCQwMKZoWQJAAoMkQrAwpmhaahpc1N5bWJvbJIKF8ACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgQwMCQwMKXoW8BAA4akMCYoWcAAQ8UkMDCmaFkBA0QEZIQDsDCmaFssE1BWF9BUlJBWV9MRU5HVEiSEBPAwMAOkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU29ydGVkSW5kZXguanOYoXIAEMDAkQ/AwpmhZAYGEsCUExIOD8DCmaFstUhBTEZfTUFYX0FSUkFZX0xFTkdUSJISFsDAwA6Q2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VTb3J0ZWRJbmRleC5qc5ihcgAVwBOREcDCmKFyAxDAwJEPwMKZoWQBEBXAlhYXGBkVEcDCmaFsr2Jhc2VTb3J0ZWRJbmRleJIVHMDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VTb3J0ZWRJbmRleC5qc5ihcgkPwBaRFMDCmKFyzJsVwBeREcDCmKFyzIEIwBiRCcDCmKFyzK0RwBmRAcDCmKFyDwjAwJEFwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIAD8DAkRTAwg==
====catalogjs annotation end====*/