import { default as createToPairs } from "./dist/44.js";
import { default as keysIn } from "./keysIn.js";



/**
 * Creates an array of own and inherited enumerable string keyed-value pairs
 * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
 * or set, its entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entriesIn
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairsIn(new Foo);
 * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
 */

var toPairsIn = createToPairs(keysIn);
const _default = (toPairsIn);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDQuanMBk8KrLi9rZXlzSW4uanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoStY3JlYXRlVG9QYWlyc5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCma2V5c0lum6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b1BhaXJzSW6boWySrWNyZWF0ZVRvUGFpcnOma2V5c0luwgoNkgsMwMDAwJKtY3JlYXRlVG9QYWlyc6ZrZXlzSW6oX2RlZmF1bHSboWyRqXRvUGFpcnNJbsIPwJIQEcDAwMCQ3AATlgAAAcDCw5YAFwIFwsKWCQADwMLClgsNwMDCwpYADcAIwsKWARYGCcLClgkAB8DCwpYLBsDAwsKWAQbAwMLCls0CTgEKDsLClgQAC8DCwpYACcANwsKWBAnAwMLClgMBBMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/