import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";



/**
 * Creates a slice of `array` excluding elements dropped from the end.
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
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.dropRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney']
 *
 * // The `_.matches` iteratee shorthand.
 * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['barney', 'fred']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.dropRightWhile(users, ['active', false]);
 * // => objects for ['barney']
 *
 * // The `_.property` iteratee shorthand.
 * _.dropRightWhile(users, 'active');
 * // => objects for ['barney', 'fred', 'pebbles']
 */

function dropRightWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), true, true) : [];
}


export { dropRightWhile as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrS4vZGlzdC8xNDEuanMFwsCBp2RlZmF1bHSUoWyuZHJvcFJpZ2h0V2hpbGUMwJGTDMDAg6xiYXNlSXRlcmF0ZWWboWmQwgLAkgMEwADAp2RlZmF1bHSQqWJhc2VXaGlsZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCuZHJvcFJpZ2h0V2hpbGWboWySqWJhc2VXaGlsZaxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBGAYJwsKWCQAHwMLClgsJwMDCwpY2CcAEwsKWzQR2IwoMwsKWCQ7ACMLClgkOwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/