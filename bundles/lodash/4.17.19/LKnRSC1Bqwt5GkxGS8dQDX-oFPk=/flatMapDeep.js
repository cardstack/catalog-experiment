import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";



/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0;
/**
 * This method is like `_.flatMap` except that it recursively flattens the
 * mapped results.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 *
 * _.flatMapDeep([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */

function flatMapDeep(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), INFINITY);
}


export { flatMapDeep as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODUuanMBwsCVwqguL21hcC5qcwXCwIGnZGVmYXVsdJShbKtmbGF0TWFwRGVlcBHAkZMRwMCEq2Jhc2VGbGF0dGVum6FpkMICwJIDBMAAwKdkZWZhdWx0kKNtYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQqElORklOSVRZm6FskMIKDZILDMDAwMCQq2ZsYXRNYXBEZWVwm6Fsk6tiYXNlRmxhdHRlbqNtYXCoSU5GSU5JVFnCDsCSDxDAwMDAkNwAEpYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWIgvACMLClgETBgnCwpYJAAfAwsKWCwPAwMLClgEDwAzCwpY/AQoOwsKWBAALwMLClgAIwA3CwpYYCMDAwsKWAwXAwMLCls0B+gQPEcLClgkLwATCwpYJC8DAwsKWAw4QwMLC
====catalogjs annotation end====*/