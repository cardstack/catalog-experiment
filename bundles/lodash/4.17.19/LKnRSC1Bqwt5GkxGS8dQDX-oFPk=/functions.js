import { default as baseFunctions } from "./dist/83.js";
import { default as keys } from "./keys.js";



/**
 * Creates an array of function property names from own enumerable properties
 * of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see _.functionsIn
 * @example
 *
 * function Foo() {
 *   this.a = _.constant('a');
 *   this.b = _.constant('b');
 * }
 *
 * Foo.prototype.c = _.constant('c');
 *
 * _.functions(new Foo);
 * // => ['a', 'b']
 */

function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}


export { functions as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODMuanMBwsCVwqkuL2tleXMuanMFwsCBp2RlZmF1bHSUoWypZnVuY3Rpb25zDMCRkwzAwIOtYmFzZUZ1bmN0aW9uc5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCka2V5c5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCpZnVuY3Rpb25zm6Fskq1iYXNlRnVuY3Rpb25zpGtleXPCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClioNwAjCwpYBFAYJwsKWCQAHwMLClgsEwMDCwpYJBMDAwsKWzQHiDAoMwsKWCQnABMLClgkJwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/