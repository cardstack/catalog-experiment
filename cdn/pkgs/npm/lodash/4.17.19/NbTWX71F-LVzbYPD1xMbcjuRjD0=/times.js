import { default as baseTimes } from "./dist/134.js";
import { default as castFunction } from "./dist/108.js";
import { default as toInteger } from "./toInteger.js";
var MAX_SAFE_INTEGER = 9007199254740991;
var MAX_ARRAY_LENGTH = 4294967295;
var nativeMin = Math.min;
function times(n, iteratee) {
  n = toInteger(n);

  if (n < 1 || n > MAX_SAFE_INTEGER) {
    return [];
  }

  var index = MAX_ARRAY_LENGTH,
      length = nativeMin(n, MAX_ARRAY_LENGTH);
  iteratee = castFunction(iteratee);
  n -= MAX_ARRAY_LENGTH;
  var result = baseTimes(length, iteratee);

  while (++index < n) {
    iteratee(index);
  }

  return result;
}
export { times as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTM0LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwfCwJXCri4vdG9JbnRlZ2VyLmpzC8LAgadkZWZhdWx0laFspXRpbWVzIsDA3AAkl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYmFzZVRpbWVzkgIgwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprGNhc3RGdW5jdGlvbpIGHsABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaal0b0ludGVnZXKSChnAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIEMDAkMDCl6FvAQAOIZDAmKFnAAEPEZDAwpmhZAQTEMCSEA7AwpmhbLBNQVhfU0FGRV9JTlRFR0VSkhAawMDADpDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90aW1lcy5qc5ihcgAQwMCRD8DCmKFnAQESFJDAwpmhZAQNE8CSExHAwpmhbLBNQVhfQVJSQVlfTEVOR1RIlBMbHR/AwMARkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RpbWVzLmpzmKFyABDAwJESwMKYoWcBARUXkMDCmaFkBAsWwJIWFMDCmaFsqW5hdGl2ZU1pbpIWHMDAwBSQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGltZXMuanOYoXIACcDAkRXAwpmhZAFZGMCcGRobHB0eHyAYDxIVwMKZoWyldGltZXOSGCPAwMDAkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RpbWVzLmpzmKFyCQXAGZEXwMKYoXIWCcAakQnAwpihchkQwBuRD8DCmKFyJhDAHJESwMKYoXIRCcAdkRXAwpihcgQQwB6REsDCmKFyEAzAH5EFwMKYoXITEMAgkRLAwpihchEJwMCRAcDCmKFnAQMiwJDAwpihZwkLI8CRI8DCmKFyAAXAwJEXwMI=
====catalogjs annotation end====*/