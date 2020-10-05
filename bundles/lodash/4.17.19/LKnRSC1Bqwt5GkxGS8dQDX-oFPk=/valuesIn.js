import { default as baseValues } from "./dist/96.js";
import { default as keysIn } from "./keysIn.js";



/**
 * Creates an array of the own and inherited enumerable string keyed property
 * values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.valuesIn(new Foo);
 * // => [1, 2, 3] (iteration order is not guaranteed)
 */

function valuesIn(object) {
  return object == null ? [] : baseValues(object, keysIn(object));
}

const _default = (valuesIn);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvOTYuanMBk8KrLi9rZXlzSW4uanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSqYmFzZVZhbHVlc5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCma2V5c0lum6FpkMIGwJIHCMABwKdkZWZhdWx0kKh2YWx1ZXNJbpuhbJKqYmFzZVZhbHVlc6ZrZXlzSW7CCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGodmFsdWVzSW7CDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWKgrACMLClgEWBgnCwpYJAAfAwsKWCwbAwMLClgkGwMDCwpbNAg0MCgzCwpYJCMAEwsKWBAjAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/