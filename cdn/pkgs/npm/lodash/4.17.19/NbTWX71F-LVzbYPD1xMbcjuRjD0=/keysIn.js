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
k5SVwq0uL2lzT2JqZWN0LmpzA8LAlcKtLi9kaXN0LzEzMy5qcwfCwJXCrC4vZGlzdC84NC5qcwvCwJXCsC4vaXNBcnJheUxpa2UuanMPwsCBp2RlZmF1bHSVoWyma2V5c0luKcDA3AArl6FvAAADwJDAmaFkCQACBJECwMKZoWmoaXNPYmplY3SSAh7AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmraXNQcm90b3R5cGWSBiDAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmtYXJyYXlMaWtlS2V5c5IKJsACp2RlZmF1bHTAwMCYoXILDcDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7Awpmhaatpc0FycmF5TGlrZZIOJcADp2RlZmF1bHTAwMCYoXILC8DAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgSwMCQwMKXoW8BABIUkMCZoWQAzJITwJETwMKZoWysbmF0aXZlS2V5c0lukhMfwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbmF0aXZlS2V5c0luLmpzmKFyCQzAwJESwMKXoW8BABUikMCYoWcAARYYkMDCmaFkBBMXwJIXFcDCmaFsq29iamVjdFByb3RvkhcbwMDAFZDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUtleXNJbi5qc5ihcgALwMCRFsDCmKFnAQEZHJDAwpmhZAQPGsCUGxoYFsDCmaFsr2hhc093blByb3BlcnR5MJIaIcDAwBiQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VLZXlzSW4uanOYoXIAD8AbkRnAwpihcgMLwMCRFsDCmaFkAU0dwJYeHyAhHRnAwpmhbKpiYXNlS2V5c0lukh0nwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUtleXNJbi5qc5ihcgkKwB6RHMDCmKFyEgjAH5EBwMKYoXIXDMAgkRLAwpihch8LwCGRBcDCmKFyaQ/AwJEZwMKXoW8BACMokMCZoWQACyTAlCUmJyTAwpmhbKZrZXlzSW6SJCrAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2tleXNJbi5qc5ihcgkGwCWRI8DCmKFyFAvAJpENwMKYoXILDcAnkQnAwpihchEKwMCRHMDCmKFnAQMpwJDAwpihZwkLKsCRKsDCmKFyAAbAwJEjwMI=
====catalogjs annotation end====*/