import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var difference = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
export { difference as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAgadkZWZhdWx0lKFsqmRpZmZlcmVuY2UYwNwAGpehbwAAA8CRD8CZoWQJAALAkQLAwpihaa5iYXNlRGlmZmVyZW5jZZICFMAAp2RlZmF1bHTAwJihcgsOwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaatiYXNlRmxhdHRlbpIFFcABp2RlZmF1bHTAwJihcgsLwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaahiYXNlUmVzdJIIEsACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihabFpc0FycmF5TGlrZU9iamVjdJMLExbAA6dkZWZhdWx0wMCYoXILEcDAkQrAwpyhaQEhCg2QwMIDwsDAl6FvAQAOF5DAmKFnAAEPwJDAwpmhZAQAEMCTEA4RwMKYoWyqZGlmZmVyZW5jZZIQGcDAwA7ZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kaWZmZXJlbmNlLmpzmKFyAArAEZEPwMKYoWcDERLAlhITFBUWD8DCmKFyAAjAE5EHwMKYoXIlEcAUkQrAwpihcgoOwBWRAcDCmKFyCAvAFpEEwMKYoXIMEcDAkQrAwpihZwEDGMCQwMKYoWcJCxnAkRnAwpihcgAKwMCRD8DC
====catalogjs annotation end====*/