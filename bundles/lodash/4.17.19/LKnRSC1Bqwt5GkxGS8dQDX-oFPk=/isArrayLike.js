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


export { isArrayLike as default };
/*====catalogjs annotation start====
lZKVwq8uL2lzRnVuY3Rpb24uanMBwsCVwq0uL2lzTGVuZ3RoLmpzBcLAgadkZWZhdWx0lKFsq2lzQXJyYXlMaWtlDMCRkwzAwIOqaXNGdW5jdGlvbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoaXNMZW5ndGiboWmQwgbAkgcIwAHAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6Fskqhpc0xlbmd0aKppc0Z1bmN0aW9uwgnAkgoLwMDAwJCdlgAAAcDCw5YAGgIFwsKWCQADwMLClgsKwMDCwpYTCsDAwsKWARgGCcLClgkAB8DCwpYLCMDAwsKWJAjABMLCls0CawoKDMLClgkLwAjCwpYJC8DAwsKWAw4LwMLC
====catalogjs annotation end====*/