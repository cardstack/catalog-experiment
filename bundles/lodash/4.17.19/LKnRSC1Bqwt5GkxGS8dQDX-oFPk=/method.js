import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";



/**
 * Creates a function that invokes the method at `path` of a given object.
 * Any additional arguments are provided to the invoked method.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Util
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Function} Returns the new invoker function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': _.constant(2) } },
 *   { 'a': { 'b': _.constant(1) } }
 * ];
 *
 * _.map(objects, _.method('a.b'));
 * // => [2, 1]
 *
 * _.map(objects, _.method(['a', 'b']));
 * // => [2, 1]
 */

var method = baseRest(function (path, args) {
  return function (object) {
    return baseInvoke(object, path, args);
  };
});
const _default = (method);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvOC5qcwGTwqwuL2Rpc3QvNDkuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSqYmFzZUludm9rZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQpm1ldGhvZJuhbJKoYmFzZVJlc3SqYmFzZUludm9rZcIKDZILDMDAwMCSqmJhc2VJbnZva2WoYmFzZVJlc3SoX2RlZmF1bHSboWyRpm1ldGhvZMIPwJIQEcDAwMCQ3AATlgAAAcDCw5YAFgIFwsKWCQADwMLClgsKwMDCwpZBCsDAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLCls0CdwEKDsLClgQAC8DCwpYABsANwsKWBAbAwMLClgMdCMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/