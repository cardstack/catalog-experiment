import { default as baseSortedIndex } from "./dist/30.js";
import { default as eq } from "./eq.js";



/**
 * This method is like `_.indexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
 * // => 1
 */

function sortedIndexOf(array, value) {
  var length = array == null ? 0 : array.length;

  if (length) {
    var index = baseSortedIndex(array, value);

    if (index < length && eq(array[index], value)) {
      return index;
    }
  }

  return -1;
}

const _default = (sortedIndexOf);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvMzAuanMBk8KnLi9lcS5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChK9iYXNlU29ydGVkSW5kZXiboWmQwgLAkgMEwADAp2RlZmF1bHSQomVxm6FpkMIGwJIHCMABwKdkZWZhdWx0kK1zb3J0ZWRJbmRleE9mm6Fskq9iYXNlU29ydGVkSW5kZXiiZXHCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGtc29ydGVkSW5kZXhPZsINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsPwMDCwpZjD8AIwsKWARIGCcLClgkAB8DCwpYLAsDAwsKWKwLAwMLCls0BlUYKDMLClgkNwATCwpYEDcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/