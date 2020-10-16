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

export { unionBy as default };
/*====catalogjs annotation start====
lZaVwqwuL2Rpc3QvODUuanMBwsCVwqsuL2Rpc3QvNi5qcwXCwJXCrC4vZGlzdC80OS5qcwnCwJXCrC4vZGlzdC82My5qcw3CwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMRwsCVwqkuL2xhc3QuanMWwsCBp2RlZmF1bHSUoWyndW5pb25CeR/AkZMfwMCHq2Jhc2VGbGF0dGVum6FpkMICwJIDBMAAwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIKwJILDMACwKdkZWZhdWx0kKhiYXNlVW5pcZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCxaXNBcnJheUxpa2VPYmplY3SboWmQwhLAkxMUFcAEwKdkZWZhdWx0kKRsYXN0m6FpkMIXwJIYGcAFwKdkZWZhdWx0kKd1bmlvbkJ5m6FslqhiYXNlUmVzdKRsYXN0sWlzQXJyYXlMaWtlT2JqZWN0qGJhc2VVbmlxq2Jhc2VGbGF0dGVurGJhc2VJdGVyYXRlZcIbHpIcHcDAwMCWq2Jhc2VGbGF0dGVurGJhc2VJdGVyYXRlZahiYXNlUmVzdKhiYXNlVW5pcbFpc0FycmF5TGlrZU9iamVjdKRsYXN03AAglgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYBC8AVwsKWARYGCcLClgkAB8DCwpYLDMDAwsKWCQzAwMLClgEXCg3CwpYJAAvAwsKWCwjAwMLClgAIwBnCwpYBFw4RwsKWCQAPwMLClgsIwMDCwpY2CMAEwsKWASESFsLClgkAE8DCwpYLEcDAwsKWERHAEMLClgwRwAjCwpYBFBcawsKWCQAYwMLClgsEwMDCwpYmBMAUwsKWzQMmARsfwsKWBAAcwMLClgAHwB7CwpYJB8DAwsKWAxIMwMLClgIOHcDCwg==
====catalogjs annotation end====*/