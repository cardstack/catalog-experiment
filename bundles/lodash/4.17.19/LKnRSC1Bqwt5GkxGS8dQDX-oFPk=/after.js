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


export { after as default };
/*====catalogjs annotation start====
lZGVwq4uL3RvSW50ZWdlci5qcwHCwIGnZGVmYXVsdJShbKVhZnRlcgzAkZMMwMCDqXRvSW50ZWdlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCvRlVOQ19FUlJPUl9URVhUm6FskMIGwJIHCMDAwMCQpWFmdGVym6Fskq9GVU5DX0VSUk9SX1RFWFSpdG9JbnRlZ2VywgnAkgoLwMDAwJCdlgAAAcDCw5YAGQIFwsKWCQADwMLClgsJwMDCwpYOCcDAwsKWJAEGCcLClgQYB8DCwpYAD8DAwsKWRw/ABMLCls0Ct2UKDMLClgkFwAjCwpYJBcDAwsKWAw4LwMLC
====catalogjs annotation end====*/