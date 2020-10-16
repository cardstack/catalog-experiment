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


export { sortedUniq as default };
/*====catalogjs annotation start====
lZGVwq0uL2Rpc3QvMTMxLmpzAcLAgadkZWZhdWx0lKFsqnNvcnRlZFVuaXEIwJGTCMDAgq5iYXNlU29ydGVkVW5pcZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqc29ydGVkVW5pcZuhbJGuYmFzZVNvcnRlZFVuaXHCBcCSBgfAwMDAkJmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCw7AwMLClisOwMDCwpbNAU0PBgjCwpYJCsAEwsKWCQrAwMLClgMOB8DCwg==
====catalogjs annotation end====*/