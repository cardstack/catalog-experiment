import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString0 } from "./toString.js";
var reTrimStart = /^\s+/;
function trimStart(string, chars, guard) {
  string = toString0(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimStart, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      start = charsStartIndex(strSymbols, stringToArray(chars));
  return castSlice(strSymbols, start).join('');
}
export { trimStart as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMi5qcwnCwJXCrS4vZGlzdC8xNDMuanMMwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0laFsqXRyaW1TdGFydB7AwNwAIJehbwAAA8CQwJmhZAkAAsCRAsDCmaFprGJhc2VUb1N0cmluZ5ICGMAAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmpY2FzdFNsaWNlkgUcwAGnZGVmYXVsdMDAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaa9jaGFyc1N0YXJ0SW5kZXiSCBrAAqdkZWZhdWx0wMDAmKFyCw/AwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFprXN0cmluZ1RvQXJyYXmTCxkbwAOnZGVmYXVsdMDAwJihcgsNwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaal0b1N0cmluZzCSDhbABKdkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBGA0QkMDCBMLAwJehbwEAER2QwJihZwABEhSQwMKZoWQECRPAkhMRwMKZoWyrcmVUcmltU3RhcnSSExfAwMARkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW1TdGFydC5qc5ihcgALwMCREsDCmaFkAR8VwJkWFxgZGhscFRLAwpmhbKl0cmltU3RhcnSSFR/AwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW1TdGFydC5qc5ihcgkJwBaRFMDCmKFyJAnAF5ENwMKYoXJXC8AYkRLAwpihcicMwBmRAcDCmKFyNw3AGpEKwMKYoXIYD8AbkQfAwpihcg0NwByRCsDCmKFyEwnAwJEEwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIACcDAkRTAwg==
====catalogjs annotation end====*/