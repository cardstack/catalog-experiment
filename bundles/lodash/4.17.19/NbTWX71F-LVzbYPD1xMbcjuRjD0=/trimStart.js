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
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMi5qcwnCwJXCrS4vZGlzdC8xNDMuanMMwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0lKFsqXRyaW1TdGFydB7A3AAgl6FvAAADwJEUwJmhZAkAAsCRAsDCmKFprGJhc2VUb1N0cmluZ5ICGMAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaljYXN0U2xpY2WSBRzAAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmvY2hhcnNTdGFydEluZGV4kggawAKnZGVmYXVsdMDAmKFyCw/AwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprXN0cmluZ1RvQXJyYXmTCxkbwAOnZGVmYXVsdMDAmKFyCw3AwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmKFpqHRvU3RyaW5nkg4WwASnZGVmYXVsdMDAmKFyCwjAwJENwMKcoWkBGA0QkMDCBMLAwJehbwEAER2QwJihZwABEhSQwMKZoWQECRPAkhMRwMKYoWyrcmVUcmltU3RhcnSSExfAwMAR2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdHJpbVN0YXJ0LmpzmKFyAAvAwJESwMKZoWQBHxXAmRYXGBkaGxwVEsDCmKFsqXRyaW1TdGFydJIVH8DAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltU3RhcnQuanOYoXIJCcAWkRTAwpihciQIwBeRDcDCmKFyVwvAGJESwMKYoXInDMAZkQHAwpihcjcNwBqRCsDCmKFyGA/AG5EHwMKYoXINDcAckQrAwpihchMJwMCRBMDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAnAwJEUwMI=
====catalogjs annotation end====*/