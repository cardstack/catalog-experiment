import { default as createWrap } from "./dist/23.js";
import { default as flatRest } from "./dist/50.js";



/** Used to compose bitmasks for function metadata. */

var WRAP_REARG_FLAG = 256;
/**
 * Creates a function that invokes `func` with arguments arranged according
 * to the specified `indexes` where the argument value at the first index is
 * provided as the first argument, the argument value at the second index is
 * provided as the second argument, and so on.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to rearrange arguments for.
 * @param {...(number|number[])} indexes The arranged argument indexes.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var rearged = _.rearg(function(a, b, c) {
 *   return [a, b, c];
 * }, [2, 0, 1]);
 *
 * rearged('b', 'c', 'a')
 * // => ['a', 'b', 'c']
 */

var rearg = flatRest(function (func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});
const _default = (rearg);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvMjMuanMBk8KsLi9kaXN0LzUwLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBbAkZMWwMKFqmNyZWF0ZVdyYXCboWmQwgLAkgMEwADAp2RlZmF1bHSQqGZsYXRSZXN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kK9XUkFQX1JFQVJHX0ZMQUeboWyQwgrAkgsMwMDAwJClcmVhcmeboWyTqGZsYXRSZXN0qmNyZWF0ZVdyYXCvV1JBUF9SRUFSR19GTEFHwg4Rkg8QwMDAwJOqY3JlYXRlV3JhcKhmbGF0UmVzdK9XUkFQX1JFQVJHX0ZMQUeoX2RlZmF1bHSboWyRpXJlYXJnwhPAkhQVwMDAwJDcABeWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLCliUKwAzCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYACMAEwsKWPAEKDcLClgQGC8DCwpYAD8DAwsKWBw/AwMLCls0CuQEOEsLClgQAD8DCwpYABcARwsKWBAXAwMLClgMvCMDCwpYBARMWwsKWBgEUwMLClgAIwBDCwpYJCMDAwsKWAQ4VwMLC
====catalogjs annotation end====*/