import { default as baseGetTag } from "./dist/86.js";
import { default as isObject } from "./isObject.js";
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }

  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
export { isFunction as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2lzT2JqZWN0LmpzBsLAgadkZWZhdWx0lKFsqmlzRnVuY3Rpb24awNwAHJehbwAAA8CREcCZoWQJAALAkQLAwpihaapiYXNlR2V0VGFnkgIUwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGlzT2JqZWN0kgUTwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACBmQwJihZwABCRGQwMKZoWQEGwoLkgoIwMKYoWyoYXN5bmNUYWeSChfAwMAI2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGdW5jdGlvbi5qc5ihcgAIwMCRCcDCmaFkBhYMDZIMCMDCmKFsp2Z1bmNUYWeSDBXAwMAI2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGdW5jdGlvbi5qc5ihcgAHwMCRC8DCmaFkBh8OD5IOCMDCmKFspmdlblRhZ5IOFsDAwAjZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyAAbAwJENwMKZoWQGExDAkhAIwMKYoWyocHJveHlUYWeSEBjAwMAI2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGdW5jdGlvbi5qc5ihcgAIwMCRD8DCmaFkAQMSwJsTFBUWFxgSCw0JD8DCmKFsqmlzRnVuY3Rpb26SEhvAwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGdW5jdGlvbi5qc5ihcgkKwBOREcDCmKFyEQjAFJEEwMKYoXIuCsAVkQHAwpihchkHwBaRC8DCmKFyCwbAF5ENwMKYoXILCMAYkQnAwpihcgsIwMCRD8DCmKFnAQMawJDAwpihZwkLG8CRG8DCmKFyAArAwJERwMI=
====catalogjs annotation end====*/