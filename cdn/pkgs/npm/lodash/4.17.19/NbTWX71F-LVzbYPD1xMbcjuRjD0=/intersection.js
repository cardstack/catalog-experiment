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
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvODIuanMMwsCBp2RlZmF1bHSVoWysaW50ZXJzZWN0aW9uF8DA3AAZl6FvAAADwJEPwJmhZAkAAsCRAsDCmaFpqGFycmF5TWFwkgITwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhabBiYXNlSW50ZXJzZWN0aW9ukgUVwAGnZGVmYXVsdMDAwJihcgsQwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahiYXNlUmVzdJIIEsACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmzY2FzdEFycmF5TGlrZU9iamVjdJILFMADp2RlZmF1bHTAwMCYoXILE8DAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOFpDAmKFnAAEPwJDAwpmhZAQAEMCTEA4RwMKZoWysaW50ZXJzZWN0aW9ukhAYwMDADpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnRlcnNlY3Rpb24uanOYoXIADMARkQ/AwpihZwMREsCUEhMUFcDCmKFyAAjAE5EHwMKYoXIkCMAUkQHAwpihcgkTwBWRCsDCmKFyNxDAwJEEwMKYoWcBAxfAkMDCmKFnCQsYwJEYwMKYoXIADMDAkQ/Awg==
====catalogjs annotation end====*/