import { default as copyArray } from "./dist/117.js";
import { default as shuffleSelf } from "./dist/170.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";



/**
 * A specialized version of `_.shuffle` for arrays.
 *
 * @private
 * @param {Array} array The array to shuffle.
 * @returns {Array} Returns the new shuffled array.
 */

function arrayShuffle(array) {
  return shuffleSelf(copyArray(array));
}





/**
 * The base implementation of `_.shuffle`.
 *
 * @private
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 */

function baseShuffle(collection) {
  return shuffleSelf(values(collection));
}






/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * _.shuffle([1, 2, 3, 4]);
 * // => [4, 1, 3, 2]
 */

function shuffle(collection) {
  var func = isArray(collection) ? arrayShuffle : baseShuffle;
  return func(collection);
}


export { shuffle as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTE3LmpzAcLAlcKtLi9kaXN0LzE3MC5qcwXCwJXCqy4vdmFsdWVzLmpzCsLAlcKsLi9pc0FycmF5LmpzDsLAgadkZWZhdWx0lKFsp3NodWZmbGUbwJGTG8DAh6ljb3B5QXJyYXmboWmQwgLAkgMEwADAp2RlZmF1bHSQq3NodWZmbGVTZWxmm6FpkMIGwJMHCAnAAcCnZGVmYXVsdJCmdmFsdWVzm6FpkMILwJIMDcACwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIPwJIQEcADwKdkZWZhdWx0kKxhcnJheVNodWZmbGWboWySq3NodWZmbGVTZWxmqWNvcHlBcnJhecISwJITFJLZW2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19hcnJheVNodWZmbGUuanOnZGVmYXVsdMDAwJCrYmFzZVNodWZmbGWboWySq3NodWZmbGVTZWxmpnZhbHVlc8IVwJIWF5LZWmh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlU2h1ZmZsZS5qc6dkZWZhdWx0wMDAkKdzaHVmZmxlm6Fsk6dpc0FycmF5rGFycmF5U2h1ZmZsZatiYXNlU2h1ZmZsZcIYwJIZGsDAwMCQ3AAclgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYBCcDAwsKWARgGCsLClgkAB8DCwpYLC8DAwsKWEwvABMLClhgLwA3CwpYBFgsOwsKWCQAMwMLClgsGwMDCwpYBBsDAwsKWARcPEsLClgkAEMDCwpYLB8DAwsKWHAfAFMLClsyyCxMVwsKWCQzACMLClg8MwBfCwpbMvBAWGMLClgkLwAnCwpYDC8DAwsKWzQGXHhkbwsKWCQfAEcLClgkHwMDCwpYDDhrAwsI=
====catalogjs annotation end====*/