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
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKtLi9kaXN0LzEyNS5qcwbCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0lKFsq2xhc3RJbmRleE9mHMDcAB6XoW8AAAPAkMCZoWQJAALAkQLAwpihaa1iYXNlRmluZEluZGV4kgIZwACnZGVmYXVsdMDAmKFyCw3AwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWJhc2VJc05hTpIFGsABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBXAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALDZDAmaFkAMygDMCRDMDCmKFssXN0cmljdExhc3RJbmRleE9mkgwYwMDAwNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zdHJpY3RMYXN0SW5kZXhPZi5qc5ihcgkRwMCRC8DCl6FvAQAOG5DAmKFnAAEPE5DAwpmhZAQLEBGSEA7AwpihbKluYXRpdmVNYXiSEBbAwMAO2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbGFzdEluZGV4T2YuanOYoXIACcDAkQ/AwpmhZAYLEsCSEg7AwpihbKluYXRpdmVNaW6SEhfAwMAO2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbGFzdEluZGV4T2YuanOYoXIACcDAkRHAwpmhZAERFMCZFRYXGBkaFA8RwMKYoWyrbGFzdEluZGV4T2aSFB3AwMDA2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbGFzdEluZGV4T2YuanOYoXIJC8AVkRPAwpihcsy3CcAWkQfAwpihciUJwBeRD8DCmKFyFgnAGJERwMKYoXI1EcAZkQvAwpihchgNwBqRAcDCmKFyCAnAwJEEwMKYoWcBAxzAkMDCmKFnCQsdwJEdwMKYoXIAC8DAkRPAwg==
====catalogjs annotation end====*/