import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";
import { default as last } from "./last.js";
var intersectionWith = baseRest(function (arrays) {
  var comparator = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);
  comparator = typeof comparator == 'function' ? comparator : undefined;

  if (comparator) {
    mapped.pop();
  }

  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
});
export { intersectionWith as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvODIuanMMwsCVwqkuL2xhc3QuanMPwsCBp2RlZmF1bHSUoWywaW50ZXJzZWN0aW9uV2l0aBvA3AAdl6FvAAADwJESwJmhZAkAAsCRAsDCmKFpqGFycmF5TWFwkgIXwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpsGJhc2VJbnRlcnNlY3Rpb26SBRnAAadkZWZhdWx0wMCYoXILEMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoYmFzZVJlc3SSCBXAAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmzY2FzdEFycmF5TGlrZU9iamVjdJILGMADp2RlZmF1bHTAwJihcgsTwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpihaaRsYXN0kg4WwASnZGVmYXVsdMDAmKFyCwTAwJENwMKcoWkBFA0QkMDCBMLAwJehbwEAERqQwJihZwABEsCQwMKZoWQEABPAkxMRFMDCmKFssGludGVyc2VjdGlvbldpdGiSExzAwMAR2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW50ZXJzZWN0aW9uV2l0aC5qc5ihcgAQwBSREsDCmKFnAygVwJUVFhcYGcDCmKFyAAjAFpEHwMKYoXIoBMAXkQ3AwpihchkIwBiRAcDCmKFyCRPAGZEKwMKYoXLMrBDAwJEEwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIAEMDAkRLAwg==
====catalogjs annotation end====*/