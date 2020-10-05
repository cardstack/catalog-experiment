import { default as baseDifference } from "./dist/61.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";




/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */

var without = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, values) : [];
});
const _default = (without);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvNjEuanMBk8KsLi9kaXN0LzQ5LmpzBZPCti4vaXNBcnJheUxpa2VPYmplY3QuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0FsCRkxbAwoWuYmFzZURpZmZlcmVuY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCnd2l0aG91dJuhbJOoYmFzZVJlc3SxaXNBcnJheUxpa2VPYmplY3SuYmFzZURpZmZlcmVuY2XCDhGSDxDAwMDAk65iYXNlRGlmZmVyZW5jZahiYXNlUmVzdLFpc0FycmF5TGlrZU9iamVjdKhfZGVmYXVsdJuhbJGnd2l0aG91dMITwJIUFcDAwMCQ3AAXlgAAAcDCw5YAFwIFwsKWCQADwMLClgsOwMDCwpYKDsDAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjADMLClgEhCg3CwpYJAAvAwsKWCxHAwMLCliURwATCwpbNAi0BDhLCwpYEAA/AwsKWAAfAEcLClgQHwMDCwpYDGAjAwsKWAQETFsLClgYBFMDCwpYACMAQwsKWCQjAwMLClgEOFcDCwg==
====catalogjs annotation end====*/