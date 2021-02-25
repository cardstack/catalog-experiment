import { default as isFunction } from "./isFunction.js";
import { default as isLength } from "./isLength.js";
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
export { isArrayLike as default };
/*====catalogjs annotation start====
k5KVwq8uL2lzRnVuY3Rpb24uanMDwsCVwq0uL2lzTGVuZ3RoLmpzB8LAgadkZWZhdWx0laFsq2lzQXJyYXlMaWtlD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmqaXNGdW5jdGlvbpICDcAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgRwMCQwMKZoWQJAAYIkQbAwpmhaahpc0xlbmd0aJIGDMABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoOkMCZoWQACgvAkwwNC8DCmaFsq2lzQXJyYXlMaWtlkgsQwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0FycmF5TGlrZS5qc5ihcgkLwAyRCsDCmKFyJAjADZEFwMKYoXITCsDAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgALwMCRCsDC
====catalogjs annotation end====*/