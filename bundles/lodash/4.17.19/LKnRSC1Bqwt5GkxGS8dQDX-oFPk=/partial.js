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
const _default = (partial);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNDkuanMBk8KsLi9kaXN0LzIzLmpzBZPCrS4vZGlzdC8xMjYuanMJk8KtLi9kaXN0LzEyOS5qcw2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQgwJGTIMDCh6hiYXNlUmVzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY3JlYXRlV3JhcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpZ2V0SG9sZGVym6FpkMIKwJILDMACwKdkZWZhdWx0kK5yZXBsYWNlSG9sZGVyc5uhaZDCDsCSDxDAA8CnZGVmYXVsdJCxV1JBUF9QQVJUSUFMX0ZMQUeboWyQwhLAkhMUwMDAwJCncGFydGlhbJuhbJaoYmFzZVJlc3SucmVwbGFjZUhvbGRlcnOpZ2V0SG9sZGVyp3BhcnRpYWyqY3JlYXRlV3JhcLFXUkFQX1BBUlRJQUxfRkxBR8MWG5QXGBkawMDAwJaoYmFzZVJlc3SqY3JlYXRlV3JhcKlnZXRIb2xkZXKucmVwbGFjZUhvbGRlcnOxV1JBUF9QQVJUSUFMX0ZMQUencGFydGlhbKhfZGVmYXVsdJuhbJGncGFydGlhbMIdwJIeH8DAwMCQ3AAhlgAAAcDCw5YAFwIFwsKWCQADwMLClgsIwMDCwpYACMAQwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWDQrAFMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgsJwBjCwpYBGA4RwsKWCQAPwMLClgsOwMDCwpYtDsAMwsKWPgESFcLClgQFE8DCwpYAEcDAwsKWBxHAwMLCls0EBwEWGcLClgQAF8DCwpYAB8AbwsKWAQfACMLCliIHwBzCwpYEB8DAwsKWAyMEwMLClhMBHSDCwpYGAR7AwsKWAAjAGsLClgkIwMDCwpYBDh/AwsI=
====catalogjs annotation end====*/