import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as toInteger } from "./toInteger.js";




/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
 * // => 2
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
 * // => 0
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastIndex(users, ['active', false]);
 * // => 2
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastIndex(users, 'active');
 * // => 0
 */

function findLastIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = length - 1;

  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }

  return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}

const _default = (findLastIndex);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTI0LmpzAZPCqy4vZGlzdC82LmpzBZPCri4vdG9JbnRlZ2VyLmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdB3AkZMdwMKHrWJhc2VGaW5kSW5kZXiboWmQwgLAkgMEwADAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIKwJILDMACwKdkZWZhdWx0kKluYXRpdmVNYXiboWyRpE1hdGjCDhGSDxDAwMDAkKluYXRpdmVNaW6boWyRpE1hdGjCEhWSExTAwMDAkK1maW5kTGFzdEluZGV4m6Fslal0b0ludGVnZXKpbmF0aXZlTWF4qW5hdGl2ZU1pbq1iYXNlRmluZEluZGV4rGJhc2VJdGVyYXRlZcIWwJIXGMDAwMCQqF9kZWZhdWx0m6Fska1maW5kTGFzdEluZGV4whrAkhscwMDAwJDcAB6WAAABwMLDlgAYAgXCwpYJAAPAwsKWCw3AwMLCliMNwAjCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpYIDMDAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWzL8JwBDCwpZfAQ4WwsKWBAAPEsLClgAJwBHCwpYpCcAUwsKWAwjAwMLClgYAE8DCwpYACcAVwsKWFgnABMLClgMIwMDCwpbNBBAfFxnCwpYJDcAMwsKWBA3AwMLClgIBGh3CwpYGARvAwsKWAAjAGMLClgkIwMDCwpYBDhzAwsI=
====catalogjs annotation end====*/