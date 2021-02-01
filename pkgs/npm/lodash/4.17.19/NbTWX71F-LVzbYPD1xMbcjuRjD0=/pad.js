import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
var nativeCeil = Math.ceil,
    nativeFloor = Math.floor;
function pad(string, length, chars) {
  string = toString(string);
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
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFso3BhZB3A3AAfl6FvAAADwJDAmaFkCQACwJECwMKYoWmtY3JlYXRlUGFkZGluZ5MCGBrAAKdkZWZhdWx0wMCYoXILDcDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqc3RyaW5nU2l6ZZIFF8ABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBbAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwyQwMICwsDAmaFkCQALwJELwMKYoWmodG9TdHJpbmeSCxXAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOHJDAmKFnAAEPE5DAwpmhZAQMEBGSEA7AwpihbKpuYXRpdmVDZWlskhAbwMDADtlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhZC5qc5ihcgAKwMCRD8DCmaFkBg0SwJISDsDCmKFsq25hdGl2ZUZsb29ykhIZwMDADtlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhZC5qc5ihcgALwMCREcDCmaFkARAUwJoVFhcYGRobFBEPwMKYoWyjcGFkkhQewMDAwNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhZC5qc5ihcgkDwBWRE8DCmKFyJQjAFpEKwMKYoXIVCcAXkQfAwpihciUKwBiRBMDCmKFyfg3AGZEBwMKYoXIBC8AakRHAwpihchkNwBuRAcDCmKFyAQrAwJEPwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIAA8DAkRPAwg==
====catalogjs annotation end====*/