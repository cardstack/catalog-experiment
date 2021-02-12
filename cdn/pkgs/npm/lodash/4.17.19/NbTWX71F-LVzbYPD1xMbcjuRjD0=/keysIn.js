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
var hasOwnProperty0 = objectProto.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }

  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty0.call(object, key)))) {
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
k5SVwq0uL2lzT2JqZWN0LmpzA8LAlcKtLi9kaXN0LzEzMy5qcwbCwJXCrC4vZGlzdC84NC5qcwnCwJXCsC4vaXNBcnJheUxpa2UuanMMwsCBp2RlZmF1bHSVoWyma2V5c0luJcDA3AAnl6FvAAADwJDAmaFkCQACwJECwMKZoWmoaXNPYmplY3SSAhrAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2lzUHJvdG90eXBlkgUcwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaa1hcnJheUxpa2VLZXlzkggiwAKnZGVmYXVsdMDAwJihcgsNwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaatpc0FycmF5TGlrZZILIcADp2RlZmF1bHTAwMCYoXILC8DAkQrAwpyhaQEbCg2QwMIDwsDAl6FvAQAOEJDAmaFkAMySD8CRD8DCmaFsrG5hdGl2ZUtleXNJbpIPG8DAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX25hdGl2ZUtleXNJbi5qc5ihcgkMwMCRDsDCl6FvAQARHpDAmKFnAAESFJDAwpmhZAQTE8CSExHAwpmhbKtvYmplY3RQcm90b5ITF8DAwBGQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VLZXlzSW4uanOYoXIAC8DAkRLAwpihZwEBFRiQwMKZoWQEDxbAlBcWFBLAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSFh3AwMAUkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlS2V5c0luLmpzmKFyAA/AF5EVwMKYoXIDC8DAkRLAwpmhZAFNGcCWGhscHRkVwMKZoWyqYmFzZUtleXNJbpIZI8DAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VLZXlzSW4uanOYoXIJCsAakRjAwpihchIIwBuRAcDCmKFyFwzAHJEOwMKYoXIfC8AdkQTAwpihcmkPwMCRFcDCl6FvAQAfJJDAmaFkAAsgwJQhIiMgwMKZoWyma2V5c0lukiAmwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9rZXlzSW4uanOYoXIJBsAhkR/AwpihchQLwCKRCsDCmKFyCw3AI5EHwMKYoXIRCsDAkRjAwpihZwEDJcCQwMKYoWcJCybAkSbAwpihcgAGwMCRH8DC
====catalogjs annotation end====*/