/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

export { isArray as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWynaXNBcnJheQbAkZMGwMCBp2lzQXJyYXmboWyRpUFycmF5wgIFkgMEwMDAwJCXlgAAAcDCw5bNAbABAgbCwpYEAAPAwsKWAAfABcLClgkHwMDCwpYDDcDAwsKWAg4EwMLC
====catalogjs annotation end====*/