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


export { sortedLastIndexOf as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvMzAuanMBwsCVwqcuL2VxLmpzBcLAgadkZWZhdWx0lKFssXNvcnRlZExhc3RJbmRleE9mDMCRkwzAwIOvYmFzZVNvcnRlZEluZGV4m6FpkMICwJIDBMAAwKdkZWZhdWx0kKJlcZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCxc29ydGVkTGFzdEluZGV4T2aboWySr2Jhc2VTb3J0ZWRJbmRleKJlccIJwJIKC8DAwMCQnZYAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWYw/ACMLClgESBgnCwpYJAAfAwsKWCwLAwMLCliMCwMDCwpbNAZ1GCgzCwpYJEcAEwsKWCRHAwMLClgMOC8DCwg==
====catalogjs annotation end====*/