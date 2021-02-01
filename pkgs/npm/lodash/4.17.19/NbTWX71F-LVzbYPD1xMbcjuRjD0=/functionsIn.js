import { default as baseFunctions } from "./dist/83.js";
import { default as keysIn } from "./keysIn.js";
function functionsIn(object) {
  return object == null ? [] : baseFunctions(object, keysIn(object));
}
export { functionsIn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODMuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJShbKtmdW5jdGlvbnNJbg3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprWJhc2VGdW5jdGlvbnOSAgrAAKdkZWZhdWx0wMCYoXILDcDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmma2V5c0lukgULwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKYoWyrZnVuY3Rpb25zSW6SCQ7AwMDA2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZnVuY3Rpb25zSW4uanOYoXIJC8AKkQjAwpihcioNwAuRAcDCmKFyCQbAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAC8DAkQjAwg==
====catalogjs annotation end====*/