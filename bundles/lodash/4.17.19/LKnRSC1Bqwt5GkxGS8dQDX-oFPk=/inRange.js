import { default as toFinite } from "./toFinite.js";
import { default as toNumber } from "./toNumber.js";

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * The base implementation of `_.inRange` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */

function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}






/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */

function inRange(number, start, end) {
  start = toFinite(start);

  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }

  number = toNumber(number);
  return baseInRange(number, start, end);
}


export { inRange as default };
/*====catalogjs annotation start====
lZKVwq0uL3RvRmluaXRlLmpzAcLAlcKtLi90b051bWJlci5qcwbCwIGnZGVmYXVsdJShbKdpblJhbmdlGcCRkxnAwIaodG9GaW5pdGWboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKh0b051bWJlcpuhaZDCB8CSCAnAAcCnZGVmYXVsdJCpbmF0aXZlTWF4m6FskaRNYXRowgsOkgwNwMDAwJCpbmF0aXZlTWlum6FskaRNYXRowg8SkhARwMDAwJCrYmFzZUluUmFuZ2WboWySqW5hdGl2ZU1pbqluYXRpdmVNYXjCE8CSFBWS2VpodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUluUmFuZ2UuanOnZGVmYXVsdMDAwJCnaW5SYW5nZZuhbJOodG9GaW5pdGWodG9OdW1iZXKrYmFzZUluUmFuZ2XCFsCSFxjAwMDAkNwAGpYAAAHAwsOWABgCBsLClgkAA8DCwpYLCMDAwsKWIQjABcLClloIwAnCwpYBGAcKwsKWCQAIwMLClgsIwMDCwpYXCMAVwsKWWwELE8LClgQADA/CwpYACcAOwsKWGQnAwMLClgMIwMDCwpYGABDAwsKWAAnAEsLClioJwA3CwpYDCMDAwsKWzQFADxQWwsKWCQvAEcLClhMLwMDCwpbNA2IXFxnCwpYJB8AEwsKWCQfAwMLClgMOGMDCwg==
====catalogjs annotation end====*/