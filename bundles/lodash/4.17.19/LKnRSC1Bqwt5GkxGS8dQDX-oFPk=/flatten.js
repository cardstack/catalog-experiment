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

const _default = (flatten);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvODUuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQp2ZsYXR0ZW6boWyRq2Jhc2VGbGF0dGVuwgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRp2ZsYXR0ZW7CCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClk0LwMDCwpbNASkSBgjCwpYJB8AEwsKWBAfAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/