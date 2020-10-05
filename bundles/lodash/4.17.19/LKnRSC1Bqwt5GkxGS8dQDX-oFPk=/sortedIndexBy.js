import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";



/**
 * This method is like `_.sortedIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
 * // => 0
 */

function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2));
}

const _default = (sortedIndexBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwqwuL2Rpc3QvMzEuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kLFiYXNlU29ydGVkSW5kZXhCeZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCtc29ydGVkSW5kZXhCeZuhbJKxYmFzZVNvcnRlZEluZGV4QnmsYmFzZUl0ZXJhdGVlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRrXNvcnRlZEluZGV4QnnCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABYCBcLClgkAA8DCwpYLDMDAwsKWDwzAwMLClgEXBgnCwpYJAAfAwsKWCxHAwMLCliQRwATCwpbNAycRCgzCwpYJDcAIwsKWBA3AwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/