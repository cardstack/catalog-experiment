import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var symbolTag = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
export { isSymbol as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwfCwIGnZGVmYXVsdJWhbKhpc1N5bWJvbBPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmJhc2VHZXRUYWeSAhDAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmsaXNPYmplY3RMaWtlkgYPwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCBPAwJDAwpehbwEAChKQwJihZwABCw2QwMKZoWQEFAzAkgwKwMKZoWypc3ltYm9sVGFnkgwRwMDACpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N5bWJvbC5qc5ihcgAJwMCRC8DCmaFkAQMOwJUPEBEOC8DCmaFsqGlzU3ltYm9skg4UwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N5bWJvbC5qc5ihcgkIwA+RDcDCmKFyLwzAEJEFwMKYoXILCsARkQHAwpihcgsJwMCRC8DCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAAjAwJENwMI=
====catalogjs annotation end====*/