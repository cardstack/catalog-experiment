import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";



/**
 * Creates a slice of `array` with elements taken from the end. Elements are
 * taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: (value, index, array).
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
 * _.takeRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeRightWhile(users, ['active', false]);
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeRightWhile(users, 'active');
 * // => []
 */

function takeRightWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), false, true) : [];
}


export { takeRightWhile as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrS4vZGlzdC8xNDEuanMFwsCBp2RlZmF1bHSUoWyudGFrZVJpZ2h0V2hpbGUMwJGTDMDAg6xiYXNlSXRlcmF0ZWWboWmQwgLAkgMEwADAp2RlZmF1bHSQqWJhc2VXaGlsZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCudGFrZVJpZ2h0V2hpbGWboWySqWJhc2VXaGlsZaxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBGAYJwsKWCQAHwMLClgsJwMDCwpY2CcAEwsKWzQRRJAoMwsKWCQ7ACMLClgkOwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/