import { default as baseSlice } from "./dist/142.js";
import { default as toInteger } from "./toInteger.js";



/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */

function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }

  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

const _default = (take);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQyLmpzAZPCri4vdG9JbnRlZ2VyLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEqWJhc2VTbGljZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIGwJIHCMABwKdkZWZhdWx0kKR0YWtlm6Fskql0b0ludGVnZXKpYmFzZVNsaWNlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRpHRha2XCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWDgnAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClm8JwATCwpbNAjQcCgzCwpYJBMAIwsKWBATAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/