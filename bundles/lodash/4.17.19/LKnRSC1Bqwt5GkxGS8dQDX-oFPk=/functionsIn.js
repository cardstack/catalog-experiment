import { default as baseFunctions } from "./dist/83.js";
import { default as keysIn } from "./keysIn.js";



/**
 * Creates an array of function property names from own and inherited
 * enumerable properties of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see _.functions
 * @example
 *
 * function Foo() {
 *   this.a = _.constant('a');
 *   this.b = _.constant('b');
 * }
 *
 * Foo.prototype.c = _.constant('c');
 *
 * _.functionsIn(new Foo);
 * // => ['a', 'b', 'c']
 */

function functionsIn(object) {
  return object == null ? [] : baseFunctions(object, keysIn(object));
}

const _default = (functionsIn);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODMuanMBk8KrLi9rZXlzSW4uanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoStYmFzZUZ1bmN0aW9uc5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCma2V5c0lum6FpkMIGwJIHCMABwKdkZWZhdWx0kKtmdW5jdGlvbnNJbpuhbJKtYmFzZUZ1bmN0aW9uc6ZrZXlzSW7CCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGrZnVuY3Rpb25zSW7CDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLDcDAwsKWKg3ACMLClgEWBgnCwpYJAAfAwsKWCwbAwMLClgkGwMDCwpbNAfUMCgzCwpYJC8AEwsKWBAvAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/