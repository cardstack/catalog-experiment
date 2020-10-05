import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";





/** Used to compose bitmasks for function metadata. */

var WRAP_BIND_FLAG = 1,
    WRAP_PARTIAL_FLAG = 32;
/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and `partials` prepended to the arguments it receives.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * function greet(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * }
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */

var bind = baseRest(function (func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(func, bitmask, thisArg, partials, holders);
}); // Assign default placeholders.

bind.placeholder = {};
const _default = (bind);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNDkuanMBk8KsLi9kaXN0LzIzLmpzBZPCrS4vZGlzdC8xMjYuanMJk8KtLi9kaXN0LzEyOS5qcw2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQjwJGTI8DCiKhiYXNlUmVzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY3JlYXRlV3JhcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpZ2V0SG9sZGVym6FpkMIKwJILDMACwKdkZWZhdWx0kK5yZXBsYWNlSG9sZGVyc5uhaZDCDsCSDxDAA8CnZGVmYXVsdJCuV1JBUF9CSU5EX0ZMQUeboWyQwhLAkhMUwMDAwJCxV1JBUF9QQVJUSUFMX0ZMQUeboWyQwhXAkhYXwMDAwJCkYmluZJuhbJeoYmFzZVJlc3SuV1JBUF9CSU5EX0ZMQUeucmVwbGFjZUhvbGRlcnOpZ2V0SG9sZGVypGJpbmSxV1JBUF9QQVJUSUFMX0ZMQUeqY3JlYXRlV3JhcMMZHpQaGxwdwMDAwJeoYmFzZVJlc3SqY3JlYXRlV3JhcKlnZXRIb2xkZXKucmVwbGFjZUhvbGRlcnOuV1JBUF9CSU5EX0ZMQUexV1JBUF9QQVJUSUFMX0ZMQUekYmluZKhfZGVmYXVsdJuhbJGkYmluZMIgwJIhIsDAwMCQ3AAklgAAAcDCw5YAFwIFwsKWCQADwMLClgsIwMDCwpYACMAUwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWEArAwMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgsJwBvCwpYBGA4RwsKWCQAPwMLClgsOwMDCwpYuDsAMwsKWPgESGMLClgQEExXCwpYADsDAwsKWNg7AEMLClgYFFsDCwpYAEcDAwsKWExHACMLCls0EHQEZHMLClgQAGsDCwpYABMAewsKWAQTAF8LCliIEwB/CwpYEBMDAwsKWAy8EwMLClhMBICPCwpYGASHAwsKWAAjAHcLClgkIwMDCwpYBDiLAwsI=
====catalogjs annotation end====*/