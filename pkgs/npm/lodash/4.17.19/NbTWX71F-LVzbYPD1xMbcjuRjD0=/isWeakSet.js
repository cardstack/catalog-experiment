import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var weakSetTag = '[object WeakSet]';
function isWeakSet(value) {
  return isObjectLike(value) && baseGetTag(value) == weakSetTag;
}
export { isWeakSet as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKlpc1dlYWtTZXQRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAg7AAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsaXNPYmplY3RMaWtlkgUNwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQEFQrAkgoIwMKYoWyqd2Vha1NldFRhZ5IKD8DAwAjZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1dlYWtTZXQuanOYoXIACsDAkQnAwpmhZAEDDMCVDQ4PDAnAwpihbKlpc1dlYWtTZXSSDBLAwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNXZWFrU2V0LmpzmKFyCQnADZELwMKYoXITDMAOkQTAwpihcgsKwA+RAcDCmKFyCwrAwJEJwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACcDAkQvAwg==
====catalogjs annotation end====*/