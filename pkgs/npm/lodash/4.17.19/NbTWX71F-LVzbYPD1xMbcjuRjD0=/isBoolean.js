import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var boolTag = '[object Boolean]';
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
}
export { isBoolean as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKlpc0Jvb2xlYW4RwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAg7AAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsaXNPYmplY3RMaWtlkgUNwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQEFQrAkgoIwMKYoWynYm9vbFRhZ5IKD8DAwAjZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Jvb2xlYW4uanOYoXIAB8DAkQnAwpmhZAEDDMCVDQ4PDAnAwpihbKlpc0Jvb2xlYW6SDBLAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNCb29sZWFuLmpzmKFyCQnADZELwMKYoXI4DMAOkQTAwpihcgsKwA+RAcDCmKFyCwfAwJEJwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACcDAkQvAwg==
====catalogjs annotation end====*/