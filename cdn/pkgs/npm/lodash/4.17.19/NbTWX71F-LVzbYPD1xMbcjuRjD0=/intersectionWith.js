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
k5WVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvODIuanMMwsCVwqkuL2xhc3QuanMPwsCBp2RlZmF1bHSVoWywaW50ZXJzZWN0aW9uV2l0aBvAwNwAHZehbwAAA8CREsCZoWQJAALAkQLAwpmhaahhcnJheU1hcJICF8AAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmwYmFzZUludGVyc2VjdGlvbpIFGcABp2RlZmF1bHTAwMCYoXILEMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmoYmFzZVJlc3SSCBXAAqdkZWZhdWx0wMDAmKFyCwjAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFps2Nhc3RBcnJheUxpa2VPYmplY3SSCxjAA6dkZWZhdWx0wMDAmKFyCxPAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmaFppGxhc3SSDhbABKdkZWZhdWx0wMDAmKFyCwTAwJENwMKcoWkBFA0QkMDCBMLAwJehbwEAERqQwJihZwABEsCQwMKZoWQEABPAkxMRFMDCmaFssGludGVyc2VjdGlvbldpdGiSExzAwMARkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludGVyc2VjdGlvbldpdGguanOYoXIAEMAUkRLAwpihZwMoFcCVFRYXGBnAwpihcgAIwBaRB8DCmKFyKATAF5ENwMKYoXIZCMAYkQHAwpihcgkTwBmRCsDCmKFyzKwQwMCRBMDCmKFnAQMbwJDAwpihZwkLHMCRHMDCmKFyABDAwJESwMI=
====catalogjs annotation end====*/