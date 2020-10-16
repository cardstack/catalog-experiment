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


export { sortedIndexBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrC4vZGlzdC8zMS5qcwXCwIGnZGVmYXVsdJShbK1zb3J0ZWRJbmRleEJ5DMCRkwzAwIOsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kLFiYXNlU29ydGVkSW5kZXhCeZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCtc29ydGVkSW5kZXhCeZuhbJKxYmFzZVNvcnRlZEluZGV4QnmsYmFzZUl0ZXJhdGVlwgnAkgoLwMDAwJCdlgAAAcDCw5YAFgIFwsKWCQADwMLClgsMwMDCwpYPDMDAwsKWARcGCcLClgkAB8DCwpYLEcDAwsKWJBHABMLCls0DJxEKDMLClgkNwAjCwpYJDcDAwsKWAw4LwMLC
====catalogjs annotation end====*/