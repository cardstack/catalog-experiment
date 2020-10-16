import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";





/** Used to compose bitmasks for function metadata. */

var WRAP_PARTIAL_RIGHT_FLAG = 64;
/**
 * This method is like `_.partial` except that partially applied arguments
 * are appended to the arguments it receives.
 *
 * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
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
 * var greetFred = _.partialRight(greet, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 *
 * // Partially applied with placeholders.
 * var sayHelloTo = _.partialRight(greet, 'hello', _);
 * sayHelloTo('fred');
 * // => 'hello fred'
 */

var partialRight = baseRest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partialRight));
  return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
}); // Assign default placeholders.

partialRight.placeholder = {};

export { partialRight as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDkuanMBwsCVwqwuL2Rpc3QvMjMuanMFwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcw3CwIGnZGVmYXVsdJShbKxwYXJ0aWFsUmlnaHQcwJGTHMDAhqhiYXNlUmVzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY3JlYXRlV3JhcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpZ2V0SG9sZGVym6FpkMIKwJILDMACwKdkZWZhdWx0kK5yZXBsYWNlSG9sZGVyc5uhaZDCDsCSDxDAA8CnZGVmYXVsdJC3V1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUeboWyQwhLAkhMUwMDAwJCscGFydGlhbFJpZ2h0m6FslqhiYXNlUmVzdK5yZXBsYWNlSG9sZGVyc6lnZXRIb2xkZXKscGFydGlhbFJpZ2h0qmNyZWF0ZVdyYXC3V1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUfDFhuUFxgZGsDAwMCWqGJhc2VSZXN0qmNyZWF0ZVdyYXCpZ2V0SG9sZGVyrnJlcGxhY2VIb2xkZXJzt1dSQVBfUEFSVElBTF9SSUdIVF9GTEFHrHBhcnRpYWxSaWdodNwAHZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWAAjAEMLClgEXBgnCwpYJAAfAwsKWCwrAwMLClg0KwBTCwpYBGAoNwsKWCQALwMLClgsJwMDCwpYLCcAYwsKWARgOEcLClgkAD8DCwpYLDsDAwsKWLQ7ADMLClj4BEhXCwpYEBRPAwsKWABfAwMLClgcXwMDCwpbNA9kBFhnCwpYEABfAwsKWAAzAG8LClgEMwAjCwpYiDMAcwsKWCQzAwMLClgMjBMDCwpYUDhrAwsI=
====catalogjs annotation end====*/