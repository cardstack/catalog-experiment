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

const _default = (dropRight);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQyLmpzAZPCri4vdG9JbnRlZ2VyLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEqWJhc2VTbGljZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIGwJIHCMABwKdkZWZhdWx0kKlkcm9wUmlnaHSboWySqXRvSW50ZWdlcqliYXNlU2xpY2XCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGpZHJvcFJpZ2h0wg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLCliAJwMDCwpYBGQYJwsKWCQAHwMLClgsJwMDCwpbMkAnABMLCls0CRBwKDMLClgkJwAjCwpYECcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/