import { default as baseUniq } from "./dist/63.js";


/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */

function uniq(array) {
  return array && array.length ? baseUniq(array) : [];
}


export { uniq as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvNjMuanMBwsCBp2RlZmF1bHSUoWykdW5pcQjAkZMIwMCCqGJhc2VVbmlxm6FpkMICwJIDBMAAwKdkZWZhdWx0kKR1bmlxm6FskahiYXNlVW5pccIFwJIGB8DAwMCQmZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWKwjAwMLCls0CIg8GCMLClgkEwATCwpYJBMDAwsKWAw4HwMLC
====catalogjs annotation end====*/