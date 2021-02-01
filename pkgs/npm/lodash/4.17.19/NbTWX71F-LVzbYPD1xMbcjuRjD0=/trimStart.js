import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var reTrimStart = /^\s+/;
function trimStart(string, chars, guard) {
  string = toString(string);

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
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMi5qcwnCwJXCrS4vZGlzdC8xNDMuanMMwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0lKFsqXRyaW1TdGFydB7A3AAgl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZVRvU3RyaW5nkgIYwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWNhc3RTbGljZZIFHMABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaa9jaGFyc1N0YXJ0SW5kZXiSCBrAAqdkZWZhdWx0wMCYoXILD8DAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmtc3RyaW5nVG9BcnJheZMLGRvAA6dkZWZhdWx0wMCYoXILDcDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmodG9TdHJpbmeSDhbABKdkZWZhdWx0wMCYoXILCMDAkQ3AwpyhaQEYDRCQwMIEwsDAl6FvAQARHZDAmKFnAAESFJDAwpmhZAQJE8CSExHAwpihbKtyZVRyaW1TdGFydJITF8DAwBHZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltU3RhcnQuanOYoXIAC8DAkRLAwpmhZAEfFcCZFhcYGRobHBUSwMKYoWypdHJpbVN0YXJ0khUfwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW1TdGFydC5qc5ihcgkJwBaRFMDCmKFyJAjAF5ENwMKYoXJXC8AYkRLAwpihcicMwBmRAcDCmKFyNw3AGpEKwMKYoXIYD8AbkQfAwpihcg0NwByRCsDCmKFyEwnAwJEEwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIACcDAkRTAwg==
====catalogjs annotation end====*/