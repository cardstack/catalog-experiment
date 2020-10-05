import { default as baseNth } from "./dist/127.js";
import { default as toInteger } from "./toInteger.js";



/**
 * Gets the element at index `n` of `array`. If `n` is negative, the nth
 * element from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.11.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=0] The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 *
 * _.nth(array, 1);
 * // => 'b'
 *
 * _.nth(array, -2);
 * // => 'c';
 */

function nth(array, n) {
  return array && array.length ? baseNth(array, toInteger(n)) : undefined;
}

const _default = (nth);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTI3LmpzAZPCri4vdG9JbnRlZ2VyLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEp2Jhc2VOdGiboWmQwgLAkgMEwADAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCjbnRom6FskqdiYXNlTnRoqXRvSW50ZWdlcsIJwJIKC8DAwMCQqF9kZWZhdWx0m6FskaNudGjCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABgCBcLClgkAA8DCwpYLB8DAwsKWLgfACMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClggJwMDCwpbNAdcTCgzCwpYJA8AEwsKWBAPAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/