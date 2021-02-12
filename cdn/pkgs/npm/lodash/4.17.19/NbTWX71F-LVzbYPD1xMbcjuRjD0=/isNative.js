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
k5SVwqwuL2Rpc3QvODguanMDwsCVwq8uL2lzRnVuY3Rpb24uanMGwsCVwq4uL3N0dWJGYWxzZS5qcwnCwJXCrC4vZGlzdC82OS5qcwzCwIGnZGVmYXVsdJWhbKhpc05hdGl2ZR7AwNwAIJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmNvcmVKc0RhdGGSAhHAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmlzRnVuY3Rpb26SBRLAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBGgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqXN0dWJGYWxzZZIIE8ACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEZBwyQwMICwsDAmaFkCQALwJELwMKZoWmsYmFzZUlzTmF0aXZlkgscwAOnZGVmYXVsdMDAwJihcgsMwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4UkMCYoWcAAQ/AkMDCmaFkBAAQwJUREhMQDsDCmaFsqmlzTWFza2FibGWSEBrAwMAOkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc01hc2thYmxlLmpzmKFyAArAEZEPwMKYoXIDCsASkQHAwpihcgMKwBORBMDCmKFyAwnAwJEHwMKXoW8BABUdkMCYoWcAARYYkMDCmaFkBEQXwJIXFcDCmaFsr0NPUkVfRVJST1JfVEVYVJIXG8DAwBWQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNOYXRpdmUuanOYoXIAD8DAkRbAwpmhZAEKGcCVGhscGRbAwpmhbKhpc05hdGl2ZZIZH8DAwMCQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNOYXRpdmUuanOYoXIJCMAakRjAwpihchAKwBuRD8DCmKFyHw/AHJEWwMKYoXIRDMDAkQrAwpihZwEDHsCQwMKYoWcJCx/AkR/AwpihcgAIwMCRGMDC
====catalogjs annotation end====*/