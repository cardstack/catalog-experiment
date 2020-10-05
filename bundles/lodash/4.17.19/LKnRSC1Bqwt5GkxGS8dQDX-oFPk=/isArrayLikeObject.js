import { default as isArrayLike } from "./isArrayLike.js";
import { default as isObjectLike } from "./isObjectLike.js";



/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

const _default = (isArrayLikeObject);
export { _default as default };
/*====catalogjs annotation start====
lZKTwrAuL2lzQXJyYXlMaWtlLmpzAZPCsS4vaXNPYmplY3RMaWtlLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEq2lzQXJyYXlMaWtlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6Fskqxpc09iamVjdExpa2WraXNBcnJheUxpa2XCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGxaXNBcnJheUxpa2VPYmplY3TCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABsCBcLClgkAA8DCwpYLC8DAwsKWCwvAwMLClgEcBgnCwpYJAAfAwsKWCwzAwMLClhMMwATCwpbNAhEKCgzCwpYJEcAIwsKWBBHAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/