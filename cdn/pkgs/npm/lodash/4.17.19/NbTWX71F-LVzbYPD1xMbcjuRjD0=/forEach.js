import { default as arrayEach } from "./dist/119.js";
import { default as baseEach } from "./dist/75.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}
export { forEach as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTE5LmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKtLi9kaXN0LzEwOC5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJWhbKdmb3JFYWNoFcDA3AAXl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYXJyYXlFYWNokgIRwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahiYXNlRWFjaJIFEsABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsY2FzdEZ1bmN0aW9ukggTwAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaadpc0FycmF5kgsQwAOnZGVmYXVsdMDAwJihcgsHwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4UkMCZoWQADg/AlRAREhMPwMKZoWynZm9yRWFjaJIPFsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZm9yRWFjaC5qc5ihcgkHwBCRDsDCmKFyJgfAEZEKwMKYoXIPCcASkQHAwpihcgMIwBORBMDCmKFyHAzAwJEHwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIAB8DAkQ7Awg==
====catalogjs annotation end====*/