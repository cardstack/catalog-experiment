import { default as baseSortedIndex } from "./dist/30.js";


/**
 * This method is like `_.sortedIndex` except that it returns the highest
 * index at which `value` should be inserted into `array` in order to
 * maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
 * // => 4
 */

function sortedLastIndex(array, value) {
  return baseSortedIndex(array, value, true);
}

const _default = (sortedLastIndex);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMzAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOvYmFzZVNvcnRlZEluZGV4m6FpkMICwJIDBMAAwKdkZWZhdWx0kK9zb3J0ZWRMYXN0SW5kZXiboWyRr2Jhc2VTb3J0ZWRJbmRleMIFwJIGB8DAwMCQqF9kZWZhdWx0m6Fska9zb3J0ZWRMYXN0SW5kZXjCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCw/AwMLClhoPwMDCwpbNAfkXBgjCwpYJD8AEwsKWBA/AwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/