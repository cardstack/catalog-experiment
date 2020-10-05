import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
import { default as toInteger } from "./toInteger.js";




/**
 * This method is like `_.flatMap` except that it recursively flattens the
 * mapped results up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 *
 * _.flatMapDepth([1, 2], duplicate, 2);
 * // => [[1, 1], [2, 2]]
 */

function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}

const _default = (flatMapDepth);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvODUuanMBk8KoLi9tYXAuanMFk8KuLi90b0ludGVnZXIuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQo21hcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIKwJILDMACwKdkZWZhdWx0kKxmbGF0TWFwRGVwdGiboWyTqXRvSW50ZWdlcqtiYXNlRmxhdHRlbqNtYXDCDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGsZmxhdE1hcERlcHRowhHAkhITwMDAwJDcABWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClhILwAjCwpYBEwYJwsKWCQAHwMLClgsDwMDCwpYBA8DAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWRAnABMLCls0CVCEOEMLClgkMwAzCwpYEDMDAwsKWAgERFMLClgYBEsDCwpYACMAPwsKWCQjAwMLClgEOE8DCwg==
====catalogjs annotation end====*/