import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";







/**
 * This method is like `_.union` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which uniqueness is computed. Result values are chosen from the first
 * array in which the value occurs. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.unionBy([2.1], [1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */

var unionBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2));
});
const _default = (unionBy);
export { _default as default };
/*====catalogjs annotation start====
lZaTwqwuL2Rpc3QvODUuanMBk8KrLi9kaXN0LzYuanMFk8KsLi9kaXN0LzQ5LmpzCZPCrC4vZGlzdC82My5qcw2TwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzEZPCqS4vbGFzdC5qcxaBp2RlZmF1bHSUoWyoX2RlZmF1bHQjwJGTI8DCiKtiYXNlRmxhdHRlbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoYmFzZVVuaXGboWmQwg7Akg8QwAPAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMISwJMTFBXABMCnZGVmYXVsdJCkbGFzdJuhaZDCF8CSGBnABcCnZGVmYXVsdJCndW5pb25CeZuhbJaoYmFzZVJlc3SkbGFzdLFpc0FycmF5TGlrZU9iamVjdKhiYXNlVW5pcatiYXNlRmxhdHRlbqxiYXNlSXRlcmF0ZWXCGx6SHB3AwMDAlqtiYXNlRmxhdHRlbqxiYXNlSXRlcmF0ZWWoYmFzZVJlc3SoYmFzZVVuaXGxaXNBcnJheUxpa2VPYmplY3SkbGFzdKhfZGVmYXVsdJuhbJGndW5pb25CecIgwJIhIsDAwMCQ3AAklgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYBC8AVwsKWARYGCcLClgkAB8DCwpYLDMDAwsKWCQzAwMLClgEXCg3CwpYJAAvAwsKWCwjAwMLClgAIwBnCwpYBFw4RwsKWCQAPwMLClgsIwMDCwpY2CMAEwsKWASESFsLClgkAE8DCwpYLEcDAwsKWERHAEMLClgwRwAjCwpYBFBcawsKWCQAYwMLClgsEwMDCwpYmBMAUwsKWzQMmARsfwsKWBAAcwMLClgAHwB7CwpYEB8DAwsKWAxIMwMLClgEBICPCwpYGASHAwsKWAAjAHcLClgkIwMDCwpYBDiLAwsI=
====catalogjs annotation end====*/