import { default as baseFlatten } from "./dist/85.js";
import { default as toInteger } from "./toInteger.js";



/**
 * Recursively flatten `array` up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * var array = [1, [2, [3, [4]], 5]];
 *
 * _.flattenDepth(array, 1);
 * // => [1, 2, [3, [4]], 5]
 *
 * _.flattenDepth(array, 2);
 * // => [1, 2, 3, [4], 5]
 */

function flattenDepth(array, depth) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}

const _default = (flattenDepth);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODUuanMBk8KuLi90b0ludGVnZXIuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsZmxhdHRlbkRlcHRom6Fskql0b0ludGVnZXKrYmFzZUZsYXR0ZW7CCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGsZmxhdHRlbkRlcHRowg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClhILwMDCwpYBGQYJwsKWCQAHwMLClgsJwMDCwpbMjAnABMLCls0ByxEKDMLClgkMwAjCwpYEDMDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/