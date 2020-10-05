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

const _default = (sortedUniqBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwq0uL2Rpc3QvMTMxLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKErGJhc2VJdGVyYXRlZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCuYmFzZVNvcnRlZFVuaXGboWmQwgbAkgcIwAHAp2RlZmF1bHSQrHNvcnRlZFVuaXFCeZuhbJKuYmFzZVNvcnRlZFVuaXGsYmFzZUl0ZXJhdGVlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRrHNvcnRlZFVuaXFCecINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFgIFwsKWCQADwMLClgsMwMDCwpYIDMDAwsKWARgGCcLClgkAB8DCwpYLDsDAwsKWNQ7ABMLCls0BrxYKDMLClgkMwAjCwpYEDMDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/