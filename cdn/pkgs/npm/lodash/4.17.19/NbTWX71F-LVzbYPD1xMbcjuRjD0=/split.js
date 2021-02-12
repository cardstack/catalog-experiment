import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString0 } from "./toString.js";
var MAX_ARRAY_LENGTH = 4294967295;
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }

  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;

  if (!limit) {
    return [];
  }

  string = toString0(string);

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
k5eVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzE0NS5qcwnCwJXCrC4vZGlzdC83MC5qcwzCwJXCrS4vaXNSZWdFeHAuanMPwsCVwq0uL2Rpc3QvMTQzLmpzEsLAlcKtLi90b1N0cmluZy5qcxXCwIGnZGVmYXVsdJWhbKVzcGxpdCXAwNwAJ5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprGJhc2VUb1N0cmluZ5ICIMAAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpY2FzdFNsaWNlkgUiwAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaapoYXNVbmljb2RlkgghwAKnZGVmYXVsdMDAwJihcgsKwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaa5pc0l0ZXJhdGVlQ2FsbJILHMADp2RlZmF1bHTAwMCYoXILDsDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmoaXNSZWdFeHCSDh/ABKdkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmaFprXN0cmluZ1RvQXJyYXmSESPABadkZWZhdWx0wMDAmKFyCw3AwJEQwMKcoWkBGBAVkMDCBcLAwJmhZAkAFMCRFMDCmaFpqXRvU3RyaW5nMJIUHsAGp2RlZmF1bHTAwMCYoXILCcDAkRPAwpyhaQEYExaQwMIGwsDAl6FvAQAXJJDAmKFnAAEYGpDAwpmhZAQNGcCSGRfAwpmhbLBNQVhfQVJSQVlfTEVOR1RIkhkdwMDAF5DZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zcGxpdC5qc5ihcgAQwMCRGMDCmaFkAUobwJocHR4fICEiIxsYwMKZoWylc3BsaXSSGybAwMDAkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwbGl0LmpzmKFyCQXAHJEawMKYoXJIDsAdkQrAwpihcmYQwB6RGMDCmKFyQAnAH5ETwMKYoXJSCMAgkQ3AwpihciAMwCGRAcDCmKFyJArAIpEHwMKYoXIZCcAjkQTAwpihcgENwMCREMDCmKFnAQMlwJDAwpihZwkLJsCRJsDCmKFyAAXAwJEawMI=
====catalogjs annotation end====*/