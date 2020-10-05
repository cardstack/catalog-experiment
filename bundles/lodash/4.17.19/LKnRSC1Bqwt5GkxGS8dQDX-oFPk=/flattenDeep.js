import { default as baseFlatten } from "./dist/85.js";


/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0;
/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */

function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}

const _default = (flattenDeep);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvODUuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EcCRkxHAwoSrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQqElORklOSVRZm6FskMIGCZIHCMDAwMCQq2ZsYXR0ZW5EZWVwm6FskqtiYXNlRmxhdHRlbqhJTkZJTklUWcIKwJILDMDAwMCQqF9kZWZhdWx0m6FskatmbGF0dGVuRGVlcMIOwJIPEMDAwMCQ3AASlgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpZNC8AIwsKWPgEGCsLClgQAB8DCwpYACMAJwsKWCAjAwMLClgMFwMDCwpbNAR8JCw3CwpYJC8AEwsKWBAvAwMLClgIBDhHCwpYGAQ/AwsKWAAjADMLClgkIwMDCwpYBDhDAwsI=
====catalogjs annotation end====*/