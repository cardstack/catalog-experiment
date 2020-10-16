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

export { difference as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNjEuanMBwsCVwqwuL2Rpc3QvODUuanMFwsCVwqwuL2Rpc3QvNDkuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDcLAgadkZWZhdWx0lKFsqmRpZmZlcmVuY2UXwJGTF8DAha5iYXNlRGlmZmVyZW5jZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrYmFzZUZsYXR0ZW6boWmQwgbAkgcIwAHAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIKwJILDMACwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCDsCTDxARwAPAp2RlZmF1bHSQqmRpZmZlcmVuY2WboWyUqGJhc2VSZXN0sWlzQXJyYXlMaWtlT2JqZWN0rmJhc2VEaWZmZXJlbmNlq2Jhc2VGbGF0dGVuwhMWkhQVwMDAwJSuYmFzZURpZmZlcmVuY2WrYmFzZUZsYXR0ZW6oYmFzZVJlc3SxaXNBcnJheUxpa2VPYmplY3TcABiWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw7AwMLClgoOwAjCwpYBFwYJwsKWCQAHwMLClgsLwMDCwpYIC8ARwsKWARcKDcLClgkAC8DCwpYLCMDAwsKWAAjAEMLClgEhDhLCwpYJAA/AwsKWCxHAwMLCliURwATCwpYMEcDAwsKWzQKfARMXwsKWBAAUwMLClgAKwBbCwpYJCsDAwsKWAxEMwMLClgIOFcDCwg==
====catalogjs annotation end====*/