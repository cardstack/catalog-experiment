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

const _default = (functions);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODMuanMBk8KpLi9rZXlzLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKErWJhc2VGdW5jdGlvbnOboWmQwgLAkgMEwADAp2RlZmF1bHSQpGtleXOboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWZ1bmN0aW9uc5uhbJKtYmFzZUZ1bmN0aW9uc6RrZXlzwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRqWZ1bmN0aW9uc8INwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsNwMDCwpYqDcAIwsKWARQGCcLClgkAB8DCwpYLBMDAwsKWCQTAwMLCls0B4gwKDMLClgkJwATCwpYECcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/