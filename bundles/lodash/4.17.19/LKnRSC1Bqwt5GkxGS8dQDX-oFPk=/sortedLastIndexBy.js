import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";



/**
 * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
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
 * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 1
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
 * // => 1
 */

function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2), true);
}


export { sortedLastIndexBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrC4vZGlzdC8zMS5qcwXCwIGnZGVmYXVsdJShbLFzb3J0ZWRMYXN0SW5kZXhCeQzAkZMMwMCDrGJhc2VJdGVyYXRlZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCxYmFzZVNvcnRlZEluZGV4QnmboWmQwgbAkgcIwAHAp2RlZmF1bHSQsXNvcnRlZExhc3RJbmRleEJ5m6FskrFiYXNlU29ydGVkSW5kZXhCeaxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClg8MwMDCwpYBFwYJwsKWCQAHwMLClgsRwMDCwpYkEcAEwsKWzQMzFwoMwsKWCRHACMLClgkRwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/