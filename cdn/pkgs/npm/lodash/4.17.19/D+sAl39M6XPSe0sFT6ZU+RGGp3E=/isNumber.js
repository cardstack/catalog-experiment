import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var numberTag = '[object Number]';
function isNumber(value) {
  return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
}
export { isNumber as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwfCwIGnZGVmYXVsdJWhbKhpc051bWJlchPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmJhc2VHZXRUYWeSAhDAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmsaXNPYmplY3RMaWtlkgYPwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCBPAwJDAwpehbwEAChKQwJihZwABCw2QwMKZoWQEFAzAkgwKwMKZoWypbnVtYmVyVGFnkgwRwMDACpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc051bWJlci5qc5ihcgAJwMCRC8DCmaFkAQMOwJUPEBEOC8DCmaFsqGlzTnVtYmVykg4UwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc051bWJlci5qc5ihcgkIwA+RDcDCmKFyLwzAEJEFwMKYoXILCsARkQHAwpihcgsJwMCRC8DCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAjAwJENwMI=
====catalogjs annotation end====*/