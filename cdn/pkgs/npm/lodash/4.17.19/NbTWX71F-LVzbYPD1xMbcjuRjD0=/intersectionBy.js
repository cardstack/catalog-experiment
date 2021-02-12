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
k5aVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMGwsCVwqsuL2Rpc3QvNi5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCrC4vZGlzdC84Mi5qcw/CwJXCqS4vbGFzdC5qcxLCwIGnZGVmYXVsdJWhbK5pbnRlcnNlY3Rpb25CeSDAwNwAIpehbwAAA8CRFcCZoWQJAALAkQLAwpmhaahhcnJheU1hcJICGsAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmwYmFzZUludGVyc2VjdGlvbpIFHcABp2RlZmF1bHTAwMCYoXILEMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsYmFzZUl0ZXJhdGVlkggewAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaahiYXNlUmVzdJILGMADp2RlZmF1bHTAwMCYoXILCMDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmzY2FzdEFycmF5TGlrZU9iamVjdJIOG8AEp2RlZmF1bHTAwMCYoXILE8DAkQ3AwpyhaQEXDRKQwMIEwsDAmaFkCQARwJERwMKZoWmkbGFzdJMRGRzABadkZWZhdWx0wMDAmKFyCwTAwJEQwMKcoWkBFBATkMDCBcLAwJehbwEAFB+QwJihZwABFcCQwMKZoWQEABbAkxYUF8DCmaFsrmludGVyc2VjdGlvbkJ5khYhwMDAFJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnRlcnNlY3Rpb25CeS5qc5ihcgAOwBeRFcDCmKFnAxcYwJcYGRobHB0ewMKYoXIACMAZkQrAwpihciYEwBqREMDCmKFyGQjAG5EBwMKYoXIJE8AckQ3AwpihchcEwB2REMDCmKFyfBDAHpEEwMKYoXIJDMDAkQfAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAOwMCRFcDC
====catalogjs annotation end====*/