import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var unionWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});
export { unionWith as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvODUuanMDwsCVwqwuL2Rpc3QvNDkuanMGwsCVwqwuL2Rpc3QvNjMuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAlcKpLi9sYXN0LmpzD8LAgadkZWZhdWx0laFsqXVuaW9uV2l0aBvAwNwAHZehbwAAA8CREsCZoWQJAALAkQLAwpmhaatiYXNlRmxhdHRlbpICGMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZVJlc3SSBRXAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGJhc2VVbmlxkggXwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhabFpc0FycmF5TGlrZU9iamVjdJILGcADp2RlZmF1bHTAwMCYoXILEcDAkQrAwpyhaQEhCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmkbGFzdJIOFsAEp2RlZmF1bHTAwMCYoXILBMDAkQ3AwpyhaQEUDRCQwMIEwsDAl6FvAQARGpDAmKFnAAESwJDAwpmhZAQAE8CTExEUwMKZoWypdW5pb25XaXRokhMcwMDAEZDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmlvbldpdGguanOYoXIACcAUkRLAwpihZwMjFcCVFRYXGBnAwpihcgAIwBaRBMDCmKFyKATAF5ENwMKYoXJcCMAYkQfAwpihcgELwBmRAcDCmKFyDBHAwJEKwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIACcDAkRLAwg==
====catalogjs annotation end====*/