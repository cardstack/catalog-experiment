import { default as baseEachRight } from "./dist/78.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseReduce } from "./dist/172.js";
import { default as isArray } from "./isArray.js";

/**
 * A specialized version of `_.reduceRight` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the last element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduceRight(array, iteratee, accumulator, initAccum) {
  var length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[--length];
  }

  while (length--) {
    accumulator = iteratee(accumulator, array[length], length, array);
  }

  return accumulator;
}








/**
 * This method is like `_.reduce` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduce
 * @example
 *
 * var array = [[0, 1], [2, 3], [4, 5]];
 *
 * _.reduceRight(array, function(flattened, other) {
 *   return flattened.concat(other);
 * }, []);
 * // => [4, 5, 2, 3, 0, 1]
 */

function reduceRight(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduceRight : baseReduce,
      initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
}


export { reduceRight as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNzguanMBwsCVwqsuL2Rpc3QvNi5qcwXCwJXCrS4vZGlzdC8xNzIuanMJwsCVwqwuL2lzQXJyYXkuanMNwsCBp2RlZmF1bHSUoWyrcmVkdWNlUmlnaHQXwJGTF8DAhq1iYXNlRWFjaFJpZ2h0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqmJhc2VSZWR1Y2WboWmQwgrAkgsMwALAp2RlZmF1bHSQp2lzQXJyYXmboWmQwg7Akg8QwAPAp2RlZmF1bHSQsGFycmF5UmVkdWNlUmlnaHSboWyQwhHAkhITktlfaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2FycmF5UmVkdWNlUmlnaHQuanOnZGVmYXVsdMDAwJCrcmVkdWNlUmlnaHSboWyVp2lzQXJyYXmwYXJyYXlSZWR1Y2VSaWdodKpiYXNlUmVkdWNlrGJhc2VJdGVyYXRlZa1iYXNlRWFjaFJpZ2h0whTAkhUWwMDAwJDcABiWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClicNwMDCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpZEDMAEwsKWARgKDcLClgkAC8DCwpYLCsDAwsKWAwrACMLClgEXDhHCwpYJAA/AwsKWCwfAwMLCljMHwBPCwpbNAbXNARsSFMLClgkQwMDCwpYPEMAMwsKWzQKEBBUXwsKWCQvAEMLClgkLwMDCwpYDDhbAwsI=
====catalogjs annotation end====*/