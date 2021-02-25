import { default as baseGetTag } from "./dist/86.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
var stringTag = '[object String]';
function isString(value) {
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
export { isString as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwqwuL2lzQXJyYXkuanMHwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwvCwIGnZGVmYXVsdJWhbKhpc1N0cmluZxjAwNwAGpehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmJhc2VHZXRUYWeSAhXAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmnaXNBcnJheZIGE8ABp2RlZmF1bHTAwMCYoXILB8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaaxpc09iamVjdExpa2WSChTAAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIE8DAkMDCl6FvAQAOF5DAmKFnAAEPEZDAwpmhZAQUEMCSEA7AwpmhbKlzdHJpbmdUYWeSEBbAwMAOkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzU3RyaW5nLmpzmKFyAAnAwJEPwMKZoWQBAxLAlhMUFRYSD8DCmaFsqGlzU3RyaW5nkhIZwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N0cmluZy5qc5ihcgkIwBOREcDCmKFyMAfAFJEFwMKYoXILDMAVkQnAwpihcgsKwBaRAcDCmKFyCwnAwJEPwMKYoWcBAxjAkMDCmKFnCQsZwJEZwMKYoXIACMDAkRHAwg==
====catalogjs annotation end====*/