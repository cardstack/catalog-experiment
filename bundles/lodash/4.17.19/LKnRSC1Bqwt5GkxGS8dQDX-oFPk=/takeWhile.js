import { default as baseIteratee } from "./dist/6.js";
import { default as baseWhile } from "./dist/141.js";



/**
 * Creates a slice of `array` with elements taken from the beginning. Elements
 * are taken until `predicate` returns falsey. The predicate is invoked with
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
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.takeWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney', 'fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeWhile(users, ['active', false]);
 * // => objects for ['barney', 'fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeWhile(users, 'active');
 * // => []
 */

function takeWhile(array, predicate) {
  return array && array.length ? baseWhile(array, baseIteratee(predicate, 3)) : [];
}

const _default = (takeWhile);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwq0uL2Rpc3QvMTQxLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKErGJhc2VJdGVyYXRlZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpYmFzZVdoaWxlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0YWtlV2hpbGWboWySqWJhc2VXaGlsZaxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGpdGFrZVdoaWxlwg3Akg4PwMDAwJDcABGWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBGAYJwsKWCQAHwMLClgsJwMDCwpY2CcAEwsKWzQQ/FwoMwsKWCQnACMLClgQJwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/