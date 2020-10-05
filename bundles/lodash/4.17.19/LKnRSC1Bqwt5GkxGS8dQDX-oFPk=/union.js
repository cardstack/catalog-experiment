import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";





/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */

var union = baseRest(function (arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
const _default = (union);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvODUuanMBk8KsLi9kaXN0LzQ5LmpzBZPCrC4vZGlzdC82My5qcwmTwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdBrAkZMawMKGq2Jhc2VGbGF0dGVum6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoYmFzZVVuaXGboWmQwgrAkgsMwALAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kKV1bmlvbpuhbJSoYmFzZVJlc3SoYmFzZVVuaXGrYmFzZUZsYXR0ZW6xaXNBcnJheUxpa2VPYmplY3TCEhWSExTAwMDAlKtiYXNlRmxhdHRlbqhiYXNlUmVzdKhiYXNlVW5pcbFpc0FycmF5TGlrZU9iamVjdKhfZGVmYXVsdJuhbJGldW5pb27CF8CSGBnAwMDAkNwAG5YAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWAQvAEMLClgEXBgnCwpYJAAfAwsKWCwjAwMLClgAIwAzCwpYBFwoNwsKWCQALwMLClgsIwMDCwpYeCMAEwsKWASEOEcLClgkAD8DCwpYLEcDAwsKWDBHAwMLCls0BtwESFsLClgQAE8DCwpYABcAVwsKWBAXAwMLClgMMCMDCwpYBARcawsKWBgEYwMLClgAIwBTCwpYJCMDAwsKWAQ4ZwMLC
====catalogjs annotation end====*/