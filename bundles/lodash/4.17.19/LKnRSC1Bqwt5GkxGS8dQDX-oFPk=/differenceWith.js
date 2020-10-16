import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";






/**
 * This method is like `_.difference` except that it accepts `comparator`
 * which is invoked to compare elements of `array` to `values`. The order and
 * references of result values are determined by the first array. The comparator
 * is invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 *
 * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }]
 */

var differenceWith = baseRest(function (array, values) {
  var comparator = last(values);

  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }

  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
});

export { differenceWith as default };
/*====catalogjs annotation start====
lZWVwqwuL2Rpc3QvNjEuanMBwsCVwqwuL2Rpc3QvODUuanMFwsCVwqwuL2Rpc3QvNDkuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDcLAlcKpLi9sYXN0LmpzE8LAgadkZWZhdWx0lKFsrmRpZmZlcmVuY2VXaXRoHMCRkxzAwIauYmFzZURpZmZlcmVuY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQq2Jhc2VGbGF0dGVum6FpkMIGwJIHCMABwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCxaXNBcnJheUxpa2VPYmplY3SboWmQwg7AlA8QERLAA8CnZGVmYXVsdJCkbGFzdJuhaZDCFMCSFRbABMCnZGVmYXVsdJCuZGlmZmVyZW5jZVdpdGiboWyVqGJhc2VSZXN0pGxhc3SxaXNBcnJheUxpa2VPYmplY3SuYmFzZURpZmZlcmVuY2WrYmFzZUZsYXR0ZW7CGBuSGRrAwMDAla5iYXNlRGlmZmVyZW5jZatiYXNlRmxhdHRlbqhiYXNlUmVzdLFpc0FycmF5TGlrZU9iamVjdKRsYXN03AAdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsOwMDCwpYKDsAIwsKWARcGCcLClgkAB8DCwpYLC8DAwsKWCAvAEsLClgEXCg3CwpYJAAvAwsKWCwjAwMLClgAIwBbCwpYBIQ4TwsKWCQAPwMLClgsRwMDCwpYREcARwsKWOhHABMLClgwRwMDCwpYBFBQXwsKWCQAVwMLClgsEwMDCwpYvBMAQwsKWzQNHARgcwsKWBAAZwMLClgAOwBvCwpYJDsDAwsKWAygMwMLClgIOGsDCwg==
====catalogjs annotation end====*/