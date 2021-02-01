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
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqwuL2Rpc3QvNjIuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvODIuanMMwsCBp2RlZmF1bHSUoWysaW50ZXJzZWN0aW9uF8DcABmXoW8AAAPAkQ/AmaFkCQACwJECwMKYoWmoYXJyYXlNYXCSAhPAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmwYmFzZUludGVyc2VjdGlvbpIFFcABp2RlZmF1bHTAwJihcgsQwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaahiYXNlUmVzdJIIEsACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihabNjYXN0QXJyYXlMaWtlT2JqZWN0kgsUwAOnZGVmYXVsdMDAmKFyCxPAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhaQwJihZwABD8CQwMKZoWQEABDAkxAOEcDCmKFsrGludGVyc2VjdGlvbpIQGMDAwA7ZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnRlcnNlY3Rpb24uanOYoXIADMARkQ/AwpihZwMREsCUEhMUFcDCmKFyAAjAE5EHwMKYoXIkCMAUkQHAwpihcgkTwBWRCsDCmKFyNxDAwJEEwMKYoWcBAxfAkMDCmKFnCQsYwJEYwMKYoXIADMDAkQ/Awg==
====catalogjs annotation end====*/