import { default as baseSortedUniq } from "./dist/131.js";


/**
 * This method is like `_.uniq` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniq([1, 1, 2]);
 * // => [1, 2]
 */

function sortedUniq(array) {
  return array && array.length ? baseSortedUniq(array) : [];
}

const _default = (sortedUniq);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL2Rpc3QvMTMxLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDrmJhc2VTb3J0ZWRVbmlxm6FpkMICwJIDBMAAwKdkZWZhdWx0kKpzb3J0ZWRVbmlxm6Fska5iYXNlU29ydGVkVW5pccIFwJIGB8DAwMCQqF9kZWZhdWx0m6Fskapzb3J0ZWRVbmlxwgnAkgoLwMDAwJCdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsOwMDCwpYrDsDAwsKWzQFNDwYIwsKWCQrABMLClgQKwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/