import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function padEnd(string, length, chars) {
  string = toString0(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
}
export { padEnd as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0laFspnBhZEVuZBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprWNyZWF0ZVBhZGRpbmeSAhPAAKdkZWZhdWx0wMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqnN0cmluZ1NpemWSBRLAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqXRvSW50ZWdlcpIIEcACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEZBwyQwMICwsDAmaFkCQALwJELwMKZoWmpdG9TdHJpbmcwkgsQwAOnZGVmYXVsdMDAwJihcgsJwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4UkMCZoWQAJw/AlRAREhMPwMKZoWymcGFkRW5kkg8WwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWRFbmQuanOYoXIJBsAQkQ7AwpihciUJwBGRCsDCmKFyFQnAEpEHwMKYoXIlCsATkQTAwpihcj8NwMCRAcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAbAwJEOwMI=
====catalogjs annotation end====*/