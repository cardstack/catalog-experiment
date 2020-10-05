import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";



/**
 * Defers invoking the `func` until the current call stack has cleared. Any
 * additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to defer.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) {
 *   console.log(text);
 * }, 'deferred');
 * // => Logs 'deferred' after one millisecond.
 */

var defer = baseRest(function (func, args) {
  return baseDelay(func, 1, args);
});
const _default = (defer);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTYxLmpzAZPCrC4vZGlzdC80OS5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQSwJGTEsDChKliYXNlRGVsYXmboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKVkZWZlcpuhbJKoYmFzZVJlc3SpYmFzZURlbGF5wgoNkgsMwMDAwJKpYmFzZURlbGF5qGJhc2VSZXN0qF9kZWZhdWx0m6FskaVkZWZlcsIPwJIQEcDAwMCQ3AATlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYiCcDAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLCls0B/QEKDsLClgQAC8DCwpYABcANwsKWBAXAwMLClgMTCMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/