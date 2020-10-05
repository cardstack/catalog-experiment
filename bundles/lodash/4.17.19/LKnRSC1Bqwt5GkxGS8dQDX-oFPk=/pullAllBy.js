import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAll } from "./dist/97.js";



/**
 * This method is like `_.pullAll` except that it accepts `iteratee` which is
 * invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The iteratee is invoked with one argument: (value).
 *
 * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 *
 * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
 * console.log(array);
 * // => [{ 'x': 2 }]
 */

function pullAllBy(array, values, iteratee) {
  return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee, 2)) : array;
}

const _default = (pullAllBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwqwuL2Rpc3QvOTcuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKtiYXNlUHVsbEFsbJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpcHVsbEFsbEJ5m6FskqtiYXNlUHVsbEFsbKxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGpcHVsbEFsbEJ5wg3Akg4PwMDAwJDcABGWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClhAMwMDCwpYBFwYJwsKWCQAHwMLClgsLwMDCwpZYC8AEwsKWzQMFGQoMwsKWCQnACMLClgQJwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/