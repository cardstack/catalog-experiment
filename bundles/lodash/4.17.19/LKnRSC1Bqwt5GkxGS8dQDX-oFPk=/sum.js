import { default as baseSum } from "./dist/168.js";
import { default as identity } from "./identity.js";



/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */

function sum(array) {
  return array && array.length ? baseSum(array, identity) : 0;
}

const _default = (sum);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTY4LmpzAZPCrS4vaWRlbnRpdHkuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSnYmFzZVN1bZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoaWRlbnRpdHmboWmQwgbAkgcIwAHAp2RlZmF1bHSQo3N1bZuhbJKnYmFzZVN1bahpZGVudGl0ecIJwJIKC8DAwMCQqF9kZWZhdWx0m6FskaNzdW3CDcCSDg/AwMDAkNwAEZYAAAHAwsOWABgCBcLClgkAA8DCwpYLB8DAwsKWKwfACMLClgEYBgnCwpYJAAfAwsKWCwjAwMLClggIwMDCwpbNAQYICgzCwpYJA8AEwsKWBAPAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/