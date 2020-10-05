import { default as baseIteratee } from "./dist/6.js";
import { default as baseUniq } from "./dist/63.js";



/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The order of result values is determined by the
 * order they occur in the array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */

function uniqBy(array, iteratee) {
  return array && array.length ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
}

const _default = (uniqBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwqwuL2Rpc3QvNjMuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlVW5pcZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmdW5pcUJ5m6FskqhiYXNlVW5pcaxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGmdW5pcUJ5wg3Akg4PwMDAwJDcABGWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpY1CMAEwsKWzQMQFgoMwsKWCQbACMLClgQGwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/