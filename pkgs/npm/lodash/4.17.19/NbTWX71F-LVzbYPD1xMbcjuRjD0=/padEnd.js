import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function padEnd(string, length, chars) {
  string = toString(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
}
export { padEnd as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFspnBhZEVuZBXA3AAXl6FvAAADwJDAmaFkCQACwJECwMKYoWmtY3JlYXRlUGFkZGluZ5ICE8AAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapzdHJpbmdTaXplkgUSwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIEcACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpihaah0b1N0cmluZ5ILEMADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4UkMCZoWQAJw/AlRAREhMPwMKYoWymcGFkRW5kkg8WwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhZEVuZC5qc5ihcgkGwBCRDsDCmKFyJQjAEZEKwMKYoXIVCcASkQfAwpihciUKwBORBMDCmKFyPw3AwJEBwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIABsDAkQ7Awg==
====catalogjs annotation end====*/