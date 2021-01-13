import { default as isFunction } from "./isFunction.js";
import { default as isLength } from "./isLength.js";
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
export { isArrayLike as default };
/*====catalogjs annotation start====
k5KVwq8uL2lzRnVuY3Rpb24uanMDwsCVwq0uL2lzTGVuZ3RoLmpzBsLAgadkZWZhdWx0lKFsq2lzQXJyYXlMaWtlDcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqmlzRnVuY3Rpb26SAgvAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAaAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoaXNMZW5ndGiSBQrAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIDJDAmaFkAAoJwJMKCwnAwpihbKtpc0FycmF5TGlrZZIJDsDAwMDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0FycmF5TGlrZS5qc5ihcgkLwAqRCMDCmKFyJAjAC5EEwMKYoXITCsDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgALwMCRCMDC
====catalogjs annotation end====*/