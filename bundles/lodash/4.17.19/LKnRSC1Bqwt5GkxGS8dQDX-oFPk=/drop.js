import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";



/**
 * Creates a slice of `array` with `n` elements dropped from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.drop([1, 2, 3]);
 * // => [2, 3]
 *
 * _.drop([1, 2, 3], 2);
 * // => [3]
 *
 * _.drop([1, 2, 3], 5);
 * // => []
 *
 * _.drop([1, 2, 3], 0);
 * // => [1, 2, 3]
 */

function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}

const _default = (drop);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQyLmpzAZPCri4vdG9JbnRlZ2VyLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEqWJhc2VTbGljZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIGwJIHCMABwKdkZWZhdWx0kKRkcm9wm6Fskql0b0ludGVnZXKpYmFzZVNsaWNlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRpGRyb3DCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWDgnAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClsyQCcAEwsKWzQI2IQoMwsKWCQTACMLClgQEwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/