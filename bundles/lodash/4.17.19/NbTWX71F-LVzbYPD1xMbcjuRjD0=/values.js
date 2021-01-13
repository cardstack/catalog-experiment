import { default as baseValues } from "./dist/96.js";
import { default as keys } from "./keys.js";
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}
export { values as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTYuanMDwsCVwqkuL2tleXMuanMGwsCBp2RlZmF1bHSUoWymdmFsdWVzDcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqmJhc2VWYWx1ZXOSAgrAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmka2V5c5IFC8ABp2RlZmF1bHTAwJihcgsEwMCRBMDCnKFpARQEB5DAwgHCwMCXoW8BAAgMkMCZoWQADAnAkwoLCcDCmKFspnZhbHVlc5IJDsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy92YWx1ZXMuanOYoXIJBsAKkQjAwpihcioKwAuRAcDCmKFyCQTAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/