import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";



/**
 * Creates a slice of `array` with `n` elements taken from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.takeRight([1, 2, 3]);
 * // => [3]
 *
 * _.takeRight([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.takeRight([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.takeRight([1, 2, 3], 0);
 * // => []
 */

function takeRight(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, n < 0 ? 0 : n, length);
}


export { takeRight as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTQyLmpzAcLAlcKuLi90b0ludGVnZXIuanMFwsCBp2RlZmF1bHSUoWypdGFrZVJpZ2h0DMCRkwzAwIOpYmFzZVNsaWNlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRha2VSaWdodJuhbJKpdG9JbnRlZ2VyqWJhc2VTbGljZcIJwJIKC8DAwMCQnZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWIAnAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClsyQCcAEwsKWzQJCIQoMwsKWCQnACMLClgkJwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/