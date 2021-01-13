import { default as isObject } from "./isObject.js";
import { default as isPrototype } from "./dist/133.js";
import { default as arrayLikeKeys } from "./dist/84.js";
import { default as isArrayLike } from "./isArrayLike.js";
function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }

  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
export { keysIn as default };
/*====catalogjs annotation start====
k5SVwq0uL2lzT2JqZWN0LmpzA8LAlcKtLi9kaXN0LzEzMy5qcwbCwJXCrC4vZGlzdC84NC5qcwnCwJXCsC4vaXNBcnJheUxpa2UuanMMwsCBp2RlZmF1bHSUoWyma2V5c0luJcDcACeXoW8AAAPAkw4YH8CZoWQJAALAkQLAwpihaahpc09iamVjdJICGsAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaatpc1Byb3RvdHlwZZIFHMABp2RlZmF1bHTAwJihcgsLwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaa1hcnJheUxpa2VLZXlzkggiwAKnZGVmYXVsdMDAmKFyCw3AwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpq2lzQXJyYXlMaWtlkgshwAOnZGVmYXVsdMDAmKFyCwvAwJEKwMKcoWkBGwoNkMDCA8LAwJehbwEADhCQwJmhZADMkg/AkQ/AwpihbKxuYXRpdmVLZXlzSW6SDxvAwMDA2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX25hdGl2ZUtleXNJbi5qc5ihcgkMwMCRDsDCl6FvAQARHpDAmKFnAAESFJDAwpmhZAQTE8CSExHAwpihbKtvYmplY3RQcm90b5ITF8DAwBHZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUtleXNJbi5qc5ihcgALwMCREsDCmKFnAQEVGJDAwpmhZAQPFsCUFxYUEsDCmKFsrmhhc093blByb3BlcnR5khYdwMDAFNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlS2V5c0luLmpzmKFyAA7AF5EVwMKYoXIDC8DAkRLAwpmhZAFNGcCWGhscHRkVwMKYoWyqYmFzZUtleXNJbpIZI8DAwMDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUtleXNJbi5qc5ihcgkKwBqRGMDCmKFyEgjAG5EBwMKYoXIXDMAckQ7Awpihch8LwB2RBMDCmKFyaQ7AwJEVwMKXoW8BAB8kkMCZoWQACyDAlCEiIyDAwpihbKZrZXlzSW6SICbAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMva2V5c0luLmpzmKFyCQbAIZEfwMKYoXIUC8AikQrAwpihcgsNwCORB8DCmKFyEQrAwJEYwMKYoWcBAyXAkMDCmKFnCQsmwJEmwMKYoXIABsDAkR/Awg==
====catalogjs annotation end====*/