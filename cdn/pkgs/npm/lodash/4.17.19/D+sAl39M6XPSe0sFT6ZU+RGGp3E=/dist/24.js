import { default as isIterateeCall } from "./70.js";
import { default as toFinite } from "../toFinite.js";
var nativeCeil = Math.ceil,
    nativeMax = Math.max;
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }

  return result;
}
function createRange(fromRight) {
  return function (start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }

    start = toFinite(start);

    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }

    step = step === undefined ? start < end ? 1 : -1 : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}
export { createRange as default };
/*====catalogjs annotation start====
k5KVwqcuLzcwLmpzA8LAlcKuLi4vdG9GaW5pdGUuanMHwsCBp2RlZmF1bHSVoWyrY3JlYXRlUmFuZ2UcwMDcAB6XoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa5pc0l0ZXJhdGVlQ2FsbJICFsAAp2RlZmF1bHTAwMCYoXILDsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaah0b0Zpbml0ZZQGFxgZwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCBDAwJDAwpehbwEAChOQwJihZwABCw+QwMKZoWQEDAwNkgwKwMKZoWyqbmF0aXZlQ2VpbJIMEsDAwAqQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VSYW5nZS5qc5ihcgAKwMCRC8DCmaFkBgsOwJIOCsDCmaFsqW5hdGl2ZU1heJIOEcDAwAqQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VSYW5nZS5qc5ihcgAJwMCRDcDCmaFkAcyzEMCVERIQDQvAwpmhbKliYXNlUmFuZ2WSEBrAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUmFuZ2UuanOYoXIJCcARkQ/AwpihckEJwBKRDcDCmKFyAQrAwJELwMKXoW8BABQbkMCZoWQAJRXAlhYXGBkaFcDCmaFsq2NyZWF0ZVJhbmdlkhUdwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUmFuZ2UuanOYoXIJC8AWkRTAwpihcmAOwBeRAcDCmKFyRwjAGJEFwMKYoXJkCMAZkQXAwpihckUIwBqRBcDCmKFyEwnAwJEPwMKYoWcBAxzAkMDCmKFnCQsdwJEdwMKYoXIAC8DAkRTAwg==
====catalogjs annotation end====*/