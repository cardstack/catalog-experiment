import { default as apply } from "./dist/111.js";
import { default as baseRest } from "./dist/49.js";
import { default as isError } from "./isError.js";




/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */

var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});
const _default = (attempt);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTExLmpzAZPCrC4vZGlzdC80OS5qcwWTwqwuL2lzRXJyb3IuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0FsCRkxbAwoWlYXBwbHmboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKdpc0Vycm9ym6FpkMIKwJILDMACwKdkZWZhdWx0kKdhdHRlbXB0m6Fsk6hiYXNlUmVzdKVhcHBseadpc0Vycm9ywg4Rkg8QwMDAwJOlYXBwbHmoYmFzZVJlc3SnaXNFcnJvcqhfZGVmYXVsdJuhbJGnYXR0ZW1wdMITwJIUFcDAwMCQ3AAXlgAAAcDCw5YAGAIFwsKWCQADwMLClgsFwMDCwpYsBcAMwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLClgEXCg3CwpYJAAvAwsKWCwfAwMLCljQHwMDCwpbNAoABDhLCwpYEAA/AwsKWAAfAEcLClgQHwMDCwpYDHgjAwsKWAQETFsLClgYBFMDCwpYACMAQwsKWCQjAwMLClgEOFcDCwg==
====catalogjs annotation end====*/