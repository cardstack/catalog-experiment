import { default as baseTimes } from "./dist/134.js";
import { default as castFunction } from "./dist/108.js";
import { default as toInteger } from "./toInteger.js";




/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER = 9007199254740991;
/** Used as references for the maximum length and index of an array. */

var MAX_ARRAY_LENGTH = 4294967295;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMin = Math.min;
/**
 * Invokes the iteratee `n` times, returning an array of the results of
 * each invocation. The iteratee is invoked with one argument; (index).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.times(3, String);
 * // => ['0', '1', '2']
 *
 *  _.times(4, _.constant(0));
 * // => [0, 0, 0, 0]
 */

function times(n, iteratee) {
  n = toInteger(n);

  if (n < 1 || n > MAX_SAFE_INTEGER) {
    return [];
  }

  var index = MAX_ARRAY_LENGTH,
      length = nativeMin(n, MAX_ARRAY_LENGTH);
  iteratee = castFunction(iteratee);
  n -= MAX_ARRAY_LENGTH;
  var result = baseTimes(length, iteratee);

  while (++index < n) {
    iteratee(index);
  }

  return result;
}

const _default = (times);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTM0LmpzAZPCrS4vZGlzdC8xMDguanMFk8KuLi90b0ludGVnZXIuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0I8CRkyPAwoipYmFzZVRpbWVzm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxjYXN0RnVuY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCwTUFYX1NBRkVfSU5URUdFUpuhbJDCDsCSDxDAwMDAkLBNQVhfQVJSQVlfTEVOR1RIm6FskMISwJQTFBUWwMDAwJCpbmF0aXZlTWlum6FskaRNYXRowhgbkhkawMDAwJCldGltZXOboWyWqXRvSW50ZWdlcrBNQVhfU0FGRV9JTlRFR0VSsE1BWF9BUlJBWV9MRU5HVEipbmF0aXZlTWlurGNhc3RGdW5jdGlvbqliYXNlVGltZXPCHMCSHR7AwMDAkKhfZGVmYXVsdJuhbJGldGltZXPCIMCSISLAwMDAkNwAJJYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWEQnAwMLClgEYBgnCwpYJAAfAwsKWCwzAwMLClhAMwBbCwpYBGQoNwsKWCQALwMLClgsJwMDCwpYWCcAQwsKWQAEOEcLClgQTD8DCwpYAEMDAwsKWGRDAFMLClkoBEhfCwpYEDRPAwsKWABDAwMLCliYQwBrCwpYEEMAIwsKWExDABMLCllsBGBzCwpYEABnAwsKWAAnAG8LClhEJwBXCwpYDCMDAwsKWzQIQWR0fwsKWCQXADMLClgQFwMDCwpYCASAjwsKWBgEhwMLClgAIwB7CwpYJCMDAwsKWAQ4iwMLC
====catalogjs annotation end====*/