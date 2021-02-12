import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max,
    nativeMin = Math.min;
function findLastIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = length - 1;

  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }

  return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}
export { findLastIndex as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwq4uL3RvSW50ZWdlci5qcwnCwIGnZGVmYXVsdJWhbK1maW5kTGFzdEluZGV4GMDA3AAal6FvAAADwJDAmaFkCQACwJECwMKZoWmtYmFzZUZpbmRJbmRleJICFcAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsYmFzZUl0ZXJhdGVlkgUWwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpmhaal0b0ludGVnZXKSCBLAAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGQcKkMDCAsLAwJehbwEACxeQwJihZwABDBCQwMKZoWQECw0Okg0LwMKZoWypbmF0aXZlTWF4kg0TwMDAC5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kTGFzdEluZGV4LmpzmKFyAAnAwJEMwMKZoWQGCw/Akg8LwMKZoWypbmF0aXZlTWlukg8UwMDAC5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kTGFzdEluZGV4LmpzmKFyAAnAwJEOwMKZoWQBHxHAmBITFBUWEQwOwMKZoWytZmluZExhc3RJbmRleJIRGcDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmluZExhc3RJbmRleC5qc5ihcgkNwBKREMDCmKFyzL8JwBORB8DCmKFyKQnAFJEMwMKYoXIWCcAVkQ7AwpihciMNwBaRAcDCmKFyCAzAwJEEwMKYoWcBAxjAkMDCmKFnCQsZwJEZwMKYoXIADcDAkRDAwg==
====catalogjs annotation end====*/