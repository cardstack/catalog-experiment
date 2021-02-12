import { default as arrayFilter } from "./dist/150.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseProperty } from "./dist/156.js";
import { default as baseTimes } from "./dist/134.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var nativeMax = Math.max;
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }

  var length = 0;
  array = arrayFilter(array, function (group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function (index) {
    return arrayMap(array, baseProperty(index));
  });
}
export { unzip as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKtLi9kaXN0LzE1Ni5qcwnCwJXCrS4vZGlzdC8xMzQuanMMwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAgadkZWZhdWx0laFspXVuemlwHcDA3AAfl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYXJyYXlGaWx0ZXKSAhbAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqGFycmF5TWFwkgUawAGnZGVmYXVsdMDAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaxiYXNlUHJvcGVydHmSCBvAAqdkZWZhdWx0wMDAmKFyCwzAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqWJhc2VUaW1lc5ILGcADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmxaXNBcnJheUxpa2VPYmplY3SSDhfABKdkZWZhdWx0wMDAmKFyCxHAwJENwMKcoWkBIQ0QkMDCBMLAwJehbwEAERyQwJihZwABEhSQwMKZoWQECxPAkhMRwMKZoWypbmF0aXZlTWF4khMYwMDAEZDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bnppcC5qc5ihcgAJwMCREsDCmaFkAREVwJgWFxgZGhsVEsDCmaFspXVuemlwkhUewMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bnppcC5qc5ihcgkFwBaRFMDCmKFyXAvAF5EBwMKYoXIjEcAYkQ3AwpihchoJwBmREsDCmKFyQAnAGpEKwMKYoXInCMAbkQTAwpihcggMwMCRB8DCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAXAwJEUwMI=
====catalogjs annotation end====*/