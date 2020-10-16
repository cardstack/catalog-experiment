import { default as baseMean } from "./dist/167.js";
import { default as identity } from "./identity.js";



/**
 * Computes the mean of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the mean.
 * @example
 *
 * _.mean([4, 2, 8, 6]);
 * // => 5
 */

function mean(array) {
  return baseMean(array, identity);
}


export { mean as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTY3LmpzAcLAlcKtLi9pZGVudGl0eS5qcwXCwIGnZGVmYXVsdJShbKRtZWFuDMCRkwzAwIOoYmFzZU1lYW6boWmQwgLAkgMEwADAp2RlZmF1bHSQqGlkZW50aXR5m6FpkMIGwJIHCMABwKdkZWZhdWx0kKRtZWFum6FskqhiYXNlTWVhbqhpZGVudGl0ecIJwJIKC8DAwMCQnZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCMDAwsKWEwjACMLClgEYBgnCwpYJAAfAwsKWCwjAwMLClggIwMDCwpbNAQgECgzCwpYJBMAEwsKWCQTAwMLClgMOC8DCwg==
====catalogjs annotation end====*/