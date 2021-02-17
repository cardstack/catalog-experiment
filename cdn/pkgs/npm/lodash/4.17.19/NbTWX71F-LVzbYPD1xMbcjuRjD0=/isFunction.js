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
k5KVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2lzT2JqZWN0LmpzB8LAgadkZWZhdWx0laFsqmlzRnVuY3Rpb24cwMDcAB6XoW8AAAPAkMCZoWQJAAIEkQLAwpmhaapiYXNlR2V0VGFnkgIWwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqGlzT2JqZWN0kgYVwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEAChuQwJihZwABCxOQwMKZoWQEGwwNkgwKwMKZoWyoYXN5bmNUYWeSDBnAwMAKkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRnVuY3Rpb24uanOYoXIACMDAkQvAwpmhZAYWDg+SDgrAwpmhbKdmdW5jVGFnkg4XwMDACpDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyAAfAwJENwMKZoWQGHxARkhAKwMKZoWymZ2VuVGFnkhAYwMDACpDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyAAbAwJEPwMKZoWQGExLAkhIKwMKZoWyocHJveHlUYWeSEhrAwMAKkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRnVuY3Rpb24uanOYoXIACMDAkRHAwpmhZAEDFMCbFRYXGBkaFA0PCxHAwpmhbKppc0Z1bmN0aW9ukhQdwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyCQrAFZETwMKYoXIRCMAWkQXAwpihci4KwBeRAcDCmKFyGQfAGJENwMKYoXILBsAZkQ/AwpihcgsIwBqRC8DCmKFyCwjAwJERwMKYoWcBAxzAkMDCmKFnCQsdwJEdwMKYoXIACsDAkRPAwg==
====catalogjs annotation end====*/