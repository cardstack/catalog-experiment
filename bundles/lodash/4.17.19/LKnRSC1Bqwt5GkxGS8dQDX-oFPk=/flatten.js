import { default as baseFlatten } from "./dist/85.js";


/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */

function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}


export { flatten as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvODUuanMBwsCBp2RlZmF1bHSUoWynZmxhdHRlbgjAkZMIwMCCq2Jhc2VGbGF0dGVum6FpkMICwJIDBMAAwKdkZWZhdWx0kKdmbGF0dGVum6FskatiYXNlRmxhdHRlbsIFwJIGB8DAwMCQmZYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWTQvAwMLCls0BKRIGCMLClgkHwATCwpYJB8DAwsKWAw4HwMLC
====catalogjs annotation end====*/