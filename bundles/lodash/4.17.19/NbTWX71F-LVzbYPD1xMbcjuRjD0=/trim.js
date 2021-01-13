import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var reTrim = /^\s+|\s+$/g;
function trim(string, chars, guard) {
  string = toString(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;
  return castSlice(strSymbols, start, end).join('');
}
export { trim as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMS5qcwnCwJXCrS4vZGlzdC8xMjIuanMMwsCVwq0uL2Rpc3QvMTQzLmpzD8LAlcKtLi90b1N0cmluZy5qcxLCwIGnZGVmYXVsdJShbKR0cmltIsDcACSXoW8AAAPAkRfAmaFkCQACwJECwMKYoWmsYmFzZVRvU3RyaW5nkgIbwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWNhc3RTbGljZZIFIMABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaa1jaGFyc0VuZEluZGV4kggfwAKnZGVmYXVsdMDAmKFyCw3AwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpr2NoYXJzU3RhcnRJbmRleJILHsADp2RlZmF1bHTAwJihcgsPwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaa1zdHJpbmdUb0FycmF5kw4cHcAEp2RlZmF1bHTAwJihcgsNwMCRDcDCnKFpARgNEpDAwgTCwMCZoWQJABHAkRHAwpihaah0b1N0cmluZ5IRGcAFp2RlZmF1bHTAwJihcgsIwMCREMDCnKFpARgQE5DAwgXCwMCXoW8BABQhkMCYoWcAARUXkMDCmaFkBA8WwJIWFMDCmKFspnJlVHJpbZIWGsDAwBTZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltLmpzmKFyAAbAwJEVwMKZoWQBJBjAmhkaGxwdHh8gGBXAwpihbKR0cmltkhgjwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW0uanOYoXIJBMAZkRfAwpihciQIwBqREMDCmKFyVwbAG5EVwMKYoXInDMAckQHAwpihcjcNwB2RDcDCmKFyHQ3AHpENwMKYoXIXD8AfkQrAwpihciYNwCCRB8DCmKFyJwnAwJEEwMKYoWcBAyLAkMDCmKFnCQsjwJEjwMKYoXIABMDAkRfAwg==
====catalogjs annotation end====*/