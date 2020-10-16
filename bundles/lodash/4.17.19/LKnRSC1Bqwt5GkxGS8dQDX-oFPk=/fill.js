import { default as toInteger } from "./toInteger.js";
import { default as toLength } from "./toLength.js";
import { default as isIterateeCall } from "./dist/70.js";



/**
 * The base implementation of `_.fill` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 */

function baseFill(array, value, start, end) {
  var length = array.length;
  start = toInteger(start);

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }

  end = end === undefined || end > length ? length : toInteger(end);

  if (end < 0) {
    end += length;
  }

  end = start > end ? 0 : toLength(end);

  while (start < end) {
    array[start++] = value;
  }

  return array;
}





/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */

function fill(array, value, start, end) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }

  return baseFill(array, value, start, end);
}


export { fill as default };
/*====catalogjs annotation start====
lZOVwq4uL3RvSW50ZWdlci5qcwHCwJXCrS4vdG9MZW5ndGguanMGwsCVwqwuL2Rpc3QvNzAuanMKwsCBp2RlZmF1bHSUoWykZmlsbBTAkZMUwMCFqXRvSW50ZWdlcpuhaZDCAsCTAwQFwADAp2RlZmF1bHSQqHRvTGVuZ3Rom6FpkMIHwJIICcABwKdkZWZhdWx0kK5pc0l0ZXJhdGVlQ2FsbJuhaZDCC8CSDA3AAsCnZGVmYXVsdJCoYmFzZUZpbGyboWySqXRvSW50ZWdlcqh0b0xlbmd0aMIOwJIPEJLZV2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlRmlsbC5qc6dkZWZhdWx0wMDAkKRmaWxsm6Fskq5pc0l0ZXJhdGVlQ2FsbKhiYXNlRmlsbMIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAGQIGwsKWCQADwMLClgsJwMDCwpZECcAFwsKWzIkJwAnCwpYBGAcKwsKWCQAIwMLClgsIwMDCwpZLCMDAwsKWARcLDsLClgkADMDCwpYLDsDAwsKWzJ8OwBDCwpbNAVBSDxHCwpYJCMAEwsKWSAjAwMLCls0CqB0SFMLClgkEwA3CwpYJBMDAwsKWAw4TwMLC
====catalogjs annotation end====*/