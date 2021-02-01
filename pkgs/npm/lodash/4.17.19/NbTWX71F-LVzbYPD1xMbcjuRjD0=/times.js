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
k5OVwq0uL2Rpc3QvMTM0LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0lKFspXRpbWVzH8DcACGXoW8AAAPAkMCZoWQJAALAkQLAwpihaaliYXNlVGltZXOSAh3AAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsY2FzdEZ1bmN0aW9ukgUbwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIFsACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHCpDAwgLCwMCXoW8BAAsekMCYoWcAAQwOkMDCmaFkBBMNwJINC8DCmKFssE1BWF9TQUZFX0lOVEVHRVKSDRfAwMAL2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGltZXMuanOYoXIAEMDAkQzAwpihZwEBDxGQwMKZoWQEDRDAkhAOwMKYoWywTUFYX0FSUkFZX0xFTkdUSJQQGBocwMDADtlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RpbWVzLmpzmKFyABDAwJEPwMKYoWcBARIUkMDCmaFkBAsTwJITEcDCmKFsqW5hdGl2ZU1pbpITGcDAwBHZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90aW1lcy5qc5ihcgAJwMCREsDCmaFkAVkVwJwWFxgZGhscHRUMDxLAwpihbKV0aW1lc5IVIMDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90aW1lcy5qc5ihcgkFwBaRFMDCmKFyFgnAF5EHwMKYoXIZEMAYkQzAwpihciYQwBmRD8DCmKFyEQnAGpESwMKYoXIEEMAbkQ/AwpihchAMwByRBMDCmKFyExDAHZEPwMKYoXIRCcDAkQHAwpihZwEDH8CQwMKYoWcJCyDAkSDAwpihcgAFwMCRFMDC
====catalogjs annotation end====*/