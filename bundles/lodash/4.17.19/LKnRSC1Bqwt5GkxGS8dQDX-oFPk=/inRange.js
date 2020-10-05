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

function baseInRange0(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}

const baseInRange = (baseInRange0);




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

const _default = (inRange);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL3RvRmluaXRlLmpzAZPCrS4vdG9OdW1iZXIuanMGgadkZWZhdWx0lKFsqF9kZWZhdWx0IcCRkyHAwoiodG9GaW5pdGWboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKh0b051bWJlcpuhaZDCB8CSCAnAAcCnZGVmYXVsdJCpbmF0aXZlTWF4m6FskaRNYXRowgsOkgwNwMDAwJCpbmF0aXZlTWlum6FskaRNYXRowg8SkhARwMDAwJCsYmFzZUluUmFuZ2Uwm6FskqluYXRpdmVNaW6pbmF0aXZlTWF4whPAkhQVwMDAwJCrYmFzZUluUmFuZ2WboWyRrGJhc2VJblJhbmdlMMIXwJIYGcDAwMCQp2luUmFuZ2WboWyTqHRvRmluaXRlqHRvTnVtYmVyq2Jhc2VJblJhbmdlwhrAkhscwMDAwJCoX2RlZmF1bHSboWyRp2luUmFuZ2XCHsCSHyDAwMDAkNwAIpYAAAHAwsOWABgCBsLClgkAA8DCwpYLCMDAwsKWIQjABcLClloIwAnCwpYBGAcKwsKWCQAIwMLClgsIwMDCwpYXCMAZwsKWWwELE8LClgQADA/CwpYACcAOwsKWGQnAwMLClgMIwMDCwpYGABDAwsKWAAnAEsLClioJwA3CwpYDCMDAwsKWzQFADxQWwsKWCQzAEcLClgQMwMDCwpYCARcawsKWBgEYwMLClgALwBXCwpYTC8DAwsKWzQNgFxsdwsKWCQfABMLClgQHwMDCwpYCAR4hwsKWBgEfwMLClgAIwBzCwpYJCMDAwsKWAQ4gwMLC
====catalogjs annotation end====*/