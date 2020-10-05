import { default as createAggregator } from "./dist/2.js";


/**
 * Creates an array of elements split into two groups, the first of which
 * contains elements `predicate` returns truthy for, the second of which
 * contains elements `predicate` returns falsey for. The predicate is
 * invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of grouped elements.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': false },
 *   { 'user': 'fred',    'age': 40, 'active': true },
 *   { 'user': 'pebbles', 'age': 1,  'active': false }
 * ];
 *
 * _.partition(users, function(o) { return o.active; });
 * // => objects for [['fred'], ['barney', 'pebbles']]
 *
 * // The `_.matches` iteratee shorthand.
 * _.partition(users, { 'age': 1, 'active': false });
 * // => objects for [['pebbles'], ['barney', 'fred']]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.partition(users, ['active', false]);
 * // => objects for [['barney', 'pebbles'], ['fred']]
 *
 * // The `_.property` iteratee shorthand.
 * _.partition(users, 'active');
 * // => objects for [['fred'], ['barney', 'pebbles']]
 */

var partition = createAggregator(function (result, value, key) {
  result[key ? 0 : 1].push(value);
}, function () {
  return [[], []];
});
const _default = (partition);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqsuL2Rpc3QvMi5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQOwJGTDsDCg7BjcmVhdGVBZ2dyZWdhdG9ym6FpkMICwJIDBMAAwKdkZWZhdWx0kKlwYXJ0aXRpb26boWyRsGNyZWF0ZUFnZ3JlZ2F0b3LCBgmSBwjAwMDAkbBjcmVhdGVBZ2dyZWdhdG9yqF9kZWZhdWx0m6FskalwYXJ0aXRpb27CC8CSDA3AwMDAkJ+WAAABwMLDlgAWAgXCwpYJAAPAwsKWCxDAwMLClgAQwMDCwpbNBRUBBgrCwpYEAAfAwsKWAAnACcLClgQJwMDCwpYDagTAwsKWAQELDsLClgYBDMDCwpYACMAIwsKWCQjAwMLClgEODcDCwg==
====catalogjs annotation end====*/