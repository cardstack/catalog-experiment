import { default as Symbol0 } from "./87.js";
import { default as arrayMap } from "./98.js";
import { default as isArray } from "../isArray.js";
import { default as isSymbol } from "../isSymbol.js";
var INFINITY = 1 / 0;
var symbolProto = Symbol0 ? Symbol0.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }

  if (isArray(value)) {
    return arrayMap(value, baseToString) + '';
  }

  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
export { baseToString as default };
/*====catalogjs annotation start====
k5SVwqcuLzg3LmpzA8LAlcKnLi85OC5qcwbCwJXCrS4uL2lzQXJyYXkuanMJwsCVwq4uLi9pc1N5bWJvbC5qcwzCwIGnZGVmYXVsdJWhbKxiYXNlVG9TdHJpbmckwMDcACaXoW8AAAPAkMCZoWQJAALAkQLAwpmhaadTeW1ib2wwkwIUFcAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYXJyYXlNYXCSBR3AAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBEgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpp2lzQXJyYXmSCBzAAqdkZWZhdWx0wMDAmKFyCwfAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGlzU3ltYm9skgsfwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARkKDZDAwgPCwMCXoW8BAA4jkMCYoWcAAQ8RkMDCmaFkBAgQwJIQDsDCmaFsqElORklOSVRZkhAiwMDADpDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVRvU3RyaW5nLmpzmKFyAAjAwJEPwMKYoWcBARIakMDCmaFkBBYTFpQUFRMRwMKZoWyrc3ltYm9sUHJvdG+TExgZwMDAEZDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVRvU3RyaW5nLmpzmKFyAAvAFJESwMKYoXIDB8AVkQHAwpihcgMHwMCRAcDCmaFkBhUXwJUYGRcREsDCmaFsrnN5bWJvbFRvU3RyaW5nkxcgIcDAwBGQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VUb1N0cmluZy5qc5ihcgAOwBiRFsDCmKFyAwvAGZESwMKYoXIDC8DAkRLAwpmhZAETG8CaHB0fICEiGx4WD8DCmaFsrGJhc2VUb1N0cmluZ5MbHiXAwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVG9TdHJpbmcuanOYoXIJDMAckRrAwpihckkHwB2RB8DCmKFyFgjAHpEEwMKYoXIIDMAfkRrAwpihchMIwCCRCsDCmKFyFg7AIZEWwMKYoXIDDsAikRbAwpihclsIwMCRD8DCmKFnAQMkwJDAwpihZwkLJcCRJcDCmKFyAAzAwJEawMI=
====catalogjs annotation end====*/