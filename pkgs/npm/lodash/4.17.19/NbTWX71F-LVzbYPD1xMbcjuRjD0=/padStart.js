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
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFsqHBhZFN0YXJ0FcDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpihaa1jcmVhdGVQYWRkaW5nkgITwACnZGVmYXVsdMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqnN0cmluZ1NpemWSBRLAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpdG9JbnRlZ2VykggRwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqHRvU3RyaW5nkgsQwAOnZGVmYXVsdMDAmKFyCwjAwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADhSQwJmhZAAwD8CVEBESEw/AwpihbKhwYWRTdGFydJIPFsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWRTdGFydC5qc5ihcgkIwBCRDsDCmKFyJQjAEZEKwMKYoXIVCcASkQfAwpihciUKwBORBMDCmKFyNg3AwJEBwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACMDAkQ7Awg==
====catalogjs annotation end====*/