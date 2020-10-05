import { default as toInteger } from "./toInteger.js";


/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * The opposite of `_.before`; this method creates a function that invokes
 * `func` once it's called `n` or more times.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {number} n The number of calls before `func` is invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var saves = ['profile', 'settings'];
 *
 * var done = _.after(saves.length, function() {
 *   console.log('done saving!');
 * });
 *
 * _.forEach(saves, function(type) {
 *   asyncSave({ 'type': type, 'complete': done });
 * });
 * // => Logs 'done saving!' after the two async saves have completed.
 */

function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  n = toInteger(n);
  return function () {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}

const _default = (after);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq4uL3RvSW50ZWdlci5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKl0b0ludGVnZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQr0ZVTkNfRVJST1JfVEVYVJuhbJDCBsCSBwjAwMDAkKVhZnRlcpuhbJKvRlVOQ19FUlJPUl9URVhUqXRvSW50ZWdlcsIJwJIKC8DAwMCQqF9kZWZhdWx0m6FskaVhZnRlcsINwJIOD8DAwMCQ3AARlgAAAcDCw5YAGQIFwsKWCQADwMLClgsJwMDCwpYOCcDAwsKWJAEGCcLClgQYB8DCwpYAD8DAwsKWRw/ABMLCls0Ct2UKDMLClgkFwAjCwpYEBcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/