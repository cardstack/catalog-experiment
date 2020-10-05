import { default as baseClamp } from "./dist/148.js";
import { default as toInteger } from "./toInteger.js";



/** Used as references for the maximum length and index of an array. */

var MAX_ARRAY_LENGTH = 4294967295;
/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3.2);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3.2');
 * // => 3
 */

function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
}

const _default = (toLength);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQ4LmpzAZPCri4vdG9JbnRlZ2VyLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBTAkZMUwMKFqWJhc2VDbGFtcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIGwJIHCMABwKdkZWZhdWx0kLBNQVhfQVJSQVlfTEVOR1RIm6FskMIKwJILDMDAwMCQqHRvTGVuZ3Rom6Fsk6liYXNlQ2xhbXCpdG9JbnRlZ2VysE1BWF9BUlJBWV9MRU5HVEjCDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGodG9MZW5ndGjCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWGwnACMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClgEJwAzCwpZNAQoNwsKWBA0LwMLClgAQwMDCwpYMEMDAwsKWzQIoCA4QwsKWCQjABMLClgQIwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/