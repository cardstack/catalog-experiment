import { default as createFind } from "./dist/3.js";
import { default as findLastIndex } from "./findLastIndex.js";



/**
 * This method is like `_.find` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=collection.length-1] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(n) {
 *   return n % 2 == 1;
 * });
 * // => 3
 */

var findLast = createFind(findLastIndex);
const _default = (findLast);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvMy5qcwGTwrIuL2ZpbmRMYXN0SW5kZXguanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSqY3JlYXRlRmluZJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtZmluZExhc3RJbmRleJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoZmluZExhc3SboWySqmNyZWF0ZUZpbmStZmluZExhc3RJbmRleMIKDZILDMDAwMCSqmNyZWF0ZUZpbmStZmluZExhc3RJbmRleKhfZGVmYXVsdJuhbJGoZmluZExhc3TCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABYCBcLClgkAA8DCwpYLCsDAwsKWAArACMLClgEdBgnCwpYJAAfAwsKWCw3AwMLClgENwMDCwpbNAj0BCg7CwpYEAAvAwsKWAAjADcLClgQIwMDCwpYDAQTAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/