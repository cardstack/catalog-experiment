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
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFspnBhZEVuZBXA3AAXl6FvAAADwJEOwJmhZAkAAsCRAsDCmKFprWNyZWF0ZVBhZGRpbmeSAhPAAKdkZWZhdWx0wMCYoXILDcDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqc3RyaW5nU2l6ZZIFEsABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBHAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwyQwMICwsDAmaFkCQALwJELwMKYoWmodG9TdHJpbmeSCxDAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOFJDAmaFkACcPwJUQERITD8DCmKFspnBhZEVuZJIPFsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWRFbmQuanOYoXIJBsAQkQ7AwpihciUIwBGRCsDCmKFyFQnAEpEHwMKYoXIlCsATkQTAwpihcj8NwMCRAcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAbAwJEOwMI=
====catalogjs annotation end====*/