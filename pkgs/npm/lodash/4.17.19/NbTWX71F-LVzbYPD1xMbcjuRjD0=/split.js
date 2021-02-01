import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var MAX_ARRAY_LENGTH = 4294967295;
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }

  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;

  if (!limit) {
    return [];
  }

  string = toString(string);

  if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
    separator = baseToString(separator);

    if (!separator && hasUnicode(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }

  return string.split(separator, limit);
}
export { split as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzE0NS5qcwnCwJXCrC4vZGlzdC83MC5qcwzCwJXCrS4vaXNSZWdFeHAuanMPwsCVwq0uL2Rpc3QvMTQzLmpzEsLAlcKtLi90b1N0cmluZy5qcxXCwIGnZGVmYXVsdJShbKVzcGxpdCXA3AAnl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZVRvU3RyaW5nkgIgwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWNhc3RTbGljZZIFIsABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaapoYXNVbmljb2RlkgghwAKnZGVmYXVsdMDAmKFyCwrAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprmlzSXRlcmF0ZWVDYWxskgscwAOnZGVmYXVsdMDAmKFyCw7AwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFpqGlzUmVnRXhwkg4fwASnZGVmYXVsdMDAmKFyCwjAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmKFprXN0cmluZ1RvQXJyYXmSESPABadkZWZhdWx0wMCYoXILDcDAkRDAwpyhaQEYEBWQwMIFwsDAmaFkCQAUwJEUwMKYoWmodG9TdHJpbmeSFB7ABqdkZWZhdWx0wMCYoXILCMDAkRPAwpyhaQEYExaQwMIGwsDAl6FvAQAXJJDAmKFnAAEYGpDAwpmhZAQNGcCSGRfAwpihbLBNQVhfQVJSQVlfTEVOR1RIkhkdwMDAF9lFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwbGl0LmpzmKFyABDAwJEYwMKZoWQBShvAmhwdHh8gISIjGxjAwpihbKVzcGxpdJIbJsDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zcGxpdC5qc5ihcgkFwByRGsDCmKFySA7AHZEKwMKYoXJmEMAekRjAwpihckAIwB+RE8DCmKFyUgjAIJENwMKYoXIgDMAhkQHAwpihciQKwCKRB8DCmKFyGQnAI5EEwMKYoXIBDcDAkRDAwpihZwEDJcCQwMKYoWcJCybAkSbAwpihcgAFwMCRGsDC
====catalogjs annotation end====*/