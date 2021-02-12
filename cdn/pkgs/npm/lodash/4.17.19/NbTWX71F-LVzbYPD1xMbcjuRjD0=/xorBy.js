import { default as arrayFilter } from "./dist/150.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var xorBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee, 2));
});
export { xorBy as default };
/*====catalogjs annotation start====
k5aVwq0uL2Rpc3QvMTUwLmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvNjAuanMMwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAlcKpLi9sYXN0LmpzEsLAgadkZWZhdWx0laFspXhvckJ5IMDA3AAil6FvAAADwJEVwJmhZAkAAsCRAsDCmaFpq2FycmF5RmlsdGVykgIcwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxiYXNlSXRlcmF0ZWWSBR7AAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGJhc2VSZXN0kggYwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaadiYXNlWG9ykgsbwAOnZGVmYXVsdMDAwJihcgsHwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhabFpc0FycmF5TGlrZU9iamVjdJMOGh3ABKdkZWZhdWx0wMDAmKFyCxHAwJENwMKcoWkBIQ0SkMDCBMLAwJmhZAkAEcCREcDCmaFppGxhc3SSERnABadkZWZhdWx0wMDAmKFyCwTAwJEQwMKcoWkBFBATkMDCBcLAwJehbwEAFB+QwJihZwABFcCQwMKZoWQEABbAkxYUF8DCmaFspXhvckJ5khYhwMDAFJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy94b3JCeS5qc5ihcgAFwBeRFcDCmKFnAxIYwJcYGRobHB0ewMKYoXIACMAZkQfAwpihciYEwBqREMDCmKFyERHAG5ENwMKYoXI2B8AckQrAwpihcgELwB2RAcDCmKFyCRHAHpENwMKYoXIDDMDAkQTAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAFwMCRFcDC
====catalogjs annotation end====*/