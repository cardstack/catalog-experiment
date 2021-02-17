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
k5aVwq0uL2Rpc3QvMTUwLmpzA8LAlcKrLi9kaXN0LzYuanMHwsCVwqwuL2Rpc3QvNDkuanMLwsCVwqwuL2Rpc3QvNjAuanMPwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzE8LAlcKpLi9sYXN0LmpzF8LAgadkZWZhdWx0laFspXhvckJ5JsDA3AAol6FvAAADwJEbwJmhZAkAAgSRAsDCmaFpq2FycmF5RmlsdGVykgIiwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprGJhc2VJdGVyYXRlZZIGJMABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgNwMCQwMKZoWQJAAoMkQrAwpmhaahiYXNlUmVzdJIKHsACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7AwpmhaadiYXNlWG9ykg4hwAOnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFpsWlzQXJyYXlMaWtlT2JqZWN0kxIgI8AEp2RlZmF1bHTAwMCYoXILEcDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgYwMCQwMKZoWQJABYYkRbAwpmhaaRsYXN0khYfwAWnZGVmYXVsdMDAwJihcgsEwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCAvAwJDAwpehbwEAGiWQwJihZwABG8CQwMKZoWQEABzAkxwaHcDCmaFspXhvckJ5khwnwMDAGpDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy94b3JCeS5qc5ihcgAFwB2RG8DCmKFnAxIewJceHyAhIiMkwMKYoXIACMAfkQnAwpihciYEwCCRFcDCmKFyERHAIZERwMKYoXI2B8AikQ3AwpihcgELwCORAcDCmKFyCRHAJJERwMKYoXIDDMDAkQXAwpihZwEDJsCQwMKYoWcJCyfAkSfAwpihcgAFwMCRG8DC
====catalogjs annotation end====*/