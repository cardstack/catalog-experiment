import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";



/**
 * Invokes the method at `path` of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
 *
 * _.invoke(object, 'a[0].b.c.slice', 1, 3);
 * // => [2, 3]
 */

var invoke = baseRest(baseInvoke);
const _default = (invoke);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvOC5qcwGTwqwuL2Rpc3QvNDkuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSqYmFzZUludm9rZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQpmludm9rZZuhbJKoYmFzZVJlc3SqYmFzZUludm9rZcIKDZILDMDAwMCSqmJhc2VJbnZva2WoYmFzZVJlc3SoX2RlZmF1bHSboWyRpmludm9rZcIPwJIQEcDAwMCQ3AATlgAAAcDCw5YAFgIFwsKWCQADwMLClgsKwMDCwpYBCsDAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLCls0B7wEKDsLClgQAC8DCwpYABsANwsKWBAbAwMLClgMBCMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/