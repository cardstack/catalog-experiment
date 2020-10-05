import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";




/**
 * This method is like `_.find` except that it returns the key of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {string|undefined} Returns the key of the matched element,
 *  else `undefined`.
 * @example
 *
 * var users = {
 *   'barney':  { 'age': 36, 'active': true },
 *   'fred':    { 'age': 40, 'active': false },
 *   'pebbles': { 'age': 1,  'active': true }
 * };
 *
 * _.findKey(users, function(o) { return o.age < 40; });
 * // => 'barney' (iteration order is not guaranteed)
 *
 * // The `_.matches` iteratee shorthand.
 * _.findKey(users, { 'age': 1, 'active': true });
 * // => 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findKey(users, 'active');
 * // => 'barney'
 */

function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);
}

const _default = (findKey);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTY0LmpzAZPCrC4vZGlzdC83Ny5qcwWTwqsuL2Rpc3QvNi5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQUwJGTFMDChatiYXNlRmluZEtleZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqYmFzZUZvck93bpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIKwJILDMACwKdkZWZhdWx0kKdmaW5kS2V5m6Fsk6tiYXNlRmluZEtleaxiYXNlSXRlcmF0ZWWqYmFzZUZvck93bsINwJIOD8DAwMCQqF9kZWZhdWx0m6FskadmaW5kS2V5whHAkhITwMDAwJDcABWWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLClh8LwAzCwpYBFwYJwsKWCQAHwMLClgsKwMDCwpYQCsDAwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWCQzACMLCls0EJgQOEMLClgkHwATCwpYEB8DAwsKWAgERFMLClgYBEsDCwpYACMAPwsKWCQjAwMLClgEOE8DCwg==
====catalogjs annotation end====*/