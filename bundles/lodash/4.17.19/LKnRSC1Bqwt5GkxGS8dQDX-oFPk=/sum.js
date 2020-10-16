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


export { sum as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTY4LmpzAcLAlcKtLi9pZGVudGl0eS5qcwXCwIGnZGVmYXVsdJShbKNzdW0MwJGTDMDAg6diYXNlU3Vtm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhpZGVudGl0eZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCjc3Vtm6FskqdiYXNlU3VtqGlkZW50aXR5wgnAkgoLwMDAwJCdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsHwMDCwpYrB8AIwsKWARgGCcLClgkAB8DCwpYLCMDAwsKWCAjAwMLCls0BBggKDMLClgkDwATCwpYJA8DAwsKWAw4LwMLC
====catalogjs annotation end====*/