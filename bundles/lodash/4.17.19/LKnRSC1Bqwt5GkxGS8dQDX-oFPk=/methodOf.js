import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";



/**
 * The opposite of `_.method`; this method creates a function that invokes
 * the method at a given path of `object`. Any additional arguments are
 * provided to the invoked method.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Util
 * @param {Object} object The object to query.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Function} Returns the new invoker function.
 * @example
 *
 * var array = _.times(3, _.constant),
 *     object = { 'a': array, 'b': array, 'c': array };
 *
 * _.map(['a[2]', 'c[0]'], _.methodOf(object));
 * // => [2, 0]
 *
 * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
 * // => [2, 0]
 */

var methodOf = baseRest(function (object, args) {
  return function (path) {
    return baseInvoke(object, path, args);
  };
});
const _default = (methodOf);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvOC5qcwGTwqwuL2Rpc3QvNDkuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSqYmFzZUludm9rZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqG1ldGhvZE9mm6FskqhiYXNlUmVzdKpiYXNlSW52b2tlwgoNkgsMwMDAwJKqYmFzZUludm9rZahiYXNlUmVzdKhfZGVmYXVsdJuhbJGobWV0aG9kT2bCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABYCBcLClgkAA8DCwpYLCsDAwsKWQQrAwMLClgEXBgnCwpYJAAfAwsKWCwjAwMLClgAIwATCwpbNAqcBCg7CwpYEAAvAwsKWAAjADcLClgQIwMDCwpYDHQjAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/