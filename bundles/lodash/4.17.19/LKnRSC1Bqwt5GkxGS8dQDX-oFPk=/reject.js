import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as negate } from "./negate.js";






/**
 * The opposite of `_.filter`; this method returns the elements of `collection`
 * that `predicate` does **not** return truthy for.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.filter
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': true }
 * ];
 *
 * _.reject(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.reject(users, { 'age': 40, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.reject(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.reject(users, 'active');
 * // => objects for ['barney']
 */

function reject(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, negate(baseIteratee(predicate, 3)));
}

const _default = (reject);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTUwLmpzAZPCrC4vZGlzdC83My5qcwWTwqsuL2Rpc3QvNi5qcwmTwqwuL2lzQXJyYXkuanMNk8KrLi9uZWdhdGUuanMRgadkZWZhdWx0lKFsqF9kZWZhdWx0HMCRkxzAwoerYXJyYXlGaWx0ZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqmJhc2VGaWx0ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCnaXNBcnJheZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCmbmVnYXRlm6FpkMISwJITFMAEwKdkZWZhdWx0kKZyZWplY3SboWyVp2lzQXJyYXmrYXJyYXlGaWx0ZXKqYmFzZUZpbHRlcqZuZWdhdGWsYmFzZUl0ZXJhdGVlwhXAkhYXwMDAwJCoX2RlZmF1bHSboWyRpnJlamVjdMIZwJIaG8DAwMCQ3AAdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpYPC8AIwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWAwrAFMLClgEWCg3CwpYJAAvAwsKWCwzAwMLClgEMwMDCwpYBFw4RwsKWCQAPwMLClgsHwMDCwpYnB8AEwsKWARYSFcLClgkAE8DCwpYLBsDAwsKWHAbADMLCls0EAhMWGMLClgkGwBDCwpYEBsDAwsKWAgEZHMLClgYBGsDCwpYACMAXwsKWCQjAwMLClgEOG8DCwg==
====catalogjs annotation end====*/