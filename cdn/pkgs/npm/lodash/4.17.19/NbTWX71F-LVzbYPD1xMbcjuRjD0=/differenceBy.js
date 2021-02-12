import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var differenceBy = baseRest(function (array, values) {
  var iteratee = last(values);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2)) : [];
});
export { differenceBy as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMPwsCVwqkuL2xhc3QuanMSwsCBp2RlZmF1bHSVoWysZGlmZmVyZW5jZUJ5IcDA3AAjl6FvAAADwJEVwJmhZAkAAsCRAsDCmaFprmJhc2VEaWZmZXJlbmNlkgIcwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaatiYXNlRmxhdHRlbpIFHcABp2RlZmF1bHTAwMCYoXILC8DAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsYmFzZUl0ZXJhdGVlkggfwAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaahiYXNlUmVzdJILGMADp2RlZmF1bHTAwMCYoXILCMDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmxaXNBcnJheUxpa2VPYmplY3SUDhobHsAEp2RlZmF1bHTAwMCYoXILEcDAkQ3AwpyhaQEhDRKQwMIEwsDAmaFkCQARwJERwMKZoWmkbGFzdJIRGcAFp2RlZmF1bHTAwMCYoXILBMDAkRDAwpyhaQEUEBOQwMIFwsDAl6FvAQAUIJDAmKFnAAEVwJDAwpmhZAQAFsCTFhQXwMKZoWysZGlmZmVyZW5jZUJ5khYiwMDAFJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kaWZmZXJlbmNlQnkuanOYoXIADMAXkRXAwpihZwMXGMCYGBkaGxwdHh/AwpihcgAIwBmRCsDCmKFyLQTAGpEQwMKYoXIREcAbkQ3AwpihcjYRwByRDcDCmKFyCg7AHZEBwMKYoXIIC8AekQTAwpihcgwRwB+RDcDCmKFyCQzAwJEHwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIADMDAkRXAwg==
====catalogjs annotation end====*/