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

export { differenceBy as default };
/*====catalogjs annotation start====
lZaVwqwuL2Rpc3QvNjEuanMBwsCVwqwuL2Rpc3QvODUuanMFwsCVwqsuL2Rpc3QvNi5qcwnCwJXCrC4vZGlzdC80OS5qcw3CwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMRwsCVwqkuL2xhc3QuanMXwsCBp2RlZmF1bHSUoWysZGlmZmVyZW5jZUJ5IMCRkyDAwIeuYmFzZURpZmZlcmVuY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQq2Jhc2VGbGF0dGVum6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgrAkgsMwALAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCEsCUExQVFsAEwKdkZWZhdWx0kKRsYXN0m6FpkMIYwJIZGsAFwKdkZWZhdWx0kKxkaWZmZXJlbmNlQnmboWyWqGJhc2VSZXN0pGxhc3SxaXNBcnJheUxpa2VPYmplY3SuYmFzZURpZmZlcmVuY2WrYmFzZUZsYXR0ZW6sYmFzZUl0ZXJhdGVlwhwfkh0ewMDAwJauYmFzZURpZmZlcmVuY2WrYmFzZUZsYXR0ZW6sYmFzZUl0ZXJhdGVlqGJhc2VSZXN0sWlzQXJyYXlMaWtlT2JqZWN0pGxhc3TcACGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw7AwMLClgoOwAjCwpYBFwYJwsKWCQAHwMLClgsLwMDCwpYIC8AWwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWCQzAwMLClgEXDhHCwpYJAA/AwsKWCwjAwMLClgAIwBrCwpYBIRIXwsKWCQATwMLClgsRwMDCwpYREcAVwsKWNhHABMLClgwRwAzCwpYBFBgbwsKWCQAZwMLClgsEwMDCwpYtBMAUwsKWzQOjARwgwsKWBAAdwMLClgAMwB/CwpYJDMDAwsKWAxcQwMLClgIOHsDCwg==
====catalogjs annotation end====*/