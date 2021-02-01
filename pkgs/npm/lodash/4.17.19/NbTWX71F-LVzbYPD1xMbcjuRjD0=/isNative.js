import { default as coreJsData } from "./dist/88.js";
import { default as isFunction } from "./isFunction.js";
import { default as stubFalse } from "./stubFalse.js";
import { default as baseIsNative } from "./dist/69.js";
var isMaskable = coreJsData ? isFunction : stubFalse;
var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.';
function isNative(value) {
  if (isMaskable(value)) {
    throw new Error(CORE_ERROR_TEXT);
  }

  return baseIsNative(value);
}
export { isNative as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODguanMDwsCVwq8uL2lzRnVuY3Rpb24uanMGwsCVwq4uL3N0dWJGYWxzZS5qcwnCwJXCrC4vZGlzdC82OS5qcwzCwIGnZGVmYXVsdJShbKhpc05hdGl2ZR7A3AAgl6FvAAADwJDAmaFkCQACwJECwMKYoWmqY29yZUpzRGF0YZICEcAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaappc0Z1bmN0aW9ukgUSwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBGgQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXN0dWJGYWxzZZIIE8ACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpihaaxiYXNlSXNOYXRpdmWSCxzAA6dkZWZhdWx0wMCYoXILDMDAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOFJDAmKFnAAEPwJDAwpmhZAQAEMCVERITEA7AwpihbKppc01hc2thYmxlkhAawMDADtlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc01hc2thYmxlLmpzmKFyAArAEZEPwMKYoXIDCsASkQHAwpihcgMKwBORBMDCmKFyAwnAwJEHwMKXoW8BABUdkMCYoWcAARYYkMDCmaFkBEQXwJIXFcDCmKFsr0NPUkVfRVJST1JfVEVYVJIXG8DAwBXZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc05hdGl2ZS5qc5ihcgAPwMCRFsDCmaFkAQoZwJUaGxwZFsDCmKFsqGlzTmF0aXZlkhkfwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTmF0aXZlLmpzmKFyCQjAGpEYwMKYoXIQCsAbkQ/Awpihch8PwByRFsDCmKFyEQzAwJEKwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIACMDAkRjAwg==
====catalogjs annotation end====*/