import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";
function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}
export { isElement as default };
/*====catalogjs annotation start====
k5KVwrEuL2lzT2JqZWN0TGlrZS5qcwPCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwbCwIGnZGVmYXVsdJShbKlpc0VsZW1lbnQNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxpc09iamVjdExpa2WSAgrAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAcAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmtaXNQbGFpbk9iamVjdJIFC8ABp2RlZmF1bHTAwJihcgsNwMCRBMDCnKFpAR0EB5DAwgHCwMCXoW8BAAgMkMCZoWQACgnAkwoLCcDCmKFsqWlzRWxlbWVudJIJDsDAwMDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0VsZW1lbnQuanOYoXIJCcAKkQjAwpihchMMwAuRAcDCmKFyJA3AwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACcDAkQjAwg==
====catalogjs annotation end====*/