import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwnRight } from "./dist/79.js";
import { default as baseIteratee } from "./dist/6.js";




/**
 * This method is like `_.findKey` except that it iterates over elements of
 * a collection in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
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
 * _.findLastKey(users, function(o) { return o.age < 40; });
 * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastKey(users, { 'age': 36, 'active': true });
 * // => 'barney'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastKey(users, 'active');
 * // => 'pebbles'
 */

function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}

const _default = (findLastKey);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTY0LmpzAZPCrC4vZGlzdC83OS5qcwWTwqsuL2Rpc3QvNi5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQUwJGTFMDChatiYXNlRmluZEtleZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCvYmFzZUZvck93blJpZ2h0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgrAkgsMwALAp2RlZmF1bHSQq2ZpbmRMYXN0S2V5m6Fsk6tiYXNlRmluZEtleaxiYXNlSXRlcmF0ZWWvYmFzZUZvck93blJpZ2h0wg3Akg4PwMDAwJCoX2RlZmF1bHSboWyRq2ZpbmRMYXN0S2V5whHAkhITwMDAwJDcABWWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLClh8LwAzCwpYBFwYJwsKWCQAHwMLClgsPwMDCwpYQD8DAwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWCQzACMLCls0EIAQOEMLClgkLwATCwpYEC8DAwsKWAgERFMLClgYBEsDCwpYACMAPwsKWCQjAwMLClgEOE8DCwg==
====catalogjs annotation end====*/