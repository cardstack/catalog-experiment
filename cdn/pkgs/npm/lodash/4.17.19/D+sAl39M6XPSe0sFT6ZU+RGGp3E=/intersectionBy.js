import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";
import { default as last } from "./last.js";
var intersectionBy = baseRest(function (arrays) {
  var iteratee = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  if (iteratee === last(mapped)) {
    iteratee = undefined;
  } else {
    mapped.pop();
  }

  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee, 2)) : [];
});
export { intersectionBy as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMHwsCVwqsuL2Rpc3QvNi5qcwvCwJXCrC4vZGlzdC80OS5qcw/CwJXCrC4vZGlzdC84Mi5qcxPCwJXCqS4vbGFzdC5qcxfCwIGnZGVmYXVsdJWhbK5pbnRlcnNlY3Rpb25CeSbAwNwAKJehbwAAA8CRG8CZoWQJAAIEkQLAwpmhaahhcnJheU1hcJICIMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhabBiYXNlSW50ZXJzZWN0aW9ukgYjwAGnZGVmYXVsdMDAwJihcgsQwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA7AwJDAwpmhZAkACgyRCsDCmaFprGJhc2VJdGVyYXRlZZIKJMACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgNwMCQwMKZoWQJAA4QkQ7AwpmhaahiYXNlUmVzdJIOHsADp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgOwMCQwMKZoWQJABIUkRLAwpmhabNjYXN0QXJyYXlMaWtlT2JqZWN0khIhwASnZGVmYXVsdMDAwJihcgsTwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCA7AwJDAwpmhZAkAFhiRFsDCmaFppGxhc3STFh8iwAWnZGVmYXVsdMDAwJihcgsEwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCAvAwJDAwpehbwEAGiWQwJihZwABG8CQwMKZoWQEABzAkxwaHcDCmaFsrmludGVyc2VjdGlvbkJ5khwnwMDAGpDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnRlcnNlY3Rpb25CeS5qc5ihcgAOwB2RG8DCmKFnAxcewJceHyAhIiMkwMKYoXIACMAfkQ3AwpihciYEwCCRFcDCmKFyGQjAIZEBwMKYoXIJE8AikRHAwpihchcEwCORFcDCmKFyfBDAJJEFwMKYoXIJDMDAkQnAwpihZwEDJsCQwMKYoWcJCyfAkSfAwpihcgAOwMCRG8DC
====catalogjs annotation end====*/