import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function cond(pairs) {
  var length = pairs == null ? 0 : pairs.length,
      toIteratee = baseIteratee;
  pairs = !length ? [] : arrayMap(pairs, function (pair) {
    if (typeof pair[1] != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    return [toIteratee(pair[0]), pair[1]];
  });
  return baseRest(function (args) {
    var index = -1;

    while (++index < length) {
      var pair = pairs[index];

      if (apply(pair[0], this, args)) {
        return apply(pair[1], this, args);
      }
    }
  });
}
export { cond as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2Rpc3QvNDkuanMMwsCBp2RlZmF1bHSUoWykY29uZBrA3AAcl6FvAAADwJDAmaFkCQACwJECwMKYoWmlYXBwbHmTAhcYwACnZGVmYXVsdMDAmKFyCwXAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGFycmF5TWFwkgUUwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGJhc2VJdGVyYXRlZZIIE8ACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpihaahiYXNlUmVzdJILFsADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4ZkMCYoWcAAQ8RkMDCmaFkBBgQwJIQDsDCmKFsr0ZVTkNfRVJST1JfVEVYVJIQFcDAwA7ZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25kLmpzmKFyAA/AwJEPwMKZoWQBLBLAmBMUFRYXGBIPwMKYoWykY29uZJISG8DAwMDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25kLmpzmKFyCQTAE5ERwMKYoXJODMAUkQfAwpihchsIwBWRBMDCmKFyXA/AFpEPwMKYoXJECMAXkQrAwpihcnEFwBiRAcDCmKFyKAXAwJEBwMKYoWcBAxrAkMDCmKFnCQsbwJEbwMKYoXIABMDAkRHAwg==
====catalogjs annotation end====*/