import { default as baseRepeat } from "./dist/169.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";





/**
 * Repeats the given string `n` times.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to repeat.
 * @param {number} [n=1] The number of times to repeat the string.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the repeated string.
 * @example
 *
 * _.repeat('*', 3);
 * // => '***'
 *
 * _.repeat('abc', 2);
 * // => 'abcabc'
 *
 * _.repeat('abc', 0);
 * // => ''
 */

function repeat(string, n, guard) {
  if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  return baseRepeat(toString(string), n);
}

const _default = (repeat);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTY5LmpzAZPCrC4vZGlzdC83MC5qcwWTwq4uL3RvSW50ZWdlci5qcwmTwq0uL3RvU3RyaW5nLmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdBjAkZMYwMKGqmJhc2VSZXBlYXSboWmQwgLAkgMEwADAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIOwJIPEMADwKdkZWZhdWx0kKZyZXBlYXSboWyUrmlzSXRlcmF0ZWVDYWxsqXRvSW50ZWdlcqpiYXNlUmVwZWF0qHRvU3RyaW5nwhHAkhITwMDAwJCoX2RlZmF1bHSboWyRpnJlcGVhdMIVwJIWF8DAwMCQ3AAZlgAAAcDCw5YAGAIFwsKWCQADwMLClgsKwMDCwpYTCsAQwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWIw7ADMLClgEZCg3CwpYJAAvAwsKWCwnAwMLClkYJwATCwpYBGA4RwsKWCQAPwMLClgsIwMDCwpYBCMDAwsKWzQH3DxIUwsKWCQbACMLClgQGwMDCwpYCARUYwsKWBgEWwMLClgAIwBPCwpYJCMDAwsKWAQ4XwMLC
====catalogjs annotation end====*/