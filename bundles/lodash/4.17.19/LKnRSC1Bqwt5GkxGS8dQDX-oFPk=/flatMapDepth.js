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


export { flatMapDepth as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvODUuanMBwsCVwqguL21hcC5qcwXCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0lKFsrGZsYXRNYXBEZXB0aBDAkZMQwMCEq2Jhc2VGbGF0dGVum6FpkMICwJIDBMAAwKdkZWZhdWx0kKNtYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCsZmxhdE1hcERlcHRom6Fsk6l0b0ludGVnZXKrYmFzZUZsYXR0ZW6jbWFwwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClhILwAjCwpYBEwYJwsKWCQAHwMLClgsDwMDCwpYBA8DAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWRAnABMLCls0CVCEOEMLClgkMwAzCwpYJDMDAwsKWAw4PwMLC
====catalogjs annotation end====*/