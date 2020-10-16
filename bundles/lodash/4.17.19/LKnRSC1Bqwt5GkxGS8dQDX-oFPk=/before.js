import { default as toInteger } from "./toInteger.js";


/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */

function before(n, func) {
  var result;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  n = toInteger(n);
  return function () {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }

    if (n <= 1) {
      func = undefined;
    }

    return result;
  };
}


export { before as default };
/*====catalogjs annotation start====
lZGVwq4uL3RvSW50ZWdlci5qcwHCwIGnZGVmYXVsdJShbKZiZWZvcmUMwJGTDMDAg6l0b0ludGVnZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQr0ZVTkNfRVJST1JfVEVYVJuhbJDCBsCSBwjAwMDAkKZiZWZvcmWboWySr0ZVTkNfRVJST1JfVEVYVKl0b0ludGVnZXLCCcCSCgvAwMDAkJ2WAAABwMLDlgAZAgXCwpYJAAPAwsKWCwnAwMLClg4JwMDCwpYkAQYJwsKWBBgHwMLClgAPwMDCwpZWD8AEwsKWzQKAzKwKDMLClgkGwAjCwpYJBsDAwsKWAw4LwMLC
====catalogjs annotation end====*/