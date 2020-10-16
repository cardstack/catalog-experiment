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

export { defer as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTYxLmpzAcLAlcKsLi9kaXN0LzQ5LmpzBcLAgadkZWZhdWx0lKFspWRlZmVyDsCRkw7AwIOpYmFzZURlbGF5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJClZGVmZXKboWySqGJhc2VSZXN0qWJhc2VEZWxhecIKDZILDMDAwMCSqWJhc2VEZWxheahiYXNlUmVzdJ+WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLCliIJwMDCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYACMAEwsKWzQH9AQoOwsKWBAALwMLClgAFwA3CwpYJBcDAwsKWAxMIwMLClgIODMDCwg==
====catalogjs annotation end====*/