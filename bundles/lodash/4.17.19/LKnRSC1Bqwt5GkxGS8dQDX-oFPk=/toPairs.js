import { default as createToPairs } from "./dist/44.js";
import { default as keys } from "./keys.js";



/**
 * Creates an array of own enumerable string keyed-value pairs for `object`
 * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
 * entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entries
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
 * _.toPairs(new Foo);
 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
 */

var toPairs = createToPairs(keys);
const _default = (toPairs);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDQuanMBk8KpLi9rZXlzLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKErWNyZWF0ZVRvUGFpcnOboWmQwgLAkgMEwADAp2RlZmF1bHSQpGtleXOboWmQwgbAkgcIwAHAp2RlZmF1bHSQp3RvUGFpcnOboWySrWNyZWF0ZVRvUGFpcnOka2V5c8IKDZILDMDAwMCSrWNyZWF0ZVRvUGFpcnOka2V5c6hfZGVmYXVsdJuhbJGndG9QYWlyc8IPwJIQEcDAwMCQ3AATlgAAAcDCw5YAFwIFwsKWCQADwMLClgsNwMDCwpYADcAIwsKWARQGCcLClgkAB8DCwpYLBMDAwsKWAQTAwMLCls0CMgEKDsLClgQAC8DCwpYAB8ANwsKWBAfAwMLClgMBBMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/