import { default as baseSortedIndex } from "./dist/30.js";


/**
 * Uses a binary search to determine the lowest index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([30, 50], 40);
 * // => 1
 */

function sortedIndex(array, value) {
  return baseSortedIndex(array, value);
}


export { sortedIndex as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMzAuanMBwsCBp2RlZmF1bHSUoWyrc29ydGVkSW5kZXgIwJGTCMDAgq9iYXNlU29ydGVkSW5kZXiboWmQwgLAkgMEwADAp2RlZmF1bHSQq3NvcnRlZEluZGV4m6Fska9iYXNlU29ydGVkSW5kZXjCBcCSBgfAwMDAkJmWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw/AwMLClhoPwMDCwpbNAdIRBgjCwpYJC8AEwsKWCQvAwMLClgMOB8DCwg==
====catalogjs annotation end====*/