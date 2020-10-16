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

export { findLast as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvMy5qcwHCwJXCsi4vZmluZExhc3RJbmRleC5qcwXCwIGnZGVmYXVsdJShbKhmaW5kTGFzdA7AkZMOwMCDqmNyZWF0ZUZpbmSboWmQwgLAkgMEwADAp2RlZmF1bHSQrWZpbmRMYXN0SW5kZXiboWmQwgbAkgcIwAHAp2RlZmF1bHSQqGZpbmRMYXN0m6FskqpjcmVhdGVGaW5krWZpbmRMYXN0SW5kZXjCCg2SCwzAwMDAkqpjcmVhdGVGaW5krWZpbmRMYXN0SW5kZXiflgAAAcDCw5YAFgIFwsKWCQADwMLClgsKwMDCwpYACsAIwsKWAR0GCcLClgkAB8DCwpYLDcDAwsKWAQ3AwMLCls0CPQEKDsLClgQAC8DCwpYACMANwsKWCQjAwMLClgMBBMDCwpYCDgzAwsI=
====catalogjs annotation end====*/