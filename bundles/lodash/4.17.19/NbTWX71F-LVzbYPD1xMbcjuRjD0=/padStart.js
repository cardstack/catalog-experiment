import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function padStart(string, length, chars) {
  string = toString(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}
export { padStart as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFsqHBhZFN0YXJ0FcDcABeXoW8AAAPAkQ7AmaFkCQACwJECwMKYoWmtY3JlYXRlUGFkZGluZ5ICE8AAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapzdHJpbmdTaXplkgUSwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIEcACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpihaah0b1N0cmluZ5ILEMADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4UkMCZoWQAMA/AlRAREhMPwMKYoWyocGFkU3RhcnSSDxbAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFkU3RhcnQuanOYoXIJCMAQkQ7AwpihciUIwBGRCsDCmKFyFQnAEpEHwMKYoXIlCsATkQTAwpihcjYNwMCRAcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAjAwJEOwMI=
====catalogjs annotation end====*/