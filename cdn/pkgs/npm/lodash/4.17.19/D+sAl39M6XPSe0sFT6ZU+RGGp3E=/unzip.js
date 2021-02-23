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
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0Lzk4LmpzB8LAlcKtLi9kaXN0LzE1Ni5qcwvCwJXCrS4vZGlzdC8xMzQuanMPwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzE8LAgadkZWZhdWx0laFspXVuemlwIsDA3AAkl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYXJyYXlGaWx0ZXKSAhvAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmoYXJyYXlNYXCSBh/AAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmsYmFzZVByb3BlcnR5kgogwAKnZGVmYXVsdMDAwJihcgsMwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpqWJhc2VUaW1lc5IOHsADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgPwMCQwMKZoWQJABIUkRLAwpmhabFpc0FycmF5TGlrZU9iamVjdJISHMAEp2RlZmF1bHTAwMCYoXILEcDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgYwMCQwMKXoW8BABYhkMCYoWcAARcZkMDCmaFkBAsYwJIYFsDCmaFsqW5hdGl2ZU1heJIYHcDAwBaQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW56aXAuanOYoXIACcDAkRfAwpmhZAERGsCYGxwdHh8gGhfAwpmhbKV1bnppcJIaI8DAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW56aXAuanOYoXIJBcAbkRnAwpihclwLwByRAcDCmKFyIxHAHZERwMKYoXIaCcAekRfAwpihckAJwB+RDcDCmKFyJwjAIJEFwMKYoXIIDMDAkQnAwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgAFwMCRGcDC
====catalogjs annotation end====*/