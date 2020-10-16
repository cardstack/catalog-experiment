import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedUniq } from "./dist/131.js";



/**
 * This method is like `_.uniqBy` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
 * // => [1.1, 2.3]
 */

function sortedUniqBy(array, iteratee) {
  return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee, 2)) : [];
}


export { sortedUniqBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrS4vZGlzdC8xMzEuanMFwsCBp2RlZmF1bHSUoWysc29ydGVkVW5pcUJ5DMCRkwzAwIOsYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kK5iYXNlU29ydGVkVW5pcZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsc29ydGVkVW5pcUJ5m6Fskq5iYXNlU29ydGVkVW5pcaxiYXNlSXRlcmF0ZWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBGAYJwsKWCQAHwMLClgsOwMDCwpY1DsAEwsKWzQGvFgoMwsKWCQzACMLClgkMwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/