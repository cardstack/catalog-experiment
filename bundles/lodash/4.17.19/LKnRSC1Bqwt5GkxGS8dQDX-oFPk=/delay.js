import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";
import { default as toNumber } from "./toNumber.js";




/**
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) {
 *   console.log(text);
 * }, 1000, 'later');
 * // => Logs 'later' after one second.
 */

var delay = baseRest(function (func, wait, args) {
  return baseDelay(func, toNumber(wait) || 0, args);
});

export { delay as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTYxLmpzAcLAlcKsLi9kaXN0LzQ5LmpzBcLAlcKtLi90b051bWJlci5qcwnCwIGnZGVmYXVsdJShbKVkZWxheRLAkZMSwMCEqWJhc2VEZWxheZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqHRvTnVtYmVym6FpkMIKwJILDMACwKdkZWZhdWx0kKVkZWxheZuhbJOoYmFzZVJlc3SpYmFzZURlbGF5qHRvTnVtYmVywg4Rkg8QwMDAwJOpYmFzZURlbGF5qGJhc2VSZXN0qHRvTnVtYmVy3AATlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYoCcAMwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClgcIwMDCwpbNAiYBDhLCwpYEAA/AwsKWAAXAEcLClgkFwMDCwpYDFgjAwsKWAg4QwMLC
====catalogjs annotation end====*/