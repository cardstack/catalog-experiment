import { default as arrayEach } from "./dist/119.js";
import { default as baseCreate } from "./dist/106.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as getPrototype } from "./dist/137.js";
import { default as isArray } from "./isArray.js";
import { default as isBuffer } from "./isBuffer.js";
import { default as isFunction } from "./isFunction.js";
import { default as isObject } from "./isObject.js";
import { default as isTypedArray } from "./isTypedArray.js";
function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);
  iteratee = baseIteratee(iteratee, 4);

  if (accumulator == null) {
    var Ctor = object && object.constructor;

    if (isArrLike) {
      accumulator = isArr ? new Ctor() : [];
    } else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    } else {
      accumulator = {};
    }
  }

  (isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}
export { transform as default };
/*====catalogjs annotation start====
k5qVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEwNi5qcwbCwJXCrC4vZGlzdC83Ny5qcwnCwJXCqy4vZGlzdC82LmpzDMLAlcKtLi9kaXN0LzEzNy5qcw/CwJXCrC4vaXNBcnJheS5qcxLCwJXCrS4vaXNCdWZmZXIuanMVwsCVwq8uL2lzRnVuY3Rpb24uanMYwsCVwq0uL2lzT2JqZWN0LmpzG8LAlcKxLi9pc1R5cGVkQXJyYXkuanMewsCBp2RlZmF1bHSVoWypdHJhbnNmb3JtLcDA3AAvl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYXJyYXlFYWNokgIqwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaapiYXNlQ3JlYXRlkgUowAGnZGVmYXVsdMDAwJihcgsKwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaapiYXNlRm9yT3dukggrwAKnZGVmYXVsdMDAwJihcgsKwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaaxiYXNlSXRlcmF0ZWWSCyXAA6dkZWZhdWx0wMDAmKFyCwzAwJEKwMKcoWkBFgoPkMDCA8LAwJmhZAkADsCRDsDCmaFprGdldFByb3RvdHlwZZIOKcAEp2RlZmF1bHTAwMCYoXILDMDAkQ3AwpyhaQEYDRKQwMIEwsDAmaFkCQARwJERwMKZoWmnaXNBcnJheZIRIsAFp2RlZmF1bHTAwMCYoXILB8DAkRDAwpyhaQEXEBWQwMIFwsDAmaFkCQAUwJEUwMKZoWmoaXNCdWZmZXKSFCPABqdkZWZhdWx0wMDAmKFyCwjAwJETwMKcoWkBGBMYkMDCBsLAwJmhZAkAF8CRF8DCmaFpqmlzRnVuY3Rpb26SFyfAB6dkZWZhdWx0wMDAmKFyCwrAwJEWwMKcoWkBGhYbkMDCB8LAwJmhZAkAGsCRGsDCmaFpqGlzT2JqZWN0khomwAinZGVmYXVsdMDAwJihcgsIwMCRGcDCnKFpARgZHpDAwgjCwMCZoWQJAB3AkR3Awpmhaaxpc1R5cGVkQXJyYXmSHSTACadkZWZhdWx0wMDAmKFyCwzAwJEcwMKcoWkBHBwfkMDCCcLAwJehbwEAICyQwJmhZADMgSHAmyIjJCUmJygpKishwMKZoWypdHJhbnNmb3JtkiEuwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmFuc2Zvcm0uanOYoXIJCcAikSDAwpihcjAHwCOREMDCmKFyJQjAJJETwMKYoXIMDMAlkRzAwpihchcMwCaRCsDCmKFyzKwIwCeRGcDCmKFyIArAKJEWwMKYoXIJCsApkQTAwpihcgEMwCqRDcDCmKFyTwnAK5EBwMKYoXIDCsDAkQfAwpihZwEDLcCQwMKYoWcJCy7AkS7AwpihcgAJwMCRIMDC
====catalogjs annotation end====*/