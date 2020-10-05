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

const _default = (sortedIndex);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMzAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOvYmFzZVNvcnRlZEluZGV4m6FpkMICwJIDBMAAwKdkZWZhdWx0kKtzb3J0ZWRJbmRleJuhbJGvYmFzZVNvcnRlZEluZGV4wgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRq3NvcnRlZEluZGV4wgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsPwMDCwpYaD8DAwsKWzQHSEQYIwsKWCQvABMLClgQLwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/