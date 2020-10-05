import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";





/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */

var difference = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
const _default = (difference);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNjEuanMBk8KsLi9kaXN0Lzg1LmpzBZPCrC4vZGlzdC80OS5qcwmTwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdBvAkZMbwMKGrmJhc2VEaWZmZXJlbmNlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKtiYXNlRmxhdHRlbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgrAkgsMwALAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCqZGlmZmVyZW5jZZuhbJSoYmFzZVJlc3SxaXNBcnJheUxpa2VPYmplY3SuYmFzZURpZmZlcmVuY2WrYmFzZUZsYXR0ZW7CExaSFBXAwMDAlK5iYXNlRGlmZmVyZW5jZatiYXNlRmxhdHRlbqhiYXNlUmVzdLFpc0FycmF5TGlrZU9iamVjdKhfZGVmYXVsdJuhbJGqZGlmZmVyZW5jZcIYwJIZGsDAwMCQ3AAclgAAAcDCw5YAFwIFwsKWCQADwMLClgsOwMDCwpYKDsAIwsKWARcGCcLClgkAB8DCwpYLC8DAwsKWCAvAEcLClgEXCg3CwpYJAAvAwsKWCwjAwMLClgAIwBDCwpYBIQ4SwsKWCQAPwMLClgsRwMDCwpYlEcAEwsKWDBHAwMLCls0CnwETF8LClgQAFMDCwpYACsAWwsKWBArAwMLClgMRDMDCwpYBARgbwsKWBgEZwMLClgAIwBXCwpYJCMDAwsKWAQ4awMLC
====catalogjs annotation end====*/