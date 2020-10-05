import { default as arrayFilter } from "./dist/150.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";





/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.without
 * @example
 *
 * _.xor([2, 1], [2, 3]);
 * // => [1, 3]
 */

var xor = baseRest(function (arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});
const _default = (xor);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTUwLmpzAZPCrC4vZGlzdC80OS5qcwWTwqwuL2Rpc3QvNjAuanMJk8K2Li9pc0FycmF5TGlrZU9iamVjdC5qcw2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQawJGTGsDChqthcnJheUZpbHRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQp2Jhc2VYb3KboWmQwgrAkgsMwALAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kKN4b3KboWyUqGJhc2VSZXN0p2Jhc2VYb3KrYXJyYXlGaWx0ZXKxaXNBcnJheUxpa2VPYmplY3TCEhWSExTAwMDAlKthcnJheUZpbHRlcqhiYXNlUmVzdKdiYXNlWG9ysWlzQXJyYXlMaWtlT2JqZWN0qF9kZWZhdWx0m6FskaN4b3LCF8CSGBnAwMDAkNwAG5YAAAHAwsOWABgCBcLClgkAA8DCwpYLC8DAwsKWAQvAEMLClgEXBgnCwpYJAAfAwsKWCwjAwMLClgAIwAzCwpYBFwoNwsKWCQALwMLClgsHwMDCwpYeB8AEwsKWASEOEcLClgkAD8DCwpYLEcDAwsKWCRHAwMLCls0CBQESFsLClgQAE8DCwpYAA8AVwsKWBAPAwMLClgMGCMDCwpYBARcawsKWBgEYwMLClgAIwBTCwpYJCMDAwsKWAQ4ZwMLC
====catalogjs annotation end====*/