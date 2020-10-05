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

function baseFill0(array, value, start, end) {
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

const baseFill = (baseFill0);



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

const _default = (fill);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq4uL3RvSW50ZWdlci5qcwGTwq0uL3RvTGVuZ3RoLmpzBpPCrC4vZGlzdC83MC5qcwqBp2RlZmF1bHSUoWyoX2RlZmF1bHQcwJGTHMDCh6l0b0ludGVnZXKboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKh0b0xlbmd0aJuhaZDCB8CSCAnAAcCnZGVmYXVsdJCuaXNJdGVyYXRlZUNhbGyboWmQwgvAkgwNwALAp2RlZmF1bHSQqWJhc2VGaWxsMJuhbJKpdG9JbnRlZ2VyqHRvTGVuZ3Rowg7Akg8QwMDAwJCoYmFzZUZpbGyboWyRqWJhc2VGaWxsMMISwJITFMDAwMCQpGZpbGyboWySrmlzSXRlcmF0ZWVDYWxsqGJhc2VGaWxswhXAkhYXwMDAwJCoX2RlZmF1bHSboWyRpGZpbGzCGcCSGhvAwMDAkNwAHZYAAAHAwsOWABkCBsLClgkAA8DCwpYLCcDAwsKWRAnABcLClsyJCcAJwsKWARgHCsLClgkACMDCwpYLCMDAwsKWSwjAwMLClgEXCw7CwpYJAAzAwsKWCw7AwMLClsyfDsAUwsKWzQFQUg8RwsKWCQnABMLClgQJwMDCwpYCARIVwsKWBgETwMLClgAIwBDCwpZICMDAwsKWzQKmHRYYwsKWCQTADcLClgQEwMDCwpYCARkcwsKWBgEawMLClgAIwBfCwpYJCMDAwsKWAQ4bwMLC
====catalogjs annotation end====*/