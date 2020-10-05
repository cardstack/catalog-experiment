import { default as baseIsEqual } from "./dist/43.js";


/**
 * This method is like `_.isEqual` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with up to
 * six arguments: (objValue, othValue [, index|key, object, other, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, othValue) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqualWith(array, other, customizer);
 * // => true
 */

function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}

const _default = (isEqualWith);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvNDMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOrYmFzZUlzRXF1YWyboWmQwgLAkgMEwADAp2RlZmF1bHSQq2lzRXF1YWxXaXRom6FskatiYXNlSXNFcXVhbMIFwJIGB8DAwMCQqF9kZWZhdWx0m6Fskatpc0VxdWFsV2l0aMIJwJIKC8DAwMCQnZYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWzMgLwMDCwpbNA+QzBgjCwpYJC8AEwsKWBAvAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/