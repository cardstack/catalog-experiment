import { default as baseExtremum } from "./dist/28.js";
import { default as baseLt } from "./dist/166.js";
import { default as identity } from "./identity.js";




/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */

function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}


export { min as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvMjguanMBwsCVwq0uL2Rpc3QvMTY2LmpzBcLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKNtaW4QwJGTEMDAhKxiYXNlRXh0cmVtdW2boWmQwgLAkgMEwADAp2RlZmF1bHSQpmJhc2VMdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoaWRlbnRpdHmboWmQwgrAkgsMwALAp2RlZmF1bHSQo21pbpuhbJOsYmFzZUV4dHJlbXVtqGlkZW50aXR5pmJhc2VMdMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYrDMAMwsKWARgGCcLClgkAB8DCwpYLBsDAwsKWAgbAwMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClggIwAjCwpbNAWYQDhDCwpYJA8AEwsKWCQPAwMLClgMOD8DCwg==
====catalogjs annotation end====*/