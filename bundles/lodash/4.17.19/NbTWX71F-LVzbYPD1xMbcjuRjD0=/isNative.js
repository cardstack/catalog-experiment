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
k5SVwqwuL2Rpc3QvODguanMDwsCVwq8uL2lzRnVuY3Rpb24uanMGwsCVwq4uL3N0dWJGYWxzZS5qcwnCwJXCrC4vZGlzdC82OS5qcwzCwIGnZGVmYXVsdJShbKhpc05hdGl2ZR7A3AAgl6FvAAADwJIPGMCZoWQJAALAkQLAwpihaapjb3JlSnNEYXRhkgIRwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmlzRnVuY3Rpb26SBRLAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEaBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpc3R1YkZhbHNlkggTwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprGJhc2VJc05hdGl2ZZILHMADp2RlZmF1bHTAwJihcgsMwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4UkMCYoWcAAQ/AkMDCmaFkBAAQwJUREhMQDsDCmKFsqmlzTWFza2FibGWSEBrAwMAO2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzTWFza2FibGUuanOYoXIACsARkQ/AwpihcgMKwBKRAcDCmKFyAwrAE5EEwMKYoXIDCcDAkQfAwpehbwEAFR2QwJihZwABFhiQwMKZoWQERBfAkhcVwMKYoWyvQ09SRV9FUlJPUl9URVhUkhcbwMDAFdlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTmF0aXZlLmpzmKFyAA/AwJEWwMKZoWQBChnAlRobHBkWwMKYoWyoaXNOYXRpdmWSGR/AwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNOYXRpdmUuanOYoXIJCMAakRjAwpihchAKwBuRD8DCmKFyHw/AHJEWwMKYoXIRDMDAkQrAwpihZwEDHsCQwMKYoWcJCx/AkR/AwpihcgAIwMCRGMDC
====catalogjs annotation end====*/