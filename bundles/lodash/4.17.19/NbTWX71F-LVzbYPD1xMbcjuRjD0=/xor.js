import { default as arrayFilter } from "./dist/150.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var xor = baseRest(function (arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});
export { xor as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKsLi9kaXN0LzYwLmpzCcLAlcK2Li9pc0FycmF5TGlrZU9iamVjdC5qcwzCwIGnZGVmYXVsdJShbKN4b3IXwNwAGZehbwAAA8CRD8CZoWQJAALAkQLAwpihaathcnJheUZpbHRlcpICFMAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahiYXNlUmVzdJIFEsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaadiYXNlWG9ykggTwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpsWlzQXJyYXlMaWtlT2JqZWN0kgsVwAOnZGVmYXVsdMDAmKFyCxHAwJEKwMKcoWkBIQoNkMDCA8LAwJehbwEADhaQwJihZwABD8CQwMKZoWQEABDAkxAOEcDCmKFso3hvcpIQGMDAwA7ZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy94b3IuanOYoXIAA8ARkQ/AwpihZwMGEsCVEhMUFQ/AwpihcgAIwBORBMDCmKFyHgfAFJEHwMKYoXIBC8AVkQHAwpihcgkRwMCRCsDCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAAPAwJEPwMI=
====catalogjs annotation end====*/