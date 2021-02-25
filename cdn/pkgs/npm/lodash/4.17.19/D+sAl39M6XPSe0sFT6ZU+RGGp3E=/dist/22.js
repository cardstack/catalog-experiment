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
k5SVwqcuLzg3LmpzA8LAlcKnLi85OC5qcwfCwJXCrS4uL2lzQXJyYXkuanMLwsCVwq4uLi9pc1N5bWJvbC5qcw/CwIGnZGVmYXVsdJWhbKxiYXNlVG9TdHJpbmcowMDcACqXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadTeW1ib2wwkwIYGcAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgJwMCQwMKZoWQJAAYIkQbAwpmhaahhcnJheU1hcJIGIcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgJwMCQwMKZoWQJAAoMkQrAwpmhaadpc0FycmF5kgogwAKnZGVmYXVsdMDAwJihcgsHwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpqGlzU3ltYm9skg4jwAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCBDAwJDAwpehbwEAEieQwJihZwABExWQwMKZoWQECBTAkhQSwMKZoWyoSU5GSU5JVFmSFCbAwMASkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVG9TdHJpbmcuanOYoXIACMDAkRPAwpihZwEBFh6QwMKZoWQEFhcalBgZFxXAwpmhbKtzeW1ib2xQcm90b5MXHB3AwMAVkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlVG9TdHJpbmcuanOYoXIAC8AYkRbAwpihcgMHwBmRAcDCmKFyAwfAwJEBwMKZoWQGFRvAlRwdGxUWwMKZoWyuc3ltYm9sVG9TdHJpbmeTGyQlwMDAFZDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVRvU3RyaW5nLmpzmKFyAA7AHJEawMKYoXIDC8AdkRbAwpihcgMLwMCRFsDCmaFkARMfwJogISMkJSYfIhoTwMKZoWysYmFzZVRvU3RyaW5nkx8iKcDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VUb1N0cmluZy5qc5ihcgkMwCCRHsDCmKFySQfAIZEJwMKYoXIWCMAikQXAwpihcggMwCORHsDCmKFyEwjAJJENwMKYoXIWDsAlkRrAwpihcgMOwCaRGsDCmKFyWwjAwJETwMKYoWcBAyjAkMDCmKFnCQspwJEpwMKYoXIADMDAkR7Awg==
====catalogjs annotation end====*/