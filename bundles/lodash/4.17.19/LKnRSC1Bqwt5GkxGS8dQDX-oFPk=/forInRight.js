import { default as baseForRight } from "./dist/159.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";




/**
 * This method is like `_.forIn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forInRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
 */

function forInRight(object, iteratee) {
  return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}

const _default = (forInRight);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTU5LmpzAZPCrS4vZGlzdC8xMDguanMFk8KrLi9rZXlzSW4uanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWsYmFzZUZvclJpZ2h0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKxjYXN0RnVuY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQpmtleXNJbpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCqZm9ySW5SaWdodJuhbJOsYmFzZUZvclJpZ2h0rGNhc3RGdW5jdGlvbqZrZXlzSW7CDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGqZm9ySW5SaWdodMIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAGAIFwsKWCQADwMLClgsMwMDCwpY4DMAIwsKWARgGCcLClgkAB8DCwpYLDMDAwsKWCQzADMLClgEWCg3CwpYJAAvAwsKWCwbAwMLClgwGwMDCwpbNAn0EDhDCwpYJCsAEwsKWBArAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/