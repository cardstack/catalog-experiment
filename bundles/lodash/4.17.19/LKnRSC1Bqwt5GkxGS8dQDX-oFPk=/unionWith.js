import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";






/**
 * This method is like `_.union` except that it accepts `comparator` which
 * is invoked to compare elements of `arrays`. Result values are chosen from
 * the first array in which the value occurs. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.unionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */

var unionWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});
const _default = (unionWith);
export { _default as default };
/*====catalogjs annotation start====
lZWTwqwuL2Rpc3QvODUuanMBk8KsLi9kaXN0LzQ5LmpzBZPCrC4vZGlzdC82My5qcwmTwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDZPCqS4vbGFzdC5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQewJGTHsDCh6tiYXNlRmxhdHRlbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqGJhc2VVbmlxm6FpkMIKwJILDMACwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCDsCSDxDAA8CnZGVmYXVsdJCkbGFzdJuhaZDCEsCSExTABMCnZGVmYXVsdJCpdW5pb25XaXRom6FslahiYXNlUmVzdKRsYXN0qGJhc2VVbmlxq2Jhc2VGbGF0dGVusWlzQXJyYXlMaWtlT2JqZWN0whYZkhcYwMDAwJWrYmFzZUZsYXR0ZW6oYmFzZVJlc3SoYmFzZVVuaXGxaXNBcnJheUxpa2VPYmplY3SkbGFzdKhfZGVmYXVsdJuhbJGpdW5pb25XaXRowhvAkhwdwMDAwJDcAB+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClgELwBDCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYACMAUwsKWARcKDcLClgkAC8DCwpYLCMDAwsKWXAjABMLClgEhDhHCwpYJAA/AwsKWCxHAwMLClgwRwMDCwpYBFBIVwsKWCQATwMLClgsEwMDCwpYoBMAMwsKWzQMLARYawsKWBAAXwMLClgAJwBnCwpYECcDAwsKWAyMIwMLClgEBGx7CwpYGARzAwsKWAAjAGMLClgkIwMDCwpYBDh3AwsI=
====catalogjs annotation end====*/