import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";
var intersection = baseRest(function (arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
});
export { intersection as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMHwsCVwqwuL2Rpc3QvNDkuanMLwsCVwqwuL2Rpc3QvODIuanMPwsCBp2RlZmF1bHSVoWysaW50ZXJzZWN0aW9uG8DA3AAdl6FvAAADwJETwJmhZAkAAgSRAsDCmaFpqGFycmF5TWFwkgIXwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpsGJhc2VJbnRlcnNlY3Rpb26SBhnAAadkZWZhdWx0wMDAmKFyCxDAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmoYmFzZVJlc3SSChbAAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmzY2FzdEFycmF5TGlrZU9iamVjdJIOGMADp2RlZmF1bHTAwMCYoXILE8DAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgOwMCQwMKXoW8BABIakMCYoWcAARPAkMDCmaFkBAAUwJMUEhXAwpmhbKxpbnRlcnNlY3Rpb26SFBzAwMASkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludGVyc2VjdGlvbi5qc5ihcgAMwBWRE8DCmKFnAxEWwJQWFxgZwMKYoXIACMAXkQnAwpihciQIwBiRAcDCmKFyCRPAGZENwMKYoXI3EMDAkQXAwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAMwMCRE8DC
====catalogjs annotation end====*/