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
k5KVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2lzT2JqZWN0LmpzBsLAgadkZWZhdWx0lKFsqmlzRnVuY3Rpb24awNwAHJehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAhTAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoaXNPYmplY3SSBRPAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIGZDAmKFnAAEJEZDAwpmhZAQbCguSCgjAwpihbKhhc3luY1RhZ5IKF8DAwAjZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyAAjAwJEJwMKZoWQGFgwNkgwIwMKYoWynZnVuY1RhZ5IMFcDAwAjZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyAAfAwJELwMKZoWQGHw4Pkg4IwMKYoWymZ2VuVGFnkg4WwMDACNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRnVuY3Rpb24uanOYoXIABsDAkQ3AwpmhZAYTEMCSEAjAwpihbKhwcm94eVRhZ5IQGMDAwAjZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyAAjAwJEPwMKZoWQBAxLAmxMUFRYXGBILDQkPwMKYoWyqaXNGdW5jdGlvbpISG8DAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Z1bmN0aW9uLmpzmKFyCQrAE5ERwMKYoXIRCMAUkQTAwpihci4KwBWRAcDCmKFyGQfAFpELwMKYoXILBsAXkQ3AwpihcgsIwBiRCcDCmKFyCwjAwJEPwMKYoWcBAxrAkMDCmKFnCQsbwJEbwMKYoXIACsDAkRHAwg==
====catalogjs annotation end====*/