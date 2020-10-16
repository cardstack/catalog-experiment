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


export { findIndex as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTI0LmpzAcLAlcKrLi9kaXN0LzYuanMFwsCVwq4uL3RvSW50ZWdlci5qcwnCwIGnZGVmYXVsdJShbKlmaW5kSW5kZXgVwJGTFcDAha1iYXNlRmluZEluZGV4m6FpkMICwJIDBMAAwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpbmF0aXZlTWF4m6FskaRNYXRowg4Rkg8QwMDAwJCpZmluZEluZGV4m6FslKl0b0ludGVnZXKpbmF0aXZlTWF4rWJhc2VGaW5kSW5kZXisYmFzZUl0ZXJhdGVlwhLAkhMUwMDAwJDcABaWAAABwMLDlgAYAgXCwpYJAAPAwsKWCw3AwMLCliMNwAjCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpYIDMDAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWzJ0JwBDCwpZfAQ4SwsKWBAAPwMLClgAJwBHCwpYtCcAEwsKWAwjAwMLCls0EFhkTFcLClgkJwAzCwpYJCcDAwsKWAw4UwMLC
====catalogjs annotation end====*/