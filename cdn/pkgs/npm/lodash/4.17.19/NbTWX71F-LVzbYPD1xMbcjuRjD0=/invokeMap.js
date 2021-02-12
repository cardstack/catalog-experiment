import { default as apply } from "./dist/111.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLike } from "./isArrayLike.js";
var invokeMap = baseRest(function (collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function (value) {
    result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
  });
  return result;
});
export { invokeMap as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKrLi9kaXN0LzguanMJwsCVwqwuL2Rpc3QvNDkuanMMwsCVwrAuL2lzQXJyYXlMaWtlLmpzD8LAgadkZWZhdWx0laFsqWludm9rZU1hcBvAwNwAHZehbwAAA8CREsCZoWQJAALAkQLAwpmhaaVhcHBseZICGMAAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZUVhY2iSBRfAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqmJhc2VJbnZva2WSCBnAAqdkZWZhdWx0wMDAmKFyCwrAwJEHwMKcoWkBFgcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGJhc2VSZXN0kgsVwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaatpc0FycmF5TGlrZZIOFsAEp2RlZmF1bHTAwMCYoXILC8DAkQ3AwpyhaQEbDRCQwMIEwsDAl6FvAQARGpDAmKFnAAESwJDAwpmhZAQAE8CTExEUwMKZoWypaW52b2tlTWFwkhMcwMDAEZDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnZva2VNYXAuanOYoXIACcAUkRLAwpihZwMuFcCVFRYXGBnAwpihcgAIwBaRCsDCmKFycAvAF5ENwMKYoXIwCMAYkQTAwpihcj8FwBmRAcDCmKFyFgrAwJEHwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIACcDAkRLAwg==
====catalogjs annotation end====*/