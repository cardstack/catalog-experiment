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
k5qVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEwNi5qcwbCwJXCrC4vZGlzdC83Ny5qcwnCwJXCqy4vZGlzdC82LmpzDMLAlcKtLi9kaXN0LzEzNy5qcw/CwJXCrC4vaXNBcnJheS5qcxLCwJXCrS4vaXNCdWZmZXIuanMVwsCVwq8uL2lzRnVuY3Rpb24uanMYwsCVwq0uL2lzT2JqZWN0LmpzG8LAlcKxLi9pc1R5cGVkQXJyYXkuanMewsCBp2RlZmF1bHSUoWypdHJhbnNmb3JtLcDcAC+XoW8AAAPAkMCZoWQJAALAkQLAwpihaalhcnJheUVhY2iSAirAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYmFzZUNyZWF0ZZIFKMABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaapiYXNlRm9yT3dukggrwAKnZGVmYXVsdMDAmKFyCwrAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprGJhc2VJdGVyYXRlZZILJcADp2RlZmF1bHTAwJihcgsMwMCRCsDCnKFpARYKD5DAwgPCwMCZoWQJAA7AkQ7AwpihaaxnZXRQcm90b3R5cGWSDinABKdkZWZhdWx0wMCYoXILDMDAkQ3AwpyhaQEYDRKQwMIEwsDAmaFkCQARwJERwMKYoWmnaXNBcnJheZIRIsAFp2RlZmF1bHTAwJihcgsHwMCREMDCnKFpARcQFZDAwgXCwMCZoWQJABTAkRTAwpihaahpc0J1ZmZlcpIUI8AGp2RlZmF1bHTAwJihcgsIwMCRE8DCnKFpARgTGJDAwgbCwMCZoWQJABfAkRfAwpihaappc0Z1bmN0aW9ukhcnwAenZGVmYXVsdMDAmKFyCwrAwJEWwMKcoWkBGhYbkMDCB8LAwJmhZAkAGsCRGsDCmKFpqGlzT2JqZWN0khomwAinZGVmYXVsdMDAmKFyCwjAwJEZwMKcoWkBGBkekMDCCMLAwJmhZAkAHcCRHcDCmKFprGlzVHlwZWRBcnJheZIdJMAJp2RlZmF1bHTAwJihcgsMwMCRHMDCnKFpARwcH5DAwgnCwMCXoW8BACAskMCZoWQAzIEhwJsiIyQlJicoKSorIcDCmKFsqXRyYW5zZm9ybZIhLsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmFuc2Zvcm0uanOYoXIJCcAikSDAwpihcjAHwCOREMDCmKFyJQjAJJETwMKYoXIMDMAlkRzAwpihchcMwCaRCsDCmKFyzKwIwCeRGcDCmKFyIArAKJEWwMKYoXIJCsApkQTAwpihcgEMwCqRDcDCmKFyTwnAK5EBwMKYoXIDCsDAkQfAwpihZwEDLcCQwMKYoWcJCy7AkS7AwpihcgAJwMCRIMDC
====catalogjs annotation end====*/