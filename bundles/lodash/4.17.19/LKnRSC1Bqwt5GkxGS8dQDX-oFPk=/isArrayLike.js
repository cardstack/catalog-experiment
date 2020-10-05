import { default as isFunction } from "./isFunction.js";
import { default as isLength } from "./isLength.js";



/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

const _default = (isArrayLike);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq8uL2lzRnVuY3Rpb24uanMBk8KtLi9pc0xlbmd0aC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKppc0Z1bmN0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKhpc0xlbmd0aJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCraXNBcnJheUxpa2WboWySqGlzTGVuZ3RoqmlzRnVuY3Rpb27CCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGraXNBcnJheUxpa2XCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABoCBcLClgkAA8DCwpYLCsDAwsKWEwrAwMLClgEYBgnCwpYJAAfAwsKWCwjAwMLCliQIwATCwpbNAmsKCgzCwpYJC8AIwsKWBAvAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/