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


export { flattenDeep as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvODUuanMBwsCBp2RlZmF1bHSUoWyrZmxhdHRlbkRlZXANwJGTDcDAg6tiYXNlRmxhdHRlbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoSU5GSU5JVFmboWyQwgYJkgcIwMDAwJCrZmxhdHRlbkRlZXCboWySq2Jhc2VGbGF0dGVuqElORklOSVRZwgrAkgsMwMDAwJCelgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpZNC8AIwsKWPgEGCsLClgQAB8DCwpYACMAJwsKWCAjAwMLClgMFwMDCwpbNAR8JCw3CwpYJC8AEwsKWCQvAwMLClgMODMDCwg==
====catalogjs annotation end====*/