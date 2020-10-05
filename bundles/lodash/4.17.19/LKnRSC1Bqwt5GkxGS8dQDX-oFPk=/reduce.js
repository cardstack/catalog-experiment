import { default as arrayReduce } from "./dist/146.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseReduce } from "./dist/172.js";
import { default as isArray } from "./isArray.js";






/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */

function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

const _default = (reduce);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTQ2LmpzAZPCrC4vZGlzdC83NS5qcwWTwqsuL2Rpc3QvNi5qcwmTwq0uL2Rpc3QvMTcyLmpzDZPCrC4vaXNBcnJheS5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQcwJGTHMDCh6thcnJheVJlZHVjZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZUVhY2iboWmQwgbAkgcIwAHAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCqYmFzZVJlZHVjZZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCnaXNBcnJheZuhaZDCEsCSExTABMCnZGVmYXVsdJCmcmVkdWNlm6Fsladpc0FycmF5q2FycmF5UmVkdWNlqmJhc2VSZWR1Y2WsYmFzZUl0ZXJhdGVlqGJhc2VFYWNowhXAkhYXwMDAwJCoX2RlZmF1bHSboWyRpnJlZHVjZcIZwJIaG8DAwMCQ3AAdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpYPC8AQwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWJwjAwMLClgEWCg3CwpYJAAvAwsKWCwzAwMLClkQMwAjCwpYBGA4RwsKWCQAPwMLClgsKwMDCwpYDCsAMwsKWARcSFcLClgkAE8DCwpYLB8DAwsKWMwfABMLCls0FNAQWGMLClgkGwBTCwpYEBsDAwsKWAgEZHMLClgYBGsDCwpYACMAXwsKWCQjAwMLClgEOG8DCwg==
====catalogjs annotation end====*/