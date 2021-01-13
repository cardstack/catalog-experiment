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
k5eVwqwuL2Rpc3QvNDkuanMDwsCVwq0uL2Rpc3QvMTExLmpzBsLAlcKsLi9kaXN0Lzk4LmpzCcLAlcKsLi9kaXN0Lzg1LmpzDMLAlcKrLi9kaXN0LzYuanMPwsCVwq0uL2Rpc3QvMTM1LmpzEsLAlcKsLi9pc0FycmF5LmpzFcLAgadkZWZhdWx0lKFsqG92ZXJBcmdzMMDcADKXoW8AAAPAkhggwJmhZAkAAsCRAsDCmKFpqGJhc2VSZXN0kwIaLMAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaVhcHBseZIFLsABp2RlZmF1bHTAwJihcgsFwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaahhcnJheU1hcJMIJSjAAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmrYmFzZUZsYXR0ZW6SCynAA6dkZWZhdWx0wMCYoXILC8DAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmsYmFzZUl0ZXJhdGVlkw4nK8AEp2RlZmF1bHTAwJihcgsMwMCRDcDCnKFpARYNEpDAwgTCwMCZoWQJABHAkRHAwpihaaliYXNlVW5hcnmTESYqwAWnZGVmYXVsdMDAmKFyCwnAwJEQwMKcoWkBGBAVkMDCBcLAwJmhZAkAFMCRFMDCmKFpp2lzQXJyYXmSFCTABqdkZWZhdWx0wMCYoXILB8DAkRPAwpyhaQEXExaQwMIGwsDAl6FvAQAXG5DAmKFnAAEYwJDAwpmhZAQAGcCTGhkXwMKYoWyoY2FzdFJlc3SSGSPAwMAX2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Nhc3RSZXN0LmpzmKFyAAjAGpEYwMKYoXIDCMDAkQHAwpehbwEAHC+QwJihZwABHR+QwMKZoWQECx7Akh4cwMKYoWypbmF0aXZlTWlukh4twMDAHNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL292ZXJBcmdzLmpzmKFyAAnAwJEdwMKYoWcBASDAkMDCmaFkBAAhwJQhHyIdwMKYoWyob3ZlckFyZ3OSITHAwMAf2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb3ZlckFyZ3MuanOYoXIACMAikSDAwpihZwMcI8CdIyQlJicoKSorLC0uIMDCmKFyAAjAJJEYwMKYoXJIB8AlkRPAwpihchIIwCaRB8DCmKFyEAnAJ5EQwMKYoXIBDMAokQ3AwpihcgUIwCmRB8DCmKFyAQvAKpEKwMKYoXIRCcArkRDAwpihcgEMwCyRDcDCmKFyNAjALZEBwMKYoXI4CcAukR3AwpihcsyNBcDAkQTAwpihZwEDMMCQwMKYoWcJCzHAkTHAwpihcgAIwMCRIMDC
====catalogjs annotation end====*/