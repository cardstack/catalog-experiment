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


export { findLastKey as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTY0LmpzAcLAlcKsLi9kaXN0Lzc5LmpzBcLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWyrZmluZExhc3RLZXkQwJGTEMDAhKtiYXNlRmluZEtleZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCvYmFzZUZvck93blJpZ2h0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgrAkgsMwALAp2RlZmF1bHSQq2ZpbmRMYXN0S2V5m6Fsk6tiYXNlRmluZEtleaxiYXNlSXRlcmF0ZWWvYmFzZUZvck93blJpZ2h0wg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLClh8LwAzCwpYBFwYJwsKWCQAHwMLClgsPwMDCwpYQD8DAwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWCQzACMLCls0EIAQOEMLClgkLwATCwpYJC8DAwsKWAw4PwMLC
====catalogjs annotation end====*/