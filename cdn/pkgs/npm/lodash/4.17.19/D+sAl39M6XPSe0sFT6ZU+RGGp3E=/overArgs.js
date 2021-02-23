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
k5eVwqwuL2Rpc3QvNDkuanMDwsCVwq0uL2Rpc3QvMTExLmpzB8LAlcKsLi9kaXN0Lzk4LmpzC8LAlcKsLi9kaXN0Lzg1LmpzD8LAlcKrLi9kaXN0LzYuanMTwsCVwq0uL2Rpc3QvMTM1LmpzF8LAlcKsLi9pc0FycmF5LmpzG8LAgadkZWZhdWx0laFsqG92ZXJBcmdzN8DA3AA5l6FvAAADwJEnwJmhZAkAAgSRAsDCmaFpqGJhc2VSZXN0kwIhM8AAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaVhcHBseZIGNcABp2RlZmF1bHTAwMCYoXILBcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaahhcnJheU1hcJMKLC/AAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmrYmFzZUZsYXR0ZW6SDjDAA6dkZWZhdWx0wMDAmKFyCwvAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIDsDAkMDCmaFkCQASFJESwMKZoWmsYmFzZUl0ZXJhdGVlkxIuMsAEp2RlZmF1bHTAwMCYoXILDMDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgNwMCQwMKZoWQJABYYkRbAwpmhaaliYXNlVW5hcnmTFi0xwAWnZGVmYXVsdMDAwJihcgsJwMCRFcDCnKFpAQEVG5EYwMIFwsDAmKFnCA/AwJDAwpmhZAkAGhyRGsDCmaFpp2lzQXJyYXmSGivABqdkZWZhdWx0wMDAmKFyCwfAwJEZwMKcoWkBARkdkRzAwgbCwMCYoWcIDsDAkMDCl6FvAQAeIpDAmKFnAAEfwJDAwpmhZAQAIMCTISAewMKZoWyoY2FzdFJlc3SSICrAwMAekNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jYXN0UmVzdC5qc5ihcgAIwCGRH8DCmKFyAwjAwJEBwMKXoW8BACM2kMCYoWcAASQmkMDCmaFkBAslwJIlI8DCmaFsqW5hdGl2ZU1pbpIlNMDAwCOQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb3ZlckFyZ3MuanOYoXIACcDAkSTAwpihZwEBJ8CQwMKZoWQEACjAlCgmKSTAwpmhbKhvdmVyQXJnc5IoOMDAwCaQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb3ZlckFyZ3MuanOYoXIACMApkSfAwpihZwMcKsCcKissLS4vMDEyMzQ1wMKYoXIACMArkR/AwpihckgHwCyRGcDCmKFyEgjALZEJwMKYoXIQCcAukRXAwpihcgEMwC+REcDCmKFyBQjAMJEJwMKYoXIBC8AxkQ3AwpihchEJwDKRFcDCmKFyAQzAM5ERwMKYoXI0CMA0kQHAwpihcjgJwDWRJMDCmKFyzI0FwMCRBcDCmKFnAQM3wJDAwpihZwkLOMCROMDCmKFyAAjAwJEnwMI=
====catalogjs annotation end====*/