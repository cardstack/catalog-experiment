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

export { toPairsIn as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDQuanMBwsCVwqsuL2tleXNJbi5qcwXCwIGnZGVmYXVsdJShbKl0b1BhaXJzSW4OwJGTDsDAg61jcmVhdGVUb1BhaXJzm6FpkMICwJIDBMAAwKdkZWZhdWx0kKZrZXlzSW6boWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvUGFpcnNJbpuhbJKtY3JlYXRlVG9QYWlyc6ZrZXlzSW7CCg2SCwzAwMDAkq1jcmVhdGVUb1BhaXJzpmtleXNJbp+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClgANwAjCwpYBFgYJwsKWCQAHwMLClgsGwMDCwpYBBsDAwsKWzQJOAQoOwsKWBAALwMLClgAJwA3CwpYJCcDAwsKWAwEEwMLClgIODMDCwg==
====catalogjs annotation end====*/