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
k5eVwqwuL2Rpc3QvNDkuanMDwsCVwq0uL2Rpc3QvMTExLmpzBsLAlcKsLi9kaXN0Lzk4LmpzCcLAlcKsLi9kaXN0Lzg1LmpzDMLAlcKrLi9kaXN0LzYuanMPwsCVwq0uL2Rpc3QvMTM1LmpzEsLAlcKsLi9pc0FycmF5LmpzFcLAgadkZWZhdWx0laFsqG92ZXJBcmdzMMDA3AAyl6FvAAADwJEgwJmhZAkAAsCRAsDCmaFpqGJhc2VSZXN0kwIaLMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmlYXBwbHmSBS7AAadkZWZhdWx0wMDAmKFyCwXAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGFycmF5TWFwkwglKMACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmrYmFzZUZsYXR0ZW6SCynAA6dkZWZhdWx0wMDAmKFyCwvAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmaFprGJhc2VJdGVyYXRlZZMOJyvABKdkZWZhdWx0wMDAmKFyCwzAwJENwMKcoWkBFg0SkMDCBMLAwJmhZAkAEcCREcDCmaFpqWJhc2VVbmFyeZMRJirABadkZWZhdWx0wMDAmKFyCwnAwJEQwMKcoWkBGBAVkMDCBcLAwJmhZAkAFMCRFMDCmaFpp2lzQXJyYXmSFCTABqdkZWZhdWx0wMDAmKFyCwfAwJETwMKcoWkBFxMWkMDCBsLAwJehbwEAFxuQwJihZwABGMCQwMKZoWQEABnAkxoZF8DCmaFsqGNhc3RSZXN0khkjwMDAF5DZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2FzdFJlc3QuanOYoXIACMAakRjAwpihcgMIwMCRAcDCl6FvAQAcL5DAmKFnAAEdH5DAwpmhZAQLHsCSHhzAwpmhbKluYXRpdmVNaW6SHi3AwMAckNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL292ZXJBcmdzLmpzmKFyAAnAwJEdwMKYoWcBASDAkMDCmaFkBAAhwJQhHyIdwMKZoWyob3ZlckFyZ3OSITHAwMAfkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL292ZXJBcmdzLmpzmKFyAAjAIpEgwMKYoWcDHCPAnCMkJSYnKCkqKywtLsDCmKFyAAjAJJEYwMKYoXJIB8AlkRPAwpihchIIwCaRB8DCmKFyEAnAJ5EQwMKYoXIBDMAokQ3AwpihcgUIwCmRB8DCmKFyAQvAKpEKwMKYoXIRCcArkRDAwpihcgEMwCyRDcDCmKFyNAjALZEBwMKYoXI4CcAukR3AwpihcsyNBcDAkQTAwpihZwEDMMCQwMKYoWcJCzHAkTHAwpihcgAIwMCRIMDC
====catalogjs annotation end====*/