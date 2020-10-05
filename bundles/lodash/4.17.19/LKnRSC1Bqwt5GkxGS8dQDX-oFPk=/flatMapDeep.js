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

const _default = (flatMapDeep);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODUuanMBk8KoLi9tYXAuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FcCRkxXAwoWrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQo21hcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoSU5GSU5JVFmboWyQwgoNkgsMwMDAwJCrZmxhdE1hcERlZXCboWyTq2Jhc2VGbGF0dGVuo21hcKhJTkZJTklUWcIOwJIPEMDAwMCQqF9kZWZhdWx0m6FskatmbGF0TWFwRGVlcMISwJITFMDAwMCQ3AAWlgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYiC8AIwsKWARMGCcLClgkAB8DCwpYLA8DAwsKWAQPADMLClj8BCg7CwpYEAAvAwsKWAAjADcLClhgIwMDCwpYDBcDAwsKWzQH6BA8RwsKWCQvABMLClgQLwMDCwpYCARIVwsKWBgETwMLClgAIwBDCwpYJCMDAwsKWAQ4UwMLC
====catalogjs annotation end====*/