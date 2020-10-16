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


export { findKey as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTY0LmpzAcLAlcKsLi9kaXN0Lzc3LmpzBcLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWynZmluZEtleRDAkZMQwMCEq2Jhc2VGaW5kS2V5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKpiYXNlRm9yT3dum6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgrAkgsMwALAp2RlZmF1bHSQp2ZpbmRLZXmboWyTq2Jhc2VGaW5kS2V5rGJhc2VJdGVyYXRlZapiYXNlRm9yT3duwg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLClh8LwAzCwpYBFwYJwsKWCQAHwMLClgsKwMDCwpYQCsDAwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWCQzACMLCls0EJgQOEMLClgkHwATCwpYJB8DAwsKWAw4PwMLC
====catalogjs annotation end====*/