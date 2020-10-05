import { default as apply } from "./dist/111.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLike } from "./isArrayLike.js";






/**
 * Invokes the method at `path` of each element in `collection`, returning
 * an array of the results of each invoked method. Any additional arguments
 * are provided to each invoked method. If `path` is a function, it's invoked
 * for, and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|string} path The path of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke each method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invokeMap([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */

var invokeMap = baseRest(function (collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function (value) {
    result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
  });
  return result;
});
const _default = (invokeMap);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTExLmpzAZPCrC4vZGlzdC83NS5qcwWTwqsuL2Rpc3QvOC5qcwmTwqwuL2Rpc3QvNDkuanMNk8KwLi9pc0FycmF5TGlrZS5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQewJGTHsDCh6VhcHBseZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZUVhY2iboWmQwgbAkgcIwAHAp2RlZmF1bHSQqmJhc2VJbnZva2WboWmQwgrAkgsMwALAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kKtpc0FycmF5TGlrZZuhaZDCEsCSExTABMCnZGVmYXVsdJCpaW52b2tlTWFwm6FslahiYXNlUmVzdKtpc0FycmF5TGlrZahiYXNlRWFjaKVhcHBseapiYXNlSW52b2tlwhYZkhcYwMDAwJWlYXBwbHmoYmFzZUVhY2iqYmFzZUludm9rZahiYXNlUmVzdKtpc0FycmF5TGlrZahfZGVmYXVsdJuhbJGpaW52b2tlTWFwwhvAkhwdwMDAwJDcAB+WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwXAwMLClj8FwAzCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYwCMAEwsKWARYKDcLClgkAC8DCwpYLCsDAwsKWFgrAwMLClgEXDhHCwpYJAA/AwsKWCwjAwMLClgAIwBTCwpYBGxIVwsKWCQATwMLClgsLwMDCwpZwC8AIwsKWzQNmARYawsKWBAAXwMLClgAJwBnCwpYECcDAwsKWAy4QwMLClgEBGx7CwpYGARzAwsKWAAjAGMLClgkIwMDCwpYBDh3AwsI=
====catalogjs annotation end====*/