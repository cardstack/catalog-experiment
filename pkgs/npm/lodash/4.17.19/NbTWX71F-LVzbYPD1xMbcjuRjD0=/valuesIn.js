import { default as baseValues } from "./dist/96.js";
import { default as keysIn } from "./keysIn.js";
function valuesIn(object) {
  return object == null ? [] : baseValues(object, keysIn(object));
}
export { valuesIn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTYuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJShbKh2YWx1ZXNJbg3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VWYWx1ZXOSAgrAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmma2V5c0lukgULwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKYoWyodmFsdWVzSW6SCQ7AwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdmFsdWVzSW4uanOYoXIJCMAKkQjAwpihcioKwAuRAcDCmKFyCQbAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACMDAkQjAwg==
====catalogjs annotation end====*/