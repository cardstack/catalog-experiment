import { default as baseRest } from "./dist/49.js";
import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseUnary } from "./dist/135.js";
import { default as isArray } from "./isArray.js";
var castRest = baseRest;
var nativeMin = Math.min;
var overArgs = castRest(function (func, transforms) {
  transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));
  var funcsLength = transforms.length;
  return baseRest(function (args) {
    var index = -1,
        length = nativeMin(args.length, funcsLength);

    while (++index < length) {
      args[index] = transforms[index].call(this, args[index]);
    }

    return apply(func, this, args);
  });
});
export { overArgs as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvNDkuanMDwsCVwq0uL2Rpc3QvMTExLmpzBsLAlcKsLi9kaXN0Lzk4LmpzCcLAlcKsLi9kaXN0Lzg1LmpzDMLAlcKrLi9kaXN0LzYuanMPwsCVwq0uL2Rpc3QvMTM1LmpzEsLAlcKsLi9pc0FycmF5LmpzFcLAgadkZWZhdWx0lKFsqG92ZXJBcmdzMMDcADKXoW8AAAPAkSDAmaFkCQACwJECwMKYoWmoYmFzZVJlc3STAhoswACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFppWFwcGx5kgUuwAGnZGVmYXVsdMDAmKFyCwXAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqGFycmF5TWFwkwglKMACp2RlZmF1bHTAwJihcgsIwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaatiYXNlRmxhdHRlbpILKcADp2RlZmF1bHTAwJihcgsLwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpihaaxiYXNlSXRlcmF0ZWWTDicrwASnZGVmYXVsdMDAmKFyCwzAwJENwMKcoWkBFg0SkMDCBMLAwJmhZAkAEcCREcDCmKFpqWJhc2VVbmFyeZMRJirABadkZWZhdWx0wMCYoXILCcDAkRDAwpyhaQEYEBWQwMIFwsDAmaFkCQAUwJEUwMKYoWmnaXNBcnJheZIUJMAGp2RlZmF1bHTAwJihcgsHwMCRE8DCnKFpARcTFpDAwgbCwMCXoW8BABcbkMCYoWcAARjAkMDCmaFkBAAZwJMaGRfAwpihbKhjYXN0UmVzdJIZI8DAwBfZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2FzdFJlc3QuanOYoXIACMAakRjAwpihcgMIwMCRAcDCl6FvAQAcL5DAmKFnAAEdH5DAwpmhZAQLHsCSHhzAwpihbKluYXRpdmVNaW6SHi3AwMAc2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb3ZlckFyZ3MuanOYoXIACcDAkR3AwpihZwEBIMCQwMKZoWQEACHAlCEfIh3AwpihbKhvdmVyQXJnc5IhMcDAwB/ZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9vdmVyQXJncy5qc5ihcgAIwCKRIMDCmKFnAxwjwJwjJCUmJygpKissLS7AwpihcgAIwCSRGMDCmKFySAfAJZETwMKYoXISCMAmkQfAwpihchAJwCeREMDCmKFyAQzAKJENwMKYoXIFCMApkQfAwpihcgELwCqRCsDCmKFyEQnAK5EQwMKYoXIBDMAskQ3AwpihcjQIwC2RAcDCmKFyOAnALpEdwMKYoXLMjQXAwJEEwMKYoWcBAzDAkMDCmKFnCQsxwJExwMKYoXIACMDAkSDAwg==
====catalogjs annotation end====*/