import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";



/**
 * Creates a slice of `array` excluding elements dropped from the beginning.
 * Elements are dropped until `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.dropWhile(users, function(o) { return !o.active; });
 * // => objects for ['pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.dropWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.dropWhile(users, ['active', false]);
 * // => objects for ['pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.dropWhile(users, 'active');
 * // => objects for ['barney', 'fred', 'pebbles']
 */

function dropWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true) : [];
}


export { dropWhile as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrS4vZGlzdC8xNDEuanMFwsCBp2RlZmF1bHSUoWypZHJvcFdoaWxlDMCRkwzAwIOsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKliYXNlV2hpbGWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWRyb3BXaGlsZZuhbJKpYmFzZVdoaWxlrGJhc2VJdGVyYXRlZcIJwJIKC8DAwMCQnZYAAAHAwsOWABYCBcLClgkAA8DCwpYLDMDAwsKWCAzAwMLClgEYBgnCwpYJAAfAwsKWCwnAwMLCljYJwATCwpbNBGodCgzCwpYJCcAIwsKWCQnAwMLClgMOC8DCwg==
====catalogjs annotation end====*/