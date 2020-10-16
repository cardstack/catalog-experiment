import { default as createFind } from "./dist/3.js";
import { default as findIndex } from "./findIndex.js";



/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */

var find = createFind(findIndex);

export { find as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvMy5qcwHCwJXCri4vZmluZEluZGV4LmpzBcLAgadkZWZhdWx0lKFspGZpbmQOwJGTDsDAg6pjcmVhdGVGaW5km6FpkMICwJIDBMAAwKdkZWZhdWx0kKlmaW5kSW5kZXiboWmQwgbAkgcIwAHAp2RlZmF1bHSQpGZpbmSboWySqmNyZWF0ZUZpbmSpZmluZEluZGV4wgoNkgsMwMDAwJKqY3JlYXRlRmluZKlmaW5kSW5kZXiflgAAAcDCw5YAFgIFwsKWCQADwMLClgsKwMDCwpYACsAIwsKWARkGCcLClgkAB8DCwpYLCcDAwsKWAQnAwMLCls0EjwEKDsLClgQAC8DCwpYABMANwsKWCQTAwMLClgMBBMDCwpYCDgzAwsI=
====catalogjs annotation end====*/