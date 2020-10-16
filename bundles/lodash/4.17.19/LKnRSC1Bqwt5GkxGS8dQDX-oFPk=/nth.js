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


export { nth as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTI3LmpzAcLAlcKuLi90b0ludGVnZXIuanMFwsCBp2RlZmF1bHSUoWyjbnRoDMCRkwzAwIOnYmFzZU50aJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIGwJIHCMABwKdkZWZhdWx0kKNudGiboWySp2Jhc2VOdGipdG9JbnRlZ2VywgnAkgoLwMDAwJCdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsHwMDCwpYuB8AIwsKWARkGCcLClgkAB8DCwpYLCcDAwsKWCAnAwMLCls0B1xMKDMLClgkDwATCwpYJA8DAwsKWAw4LwMLC
====catalogjs annotation end====*/