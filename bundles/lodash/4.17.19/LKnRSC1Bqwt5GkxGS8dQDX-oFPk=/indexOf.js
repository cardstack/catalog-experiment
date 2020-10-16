import { default as baseIndexOf } from "./dist/123.js";
import { default as toInteger } from "./toInteger.js";



/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max;
/**
 * Gets the index at which the first occurrence of `value` is found in `array`
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the
 * offset from the end of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.indexOf([1, 2, 1, 2], 2);
 * // => 1
 *
 * // Search from the `fromIndex`.
 * _.indexOf([1, 2, 1, 2], 2, 2);
 * // => 3
 */

function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = fromIndex == null ? 0 : toInteger(fromIndex);

  if (index < 0) {
    index = nativeMax(length + index, 0);
  }

  return baseIndexOf(array, value, index);
}


export { indexOf as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTIzLmpzAcLAlcKuLi90b0ludGVnZXIuanMFwsCBp2RlZmF1bHSUoWynaW5kZXhPZhHAkZMRwMCEq2Jhc2VJbmRleE9mm6FpkMICwJIDBMAAwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqW5hdGl2ZU1heJuhbJGkTWF0aMIKDZILDMDAwMCQp2luZGV4T2aboWyTqXRvSW50ZWdlcqluYXRpdmVNYXirYmFzZUluZGV4T2bCDsCSDxDAwMDAkNwAEpYAAAHAwsOWABgCBcLClgkAA8DCwpYLC8DAwsKWIwvAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClsyZCcAMwsKWXgEKDsLClgQAC8DCwpYACcANwsKWLQnABMLClgMIwMDCwpbNAsoYDxHCwpYJB8AIwsKWCQfAwMLClgMOEMDCwg==
====catalogjs annotation end====*/