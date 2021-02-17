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
k5aVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMHwsCVwqsuL2Rpc3QvNi5qcwvCwJXCrC4vZGlzdC80OS5qcw/CwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMTwsCVwqkuL2xhc3QuanMXwsCBp2RlZmF1bHSVoWysZGlmZmVyZW5jZUJ5J8DA3AApl6FvAAADwJEbwJmhZAkAAgSRAsDCmaFprmJhc2VEaWZmZXJlbmNlkgIiwACnZGVmYXVsdMDAwJihcgsOwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpq2Jhc2VGbGF0dGVukgYjwAGnZGVmYXVsdMDAwJihcgsLwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFprGJhc2VJdGVyYXRlZZIKJcACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgNwMCQwMKZoWQJAA4QkQ7AwpmhaahiYXNlUmVzdJIOHsADp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgOwMCQwMKZoWQJABIUkRLAwpmhabFpc0FycmF5TGlrZU9iamVjdJQSICEkwASnZGVmYXVsdMDAwJihcgsRwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCBjAwJDAwpmhZAkAFhiRFsDCmaFppGxhc3SSFh/ABadkZWZhdWx0wMDAmKFyCwTAwJEVwMKcoWkBARUZkRjAwgXCwMCYoWcIC8DAkMDCl6FvAQAaJpDAmKFnAAEbwJDAwpmhZAQAHMCTHBodwMKZoWysZGlmZmVyZW5jZUJ5khwowMDAGpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kaWZmZXJlbmNlQnkuanOYoXIADMAdkRvAwpihZwMXHsCYHh8gISIjJCXAwpihcgAIwB+RDcDCmKFyLQTAIJEVwMKYoXIREcAhkRHAwpihcjYRwCKREcDCmKFyCg7AI5EBwMKYoXIIC8AkkQXAwpihcgwRwCWREcDCmKFyCQzAwJEJwMKYoWcBAyfAkMDCmKFnCQsowJEowMKYoXIADMDAkRvAwg==
====catalogjs annotation end====*/