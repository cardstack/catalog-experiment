import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
var nativeCeil = Math.ceil,
    nativeFloor = Math.floor;
function pad(string, length, chars) {
  string = toString0(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;

  if (!length || strLength >= length) {
    return string;
  }

  var mid = (length - strLength) / 2;
  return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
}
export { pad as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0laFso3BhZB3AwNwAH5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprWNyZWF0ZVBhZGRpbmeTAhgawACnZGVmYXVsdMDAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaapzdHJpbmdTaXplkgUXwAGnZGVmYXVsdMDAwJihcgsKwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaal0b0ludGVnZXKSCBbAAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqXRvU3RyaW5nMJILFcADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOHJDAmKFnAAEPE5DAwpmhZAQMEBGSEA7AwpmhbKpuYXRpdmVDZWlskhAbwMDADpDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWQuanOYoXIACsDAkQ/AwpmhZAYNEsCSEg7AwpmhbKtuYXRpdmVGbG9vcpISGcDAwA6Q2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFkLmpzmKFyAAvAwJERwMKZoWQBEBTAmhUWFxgZGhsUEQ/AwpmhbKNwYWSSFB7AwMDAkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhZC5qc5ihcgkDwBWRE8DCmKFyJQnAFpEKwMKYoXIVCcAXkQfAwpihciUKwBiRBMDCmKFyfg3AGZEBwMKYoXIBC8AakRHAwpihchkNwBuRAcDCmKFyAQrAwJEPwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIAA8DAkRPAwg==
====catalogjs annotation end====*/