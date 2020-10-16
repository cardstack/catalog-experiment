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


export { initial as default };
/*====catalogjs annotation start====
lZGVwq0uL2Rpc3QvMTQyLmpzAcLAgadkZWZhdWx0lKFsp2luaXRpYWwIwJGTCMDAgqliYXNlU2xpY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQp2luaXRpYWyboWyRqWJhc2VTbGljZcIFwJIGB8DAwMCQmZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWTQnAwMLCls0BDxYGCMLClgkHwATCwpYJB8DAwsKWAw4HwMLC
====catalogjs annotation end====*/