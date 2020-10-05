import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";



/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */

function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

const _default = (flatMap);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODUuanMBk8KoLi9tYXAuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQo21hcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCnZmxhdE1hcJuhbJKrYmFzZUZsYXR0ZW6jbWFwwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRp2ZsYXRNYXDCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWIgvACMLClgETBgnCwpYJAAfAwsKWCwPAwMLClgEDwMDCwpbNAm0dCgzCwpYJB8AEwsKWBAfAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/