import { default as baseValues } from "./dist/96.js";
import { default as keys } from "./keys.js";



/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
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
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */

function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}


export { values as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvOTYuanMBwsCVwqkuL2tleXMuanMFwsCBp2RlZmF1bHSUoWymdmFsdWVzDMCRkwzAwIOqYmFzZVZhbHVlc5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCka2V5c5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCmdmFsdWVzm6FskqpiYXNlVmFsdWVzpGtleXPCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClioKwAjCwpYBFAYJwsKWCQAHwMLClgsEwMDCwpYJBMDAwsKWzQIhDAoMwsKWCQbABMLClgkGwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/