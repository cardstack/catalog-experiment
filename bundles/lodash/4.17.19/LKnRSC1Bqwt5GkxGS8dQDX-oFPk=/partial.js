import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";





/** Used to compose bitmasks for function metadata. */

var WRAP_PARTIAL_FLAG = 32;
/**
 * Creates a function that invokes `func` with `partials` prepended to the
 * arguments it receives. This method is like `_.bind` except it does **not**
 * alter the `this` binding.
 *
 * The `_.partial.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 0.2.0
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * var sayHelloTo = _.partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 *
 * // Partially applied with placeholders.
 * var greetFred = _.partial(greet, _, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 */

var partial = baseRest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
}); // Assign default placeholders.

partial.placeholder = {};

export { partial as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDkuanMBwsCVwqwuL2Rpc3QvMjMuanMFwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcw3CwIGnZGVmYXVsdJShbKdwYXJ0aWFsHMCRkxzAwIaoYmFzZVJlc3SboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNyZWF0ZVdyYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWdldEhvbGRlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCucmVwbGFjZUhvbGRlcnOboWmQwg7Akg8QwAPAp2RlZmF1bHSQsVdSQVBfUEFSVElBTF9GTEFHm6FskMISwJITFMDAwMCQp3BhcnRpYWyboWyWqGJhc2VSZXN0rnJlcGxhY2VIb2xkZXJzqWdldEhvbGRlcqdwYXJ0aWFsqmNyZWF0ZVdyYXCxV1JBUF9QQVJUSUFMX0ZMQUfDFhuUFxgZGsDAwMCWqGJhc2VSZXN0qmNyZWF0ZVdyYXCpZ2V0SG9sZGVyrnJlcGxhY2VIb2xkZXJzsVdSQVBfUEFSVElBTF9GTEFHp3BhcnRpYWzcAB2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgAIwBDCwpYBFwYJwsKWCQAHwMLClgsKwMDCwpYNCsAUwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWCwnAGMLClgEYDhHCwpYJAA/AwsKWCw7AwMLCli0OwAzCwpY+ARIVwsKWBAUTwMLClgARwMDCwpYHEcDAwsKWzQQHARYZwsKWBAAXwMLClgAHwBvCwpYBB8AIwsKWIgfAHMLClgkHwMDCwpYDIwTAwsKWFA4awMLC
====catalogjs annotation end====*/