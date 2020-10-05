import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";







/**
 * This method is like `_.difference` except that it accepts `iteratee` which
 * is invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */

var differenceBy = baseRest(function (array, values) {
  var iteratee = last(values);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2)) : [];
});
const _default = (differenceBy);
export { _default as default };
/*====catalogjs annotation start====
lZaTwqwuL2Rpc3QvNjEuanMBk8KsLi9kaXN0Lzg1LmpzBZPCqy4vZGlzdC82LmpzCZPCrC4vZGlzdC80OS5qcw2TwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzEZPCqS4vbGFzdC5qcxeBp2RlZmF1bHSUoWyoX2RlZmF1bHQkwJGTJMDCiK5iYXNlRGlmZmVyZW5jZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrYmFzZUZsYXR0ZW6boWmQwgbAkgcIwAHAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwg7Akg8QwAPAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMISwJQTFBUWwATAp2RlZmF1bHSQpGxhc3SboWmQwhjAkhkawAXAp2RlZmF1bHSQrGRpZmZlcmVuY2VCeZuhbJaoYmFzZVJlc3SkbGFzdLFpc0FycmF5TGlrZU9iamVjdK5iYXNlRGlmZmVyZW5jZatiYXNlRmxhdHRlbqxiYXNlSXRlcmF0ZWXCHB+SHR7AwMDAlq5iYXNlRGlmZmVyZW5jZatiYXNlRmxhdHRlbqxiYXNlSXRlcmF0ZWWoYmFzZVJlc3SxaXNBcnJheUxpa2VPYmplY3SkbGFzdKhfZGVmYXVsdJuhbJGsZGlmZmVyZW5jZUJ5wiHAkiIjwMDAwJDcACWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw7AwMLClgoOwAjCwpYBFwYJwsKWCQAHwMLClgsLwMDCwpYIC8AWwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWCQzAwMLClgEXDhHCwpYJAA/AwsKWCwjAwMLClgAIwBrCwpYBIRIXwsKWCQATwMLClgsRwMDCwpYREcAVwsKWNhHABMLClgwRwAzCwpYBFBgbwsKWCQAZwMLClgsEwMDCwpYtBMAUwsKWzQOjARwgwsKWBAAdwMLClgAMwB/CwpYEDMDAwsKWAxcQwMLClgEBISTCwpYGASLAwsKWAAjAHsLClgkIwMDCwpYBDiPAwsI=
====catalogjs annotation end====*/