import { default as baseKeys } from "./dist/132.js";
import { default as getTag } from "./dist/45.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as stringSize } from "./dist/144.js";
var mapTag = '[object Map]',
    setTag = '[object Set]';
function size(collection) {
  if (collection == null) {
    return 0;
  }

  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }

  var tag = getTag(collection);

  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }

  return baseKeys(collection).length;
}
export { size as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTMyLmpzA8LAlcKsLi9kaXN0LzQ1LmpzBsLAlcKwLi9pc0FycmF5TGlrZS5qcwnCwJXCrS4vaXNTdHJpbmcuanMMwsCVwq0uL2Rpc3QvMTQ0LmpzD8LAgadkZWZhdWx0laFspHNpemUgwMDcACKXoW8AAAPAkMCZoWQJAALAkQLAwpmhaahiYXNlS2V5c5ICHsAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmmZ2V0VGFnkgUbwAGnZGVmYXVsdMDAwJihcgsGwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaatpc0FycmF5TGlrZZIIGMACp2RlZmF1bHTAwMCYoXILC8DAkQfAwpyhaQEbBwyQwMICwsDAmaFkCQALwJELwMKZoWmoaXNTdHJpbmeSCxnAA6dkZWZhdWx0wMDAmKFyCwjAwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmaFpqnN0cmluZ1NpemWSDhrABKdkZWZhdWx0wMDAmKFyCwrAwJENwMKcoWkBGA0QkMDCBMLAwJehbwEAER+QwJihZwABEhaQwMKZoWQEERMUkhMRwMKZoWymbWFwVGFnkhMcwMDAEZDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zaXplLmpzmKFyAAbAwJESwMKZoWQGERXAkhURwMKZoWymc2V0VGFnkhUdwMDAEZDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zaXplLmpzmKFyAAbAwJEUwMKZoWQBFhfAmhgZGhscHR4XEhTAwpmhbKRzaXplkhchwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zaXplLmpzmKFyCQTAGJEWwMKYoXJEC8AZkQfAwpihchsIwBqRCsDCmKFyDwrAG5ENwMKYoXIzBsAckQTAwpihchwGwB2REsDCmKFyCwbAHpEUwMKYoXIuCMDAkQHAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAEwMCRFsDC
====catalogjs annotation end====*/