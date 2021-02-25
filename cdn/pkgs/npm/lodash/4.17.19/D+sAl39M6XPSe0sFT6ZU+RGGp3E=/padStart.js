import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function padStart(string, length, chars) {
  string = toString0(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}
export { padStart as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0laFsqHBhZFN0YXJ0GcDA3AAbl6FvAAADwJDAmaFkCQACBJECwMKZoWmtY3JlYXRlUGFkZGluZ5ICF8AAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaapzdHJpbmdTaXplkgYWwAGnZGVmYXVsdMDAwJihcgsKwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpqXRvSW50ZWdlcpIKFcACp2RlZmF1bHTAwMCYoXILCcDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgQwMCQwMKZoWQJAA4QkQ7Awpmhaal0b1N0cmluZzCSDhTAA6dkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcID8DAkMDCl6FvAQASGJDAmaFkADATwJUUFRYXE8DCmaFsqHBhZFN0YXJ0khMawMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYWRTdGFydC5qc5ihcgkIwBSREsDCmKFyJQnAFZENwMKYoXIVCcAWkQnAwpihciUKwBeRBcDCmKFyNg3AwJEBwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIACMDAkRLAwg==
====catalogjs annotation end====*/