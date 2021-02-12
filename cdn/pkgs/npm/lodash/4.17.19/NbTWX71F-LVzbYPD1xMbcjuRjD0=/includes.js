import { default as baseIndexOf } from "./dist/123.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as toInteger } from "./toInteger.js";
import { default as values } from "./values.js";
var nativeMax = Math.max;
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
  var length = collection.length;

  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }

  return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
export { includes as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTIzLmpzA8LAlcKwLi9pc0FycmF5TGlrZS5qcwbCwJXCrS4vaXNTdHJpbmcuanMJwsCVwq4uL3RvSW50ZWdlci5qcwzCwJXCqy4vdmFsdWVzLmpzD8LAgadkZWZhdWx0laFsqGluY2x1ZGVzHcDA3AAfl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZUluZGV4T2aSAhvAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2lzQXJyYXlMaWtlkgUWwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARsECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahpc1N0cmluZ5IIGsACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKZoWmpdG9JbnRlZ2VykgsYwAOnZGVmYXVsdMDAwJihcgsJwMCRCsDCnKFpARkKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhaaZ2YWx1ZXOSDhfABKdkZWZhdWx0wMDAmKFyCwbAwJENwMKcoWkBFg0QkMDCBMLAwJehbwEAERyQwJihZwABEhSQwMKZoWQECxPAkhMRwMKZoWypbmF0aXZlTWF4khMZwMDAEZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbmNsdWRlcy5qc5ihcgAJwMCREsDCmaFkASYVwJgWFxgZGhsVEsDCmaFsqGluY2x1ZGVzkhUewMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbmNsdWRlcy5qc5ihcgkIwBaRFMDCmKFyNwvAF5EEwMKYoXIcBsAYkQ3AwpihcjIJwBmRCsDCmKFyWwnAGpESwMKYoXInCMAbkQfAwpihcl4LwMCRAcDCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAjAwJEUwMI=
====catalogjs annotation end====*/