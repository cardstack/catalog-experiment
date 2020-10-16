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

export { invokeMap as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTExLmpzAcLAlcKsLi9kaXN0Lzc1LmpzBcLAlcKrLi9kaXN0LzguanMJwsCVwqwuL2Rpc3QvNDkuanMNwsCVwrAuL2lzQXJyYXlMaWtlLmpzEcLAgadkZWZhdWx0lKFsqWludm9rZU1hcBrAkZMawMCGpWFwcGx5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlRWFjaJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCqYmFzZUludm9rZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwg7Akg8QwAPAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6FpkMISwJITFMAEwKdkZWZhdWx0kKlpbnZva2VNYXCboWyVqGJhc2VSZXN0q2lzQXJyYXlMaWtlqGJhc2VFYWNopWFwcGx5qmJhc2VJbnZva2XCFhmSFxjAwMDAlaVhcHBseahiYXNlRWFjaKpiYXNlSW52b2tlqGJhc2VSZXN0q2lzQXJyYXlMaWtl3AAblgAAAcDCw5YAGAIFwsKWCQADwMLClgsFwMDCwpY/BcAMwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWMAjABMLClgEWCg3CwpYJAAvAwsKWCwrAwMLClhYKwMDCwpYBFw4RwsKWCQAPwMLClgsIwMDCwpYACMAUwsKWARsSFcLClgkAE8DCwpYLC8DAwsKWcAvACMLCls0DZgEWGsLClgQAF8DCwpYACcAZwsKWCQnAwMLClgMuEMDCwpYCDhjAwsI=
====catalogjs annotation end====*/