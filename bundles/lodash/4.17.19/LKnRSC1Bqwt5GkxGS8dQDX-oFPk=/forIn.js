import { default as baseFor } from "./dist/158.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";




/**
 * Iterates over own and inherited enumerable string keyed properties of an
 * object and invokes `iteratee` for each property. The iteratee is invoked
 * with three arguments: (value, key, object). Iteratee functions may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forInRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forIn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
 */

function forIn(object, iteratee) {
  return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
}

const _default = (forIn);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTU4LmpzAZPCrS4vZGlzdC8xMDguanMFk8KrLi9rZXlzSW4uanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWnYmFzZUZvcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsY2FzdEZ1bmN0aW9um6FpkMIGwJIHCMABwKdkZWZhdWx0kKZrZXlzSW6boWmQwgrAkgsMwALAp2RlZmF1bHSQpWZvcklum6Fsk6diYXNlRm9yrGNhc3RGdW5jdGlvbqZrZXlzSW7CDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGlZm9ySW7CEcCSEhPAwMDAkNwAFZYAAAHAwsOWABgCBcLClgkAA8DCwpYLB8DAwsKWOAfACMLClgEYBgnCwpYJAAfAwsKWCwzAwMLClgkMwAzCwpYBFgoNwsKWCQALwMLClgsGwMDCwpYMBsDAwsKWzQMeBA4QwsKWCQXABMLClgQFwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/