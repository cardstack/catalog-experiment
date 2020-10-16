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

export { without as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvNjEuanMBwsCVwqwuL2Rpc3QvNDkuanMFwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzCcLAgadkZWZhdWx0lKFsp3dpdGhvdXQSwJGTEsDAhK5iYXNlRGlmZmVyZW5jZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMIKwJILDMACwKdkZWZhdWx0kKd3aXRob3V0m6Fsk6hiYXNlUmVzdLFpc0FycmF5TGlrZU9iamVjdK5iYXNlRGlmZmVyZW5jZcIOEZIPEMDAwMCTrmJhc2VEaWZmZXJlbmNlqGJhc2VSZXN0sWlzQXJyYXlMaWtlT2JqZWN03AATlgAAAcDCw5YAFwIFwsKWCQADwMLClgsOwMDCwpYKDsDAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjADMLClgEhCg3CwpYJAAvAwsKWCxHAwMLCliURwATCwpbNAi0BDhLCwpYEAA/AwsKWAAfAEcLClgkHwMDCwpYDGAjAwsKWAg4QwMLC
====catalogjs annotation end====*/