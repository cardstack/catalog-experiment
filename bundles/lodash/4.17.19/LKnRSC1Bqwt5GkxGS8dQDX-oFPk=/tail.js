import { default as baseSlice } from "./dist/142.js";


/**
 * Gets all but the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.tail([1, 2, 3]);
 * // => [2, 3]
 */

function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}

const _default = (tail);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL2Rpc3QvMTQyLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDqWJhc2VTbGljZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCkdGFpbJuhbJGpYmFzZVNsaWNlwgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRpHRhaWzCCcCSCgvAwMDAkJ2WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClk0JwMDCwpbNAQ0aBgjCwpYJBMAEwsKWBATAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/