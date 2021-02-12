import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var union = baseRest(function (arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
export { union as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODUuanMDwsCVwqwuL2Rpc3QvNDkuanMGwsCVwqwuL2Rpc3QvNjMuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAgadkZWZhdWx0laFspXVuaW9uF8DA3AAZl6FvAAADwJEPwJmhZAkAAsCRAsDCmaFpq2Jhc2VGbGF0dGVukgIUwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahiYXNlUmVzdJIFEsABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmoYmFzZVVuaXGSCBPAAqdkZWZhdWx0wMDAmKFyCwjAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpsWlzQXJyYXlMaWtlT2JqZWN0kgsVwAOnZGVmYXVsdMDAwJihcgsRwMCRCsDCnKFpASEKDZDAwgPCwMCXoW8BAA4WkMCYoWcAAQ/AkMDCmaFkBAAQwJMQDhHAwpmhbKV1bmlvbpIQGMDAwA6Q2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pb24uanOYoXIABcARkQ/AwpihZwMMEsCUEhMUFcDCmKFyAAjAE5EEwMKYoXIeCMAUkQfAwpihcgELwBWRAcDCmKFyDBHAwJEKwMKYoWcBAxfAkMDCmKFnCQsYwJEYwMKYoXIABcDAkQ/Awg==
====catalogjs annotation end====*/