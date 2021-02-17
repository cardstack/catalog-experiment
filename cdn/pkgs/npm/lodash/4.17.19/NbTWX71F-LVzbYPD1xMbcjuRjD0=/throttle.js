import { default as debounce } from "./debounce.js";
import { default as isObject } from "./isObject.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}
export { throttle as default };
/*====catalogjs annotation start====
k5KVwq0uL2RlYm91bmNlLmpzA8LAlcKtLi9pc09iamVjdC5qcwfCwIGnZGVmYXVsdJWhbKh0aHJvdHRsZRPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGRlYm91bmNlkgIRwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqGlzT2JqZWN0kgYQwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEAChKQwJihZwABCw2QwMKZoWQEGAzAkgwKwMKZoWyvRlVOQ19FUlJPUl9URVhUkgwPwMDACpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90aHJvdHRsZS5qc5ihcgAPwMCRC8DCmaFkAVwOwJUPEBEOC8DCmaFsqHRocm90dGxlkg4UwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90aHJvdHRsZS5qc5ihcgkIwA+RDcDCmKFyzIEPwBCRC8DCmKFyDgjAEZEFwMKYoXLMowjAwJEBwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIACMDAkQ3Awg==
====catalogjs annotation end====*/