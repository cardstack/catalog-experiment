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
k5aVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCrC4vZGlzdC84Mi5qcw/CwJXCqS4vbGFzdC5qcxLCwIGnZGVmYXVsdJShbK5pbnRlcnNlY3Rpb25CeSDA3AAil6FvAAADwJEVwJmhZAkAAsCRAsDCmKFpqGFycmF5TWFwkgIawACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpsGJhc2VJbnRlcnNlY3Rpb26SBR3AAadkZWZhdWx0wMCYoXILEMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggewAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqGJhc2VSZXN0kgsYwAOnZGVmYXVsdMDAmKFyCwjAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFps2Nhc3RBcnJheUxpa2VPYmplY3SSDhvABKdkZWZhdWx0wMCYoXILE8DAkQ3AwpyhaQEXDRKQwMIEwsDAmaFkCQARwJERwMKYoWmkbGFzdJMRGRzABadkZWZhdWx0wMCYoXILBMDAkRDAwpyhaQEUEBOQwMIFwsDAl6FvAQAUH5DAmKFnAAEVwJDAwpmhZAQAFsCTFhQXwMKYoWyuaW50ZXJzZWN0aW9uQnmSFiHAwMAU2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW50ZXJzZWN0aW9uQnkuanOYoXIADsAXkRXAwpihZwMXGMCYGBkaGxwdHhXAwpihcgAIwBmRCsDCmKFyJgTAGpEQwMKYoXIZCMAbkQHAwpihcgkTwByRDcDCmKFyFwTAHZEQwMKYoXJ8EMAekQTAwpihcgkMwMCRB8DCmKFnAQMgwJDAwpihZwkLIcCRIcDCmKFyAA7AwJEVwMI=
====catalogjs annotation end====*/