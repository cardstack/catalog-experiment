import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as toInteger } from "./toInteger.js";




/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max;
/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */

function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

const _default = (findIndex);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTI0LmpzAZPCqy4vZGlzdC82LmpzBZPCri4vdG9JbnRlZ2VyLmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBnAkZMZwMKGrWJhc2VGaW5kSW5kZXiboWmQwgLAkgMEwADAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIKwJILDMACwKdkZWZhdWx0kKluYXRpdmVNYXiboWyRpE1hdGjCDhGSDxDAwMDAkKlmaW5kSW5kZXiboWyUqXRvSW50ZWdlcqluYXRpdmVNYXitYmFzZUZpbmRJbmRleKxiYXNlSXRlcmF0ZWXCEsCSExTAwMDAkKhfZGVmYXVsdJuhbJGpZmluZEluZGV4whbAkhcYwMDAwJDcABqWAAABwMLDlgAYAgXCwpYJAAPAwsKWCw3AwMLCliMNwAjCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpYIDMDAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWzJ0JwBDCwpZfAQ4SwsKWBAAPwMLClgAJwBHCwpYtCcAEwsKWAwjAwMLCls0EFhkTFcLClgkJwAzCwpYECcDAwsKWAgEWGcLClgYBF8DCwpYACMAUwsKWCQjAwMLClgEOGMDCwg==
====catalogjs annotation end====*/