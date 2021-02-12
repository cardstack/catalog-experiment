import { default as baseGetTag } from "./dist/86.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
var stringTag = '[object String]';
function isString(value) {
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
export { isString as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwqwuL2lzQXJyYXkuanMGwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwnCwIGnZGVmYXVsdJWhbKhpc1N0cmluZxXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmJhc2VHZXRUYWeSAhLAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpp2lzQXJyYXmSBRDAAadkZWZhdWx0wMDAmKFyCwfAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFprGlzT2JqZWN0TGlrZZIIEcACp2RlZmF1bHTAwMCYoXILDMDAkQfAwpyhaQEcBwqQwMICwsDAl6FvAQALFJDAmKFnAAEMDpDAwpmhZAQUDcCSDQvAwpmhbKlzdHJpbmdUYWeSDRPAwMALkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzU3RyaW5nLmpzmKFyAAnAwJEMwMKZoWQBAw/AlhAREhMPDMDCmaFsqGlzU3RyaW5nkg8WwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N0cmluZy5qc5ihcgkIwBCRDsDCmKFyMAfAEZEEwMKYoXILDMASkQfAwpihcgsKwBORAcDCmKFyCwnAwJEMwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACMDAkQ7Awg==
====catalogjs annotation end====*/