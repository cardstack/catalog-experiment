import { default as baseIteratee } from "./dist/6.js";
import { default as baseMean } from "./dist/167.js";



/**
 * This method is like `_.mean` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be averaged.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the mean.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.meanBy(objects, function(o) { return o.n; });
 * // => 5
 *
 * // The `_.property` iteratee shorthand.
 * _.meanBy(objects, 'n');
 * // => 5
 */

function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee, 2));
}


export { meanBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrS4vZGlzdC8xNjcuanMFwsCBp2RlZmF1bHSUoWymbWVhbkJ5DMCRkwzAwIOsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlTWVhbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmbWVhbkJ5m6FskqhiYXNlTWVhbqxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYdCMAEwsKWzQKpEQoMwsKWCQbACMLClgkGwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/