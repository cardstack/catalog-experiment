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
const _default = (delay);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTYxLmpzAZPCrC4vZGlzdC80OS5qcwWTwq0uL3RvTnVtYmVyLmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBbAkZMWwMKFqWJhc2VEZWxheZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqHRvTnVtYmVym6FpkMIKwJILDMACwKdkZWZhdWx0kKVkZWxheZuhbJOoYmFzZVJlc3SpYmFzZURlbGF5qHRvTnVtYmVywg4Rkg8QwMDAwJOpYmFzZURlbGF5qGJhc2VSZXN0qHRvTnVtYmVyqF9kZWZhdWx0m6FskaVkZWxhecITwJIUFcDAwMCQ3AAXlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYoCcAMwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClgcIwMDCwpbNAiYBDhLCwpYEAA/AwsKWAAXAEcLClgQFwMDCwpYDFgjAwsKWAQETFsLClgYBFMDCwpYACMAQwsKWCQjAwMLClgEOFcDCwg==
====catalogjs annotation end====*/