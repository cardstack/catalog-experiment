import { default as baseSortedIndex } from "./dist/30.js";
import { default as eq } from "./eq.js";



/**
 * This method is like `_.lastIndexOf` except that it performs a binary
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
 * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
 * // => 3
 */

function sortedLastIndexOf(array, value) {
  var length = array == null ? 0 : array.length;

  if (length) {
    var index = baseSortedIndex(array, value, true) - 1;

    if (eq(array[index], value)) {
      return index;
    }
  }

  return -1;
}

const _default = (sortedLastIndexOf);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvMzAuanMBk8KnLi9lcS5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChK9iYXNlU29ydGVkSW5kZXiboWmQwgLAkgMEwADAp2RlZmF1bHSQomVxm6FpkMIGwJIHCMABwKdkZWZhdWx0kLFzb3J0ZWRMYXN0SW5kZXhPZpuhbJKvYmFzZVNvcnRlZEluZGV4omVxwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRsXNvcnRlZExhc3RJbmRleE9mwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw/AwMLClmMPwAjCwpYBEgYJwsKWCQAHwMLClgsCwMDCwpYjAsDAwsKWzQGdRgoMwsKWCRHABMLClgQRwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/