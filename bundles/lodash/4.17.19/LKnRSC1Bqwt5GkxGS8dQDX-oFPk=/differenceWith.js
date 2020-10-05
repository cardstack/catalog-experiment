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
const _default = (differenceWith);
export { _default as default };
/*====catalogjs annotation start====
lZWTwqwuL2Rpc3QvNjEuanMBk8KsLi9kaXN0Lzg1LmpzBZPCrC4vZGlzdC80OS5qcwmTwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDZPCqS4vbGFzdC5qcxOBp2RlZmF1bHSUoWyoX2RlZmF1bHQgwJGTIMDCh65iYXNlRGlmZmVyZW5jZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrYmFzZUZsYXR0ZW6boWmQwgbAkgcIwAHAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIKwJILDMACwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCDsCUDxAREsADwKdkZWZhdWx0kKRsYXN0m6FpkMIUwJIVFsAEwKdkZWZhdWx0kK5kaWZmZXJlbmNlV2l0aJuhbJWoYmFzZVJlc3SkbGFzdLFpc0FycmF5TGlrZU9iamVjdK5iYXNlRGlmZmVyZW5jZatiYXNlRmxhdHRlbsIYG5IZGsDAwMCVrmJhc2VEaWZmZXJlbmNlq2Jhc2VGbGF0dGVuqGJhc2VSZXN0sWlzQXJyYXlMaWtlT2JqZWN0pGxhc3SoX2RlZmF1bHSboWyRrmRpZmZlcmVuY2VXaXRowh3Akh4fwMDAwJDcACGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw7AwMLClgoOwAjCwpYBFwYJwsKWCQAHwMLClgsLwMDCwpYIC8ASwsKWARcKDcLClgkAC8DCwpYLCMDAwsKWAAjAFsLClgEhDhPCwpYJAA/AwsKWCxHAwMLClhERwBHCwpY6EcAEwsKWDBHAwMLClgEUFBfCwpYJABXAwsKWCwTAwMLCli8EwBDCwpbNA0cBGBzCwpYEABnAwsKWAA7AG8LClgQOwMDCwpYDKAzAwsKWAQEdIMLClgYBHsDCwpYACMAawsKWCQjAwMLClgEOH8DCwg==
====catalogjs annotation end====*/