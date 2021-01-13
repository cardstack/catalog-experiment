import { default as copyObject } from "./dist/54.js";
import { default as keysIn } from "./keysIn.js";
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}
export { toPlainObject as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTQuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJShbK10b1BsYWluT2JqZWN0DcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqmNvcHlPYmplY3SSAgrAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmma2V5c0lukgULwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACAyQwJmhZAALCcCTCgsJwMKYoWytdG9QbGFpbk9iamVjdJIJDsDAwMDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b1BsYWluT2JqZWN0LmpzmKFyCQ3ACpEIwMKYoXITCsALkQHAwpihcggGwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAA3AwJEIwMI=
====catalogjs annotation end====*/