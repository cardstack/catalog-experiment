import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as identity } from "./identity.js";




/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */

function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}


export { max as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvMjguanMBwsCVwq0uL2Rpc3QvMTY1LmpzBcLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKNtYXgQwJGTEMDAhKxiYXNlRXh0cmVtdW2boWmQwgLAkgMEwADAp2RlZmF1bHSQpmJhc2VHdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoaWRlbnRpdHmboWmQwgrAkgsMwALAp2RlZmF1bHSQo21heJuhbJOsYmFzZUV4dHJlbXVtqGlkZW50aXR5pmJhc2VHdMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYrDMAMwsKWARgGCcLClgkAB8DCwpYLBsDAwsKWAgbAwMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClggIwAjCwpbNAWYQDhDCwpYJA8AEwsKWCQPAwMLClgMOD8DCwg==
====catalogjs annotation end====*/