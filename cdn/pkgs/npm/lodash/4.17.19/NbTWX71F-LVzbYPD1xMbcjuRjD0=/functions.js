import { default as baseFunctions } from "./dist/83.js";
import { default as keys } from "./keys.js";
function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}
export { functions as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODMuanMDwsCVwqkuL2tleXMuanMGwsCBp2RlZmF1bHSVoWypZnVuY3Rpb25zDcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprWJhc2VGdW5jdGlvbnOSAgrAAKdkZWZhdWx0wMDAmKFyCw3AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFppGtleXOSBQvAAadkZWZhdWx0wMDAmKFyCwTAwJEEwMKcoWkBFAQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKZoWypZnVuY3Rpb25zkgkOwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mdW5jdGlvbnMuanOYoXIJCcAKkQjAwpihcioNwAuRAcDCmKFyCQTAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACcDAkQjAwg==
====catalogjs annotation end====*/