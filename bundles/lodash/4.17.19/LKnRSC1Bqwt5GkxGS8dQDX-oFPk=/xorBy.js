import { default as arrayFilter } from "./dist/150.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";







/**
 * This method is like `_.xor` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which by which they're compared. The order of result values is determined
 * by the order they occur in the arrays. The iteratee is invoked with one
 * argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2, 3.4]
 *
 * // The `_.property` iteratee shorthand.
 * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */

var xorBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee, 2));
});
const _default = (xorBy);
export { _default as default };
/*====catalogjs annotation start====
lZaTwq0uL2Rpc3QvMTUwLmpzAZPCqy4vZGlzdC82LmpzBZPCrC4vZGlzdC80OS5qcwmTwqwuL2Rpc3QvNjAuanMNk8K2Li9pc0FycmF5TGlrZU9iamVjdC5qcxGTwqkuL2xhc3QuanMWgadkZWZhdWx0lKFsqF9kZWZhdWx0I8CRkyPAwoirYXJyYXlGaWx0ZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgrAkgsMwALAp2RlZmF1bHSQp2Jhc2VYb3KboWmQwg7Akg8QwAPAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMISwJMTFBXABMCnZGVmYXVsdJCkbGFzdJuhaZDCF8CSGBnABcCnZGVmYXVsdJCleG9yQnmboWyWqGJhc2VSZXN0pGxhc3SxaXNBcnJheUxpa2VPYmplY3SnYmFzZVhvcqthcnJheUZpbHRlcqxiYXNlSXRlcmF0ZWXCGx6SHB3AwMDAlqthcnJheUZpbHRlcqxiYXNlSXRlcmF0ZWWoYmFzZVJlc3SnYmFzZVhvcrFpc0FycmF5TGlrZU9iamVjdKRsYXN0qF9kZWZhdWx0m6FskaV4b3JCecIgwJIhIsDAwMCQ3AAklgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpYBC8AVwsKWARYGCcLClgkAB8DCwpYLDMDAwsKWAwzAwMLClgEXCg3CwpYJAAvAwsKWCwjAwMLClgAIwBnCwpYBFw4RwsKWCQAPwMLClgsHwMDCwpY2B8AEwsKWASESFsLClgkAE8DCwpYLEcDAwsKWERHAEMLClgkRwAjCwpYBFBcawsKWCQAYwMLClgsEwMDCwpYmBMAUwsKWzQMjARsfwsKWBAAcwMLClgAFwB7CwpYEBcDAwsKWAxIMwMLClgEBICPCwpYGASHAwsKWAAjAHcLClgkIwMDCwpYBDiLAwsI=
====catalogjs annotation end====*/