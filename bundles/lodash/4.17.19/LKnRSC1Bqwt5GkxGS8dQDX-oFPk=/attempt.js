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

export { attempt as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTExLmpzAcLAlcKsLi9kaXN0LzQ5LmpzBcLAlcKsLi9pc0Vycm9yLmpzCcLAgadkZWZhdWx0lKFsp2F0dGVtcHQSwJGTEsDAhKVhcHBseZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQp2lzRXJyb3KboWmQwgrAkgsMwALAp2RlZmF1bHSQp2F0dGVtcHSboWyTqGJhc2VSZXN0pWFwcGx5p2lzRXJyb3LCDhGSDxDAwMDAk6VhcHBseahiYXNlUmVzdKdpc0Vycm9y3AATlgAAAcDCw5YAGAIFwsKWCQADwMLClgsFwMDCwpYsBcAMwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLClgEXCg3CwpYJAAvAwsKWCwfAwMLCljQHwMDCwpbNAoABDhLCwpYEAA/AwsKWAAfAEcLClgkHwMDCwpYDHgjAwsKWAg4QwMLC
====catalogjs annotation end====*/