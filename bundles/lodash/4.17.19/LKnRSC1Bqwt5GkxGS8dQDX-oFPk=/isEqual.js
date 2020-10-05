import { default as baseIsEqual } from "./dist/43.js";


/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */

function isEqual(value, other) {
  return baseIsEqual(value, other);
}

const _default = (isEqual);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvNDMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOrYmFzZUlzRXF1YWyboWmQwgLAkgMEwADAp2RlZmF1bHSQp2lzRXF1YWyboWyRq2Jhc2VJc0VxdWFswgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRp2lzRXF1YWzCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClhoLwMDCwpbNA04RBgjCwpYJB8AEwsKWBAfAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/