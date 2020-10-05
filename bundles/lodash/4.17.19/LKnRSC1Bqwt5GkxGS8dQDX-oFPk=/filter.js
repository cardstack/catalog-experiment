import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";





/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */

function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

const _default = (filter);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTUwLmpzAZPCrC4vZGlzdC83My5qcwWTwqsuL2Rpc3QvNi5qcwmTwqwuL2lzQXJyYXkuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0GMCRkxjAwoarYXJyYXlGaWx0ZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqmJhc2VGaWx0ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCnaXNBcnJheZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCmZmlsdGVym6FslKdpc0FycmF5q2FycmF5RmlsdGVyqmJhc2VGaWx0ZXKsYmFzZUl0ZXJhdGVlwhHAkhITwMDAwJCoX2RlZmF1bHSboWyRpmZpbHRlcsIVwJIWF8DAwMCQ3AAZlgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpYPC8AIwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWAwrADMLClgEWCg3CwpYJAAvAwsKWCwzAwMLClhwMwMDCwpYBFw4RwsKWCQAPwMLClgsHwMDCwpYnB8AEwsKWzQSEEhIUwsKWCQbAEMLClgQGwMDCwpYCARUYwsKWBgEWwMLClgAIwBPCwpYJCMDAwsKWAQ4XwMLC
====catalogjs annotation end====*/