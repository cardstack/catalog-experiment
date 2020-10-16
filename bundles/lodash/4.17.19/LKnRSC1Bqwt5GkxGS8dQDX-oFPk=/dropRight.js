import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";



/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * _.dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * _.dropRight([1, 2, 3], 5);
 * // => []
 *
 * _.dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 */

function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}


export { dropRight as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTQyLmpzAcLAlcKuLi90b0ludGVnZXIuanMFwsCBp2RlZmF1bHSUoWypZHJvcFJpZ2h0DMCRkwzAwIOpYmFzZVNsaWNlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWRyb3BSaWdodJuhbJKpdG9JbnRlZ2VyqWJhc2VTbGljZcIJwJIKC8DAwMCQnZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWIAnAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClsyQCcAEwsKWzQJEHAoMwsKWCQnACMLClgkJwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/