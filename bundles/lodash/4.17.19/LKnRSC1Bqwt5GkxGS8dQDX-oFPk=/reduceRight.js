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
function arrayReduceRight0(array, iteratee, accumulator, initAccum) {
  var length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[--length];
  }

  while (length--) {
    accumulator = iteratee(accumulator, array[length], length, array);
  }

  return accumulator;
}

const arrayReduceRight = (arrayReduceRight0);






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

const _default = (reduceRight);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNzguanMBk8KrLi9kaXN0LzYuanMFk8KtLi9kaXN0LzE3Mi5qcwmTwqwuL2lzQXJyYXkuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0H8CRkx/AwoitYmFzZUVhY2hSaWdodJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKpiYXNlUmVkdWNlm6FpkMIKwJILDMACwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIOwJIPEMADwKdkZWZhdWx0kLFhcnJheVJlZHVjZVJpZ2h0MJuhbJDCEcCSEhPAwMDAkLBhcnJheVJlZHVjZVJpZ2h0m6FskbFhcnJheVJlZHVjZVJpZ2h0MMIVwJIWF8DAwMCQq3JlZHVjZVJpZ2h0m6Fsladpc0FycmF5sGFycmF5UmVkdWNlUmlnaHSqYmFzZVJlZHVjZaxiYXNlSXRlcmF0ZWWtYmFzZUVhY2hSaWdodMIYwJIZGsDAwMCQqF9kZWZhdWx0m6FskatyZWR1Y2VSaWdodMIcwJIdHsDAwMCQ3AAglgAAAcDCw5YAFwIFwsKWCQADwMLClgsNwMDCwpYnDcDAwsKWARYGCcLClgkAB8DCwpYLDMDAwsKWRAzABMLClgEYCg3CwpYJAAvAwsKWCwrAwMLClgMKwAjCwpYBFw4RwsKWCQAPwMLClgsHwMDCwpYzB8AXwsKWzQG1zQEbEhTCwpYJEcDAwsKWBBHAwMLClgIBFRjCwpYGARbAwsKWABDAE8LClg8QwAzCwpbNAoIEGRvCwpYJC8AQwsKWBAvAwMLClgIBHB/CwpYGAR3AwsKWAAjAGsLClgkIwMDCwpYBDh7AwsI=
====catalogjs annotation end====*/