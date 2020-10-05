import { default as baseSlice } from "./dist/142.js";


/**
 * Gets all but the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 */

function initial(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 0, -1) : [];
}

const _default = (initial);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL2Rpc3QvMTQyLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDqWJhc2VTbGljZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCnaW5pdGlhbJuhbJGpYmFzZVNsaWNlwgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRp2luaXRpYWzCCcCSCgvAwMDAkJ2WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClk0JwMDCwpbNAQ8WBgjCwpYJB8AEwsKWBAfAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/