import { default as baseForRight } from "./dist/159.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";




/**
 * This method is like `_.forIn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forInRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
 */

function forInRight(object, iteratee) {
  return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
}


export { forInRight as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTU5LmpzAcLAlcKtLi9kaXN0LzEwOC5qcwXCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0lKFsqmZvckluUmlnaHQQwJGTEMDAhKxiYXNlRm9yUmlnaHSboWmQwgLAkgMEwADAp2RlZmF1bHSQrGNhc3RGdW5jdGlvbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCma2V5c0lum6FpkMIKwJILDMACwKdkZWZhdWx0kKpmb3JJblJpZ2h0m6Fsk6xiYXNlRm9yUmlnaHSsY2FzdEZ1bmN0aW9upmtleXNJbsINwJIOD8DAwMCQ3AARlgAAAcDCw5YAGAIFwsKWCQADwMLClgsMwMDCwpY4DMAIwsKWARgGCcLClgkAB8DCwpYLDMDAwsKWCQzADMLClgEWCg3CwpYJAAvAwsKWCwbAwMLClgwGwMDCwpbNAn0EDhDCwpYJCsAEwsKWCQrAwMLClgMOD8DCwg==
====catalogjs annotation end====*/