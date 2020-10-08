import { default as baseRandom } from "./dist/171.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";


/**
 * A specialized version of `_.sample` for arrays.
 *
 * @private
 * @param {Array} array The array to sample.
 * @returns {*} Returns the random element.
 */

function arraySample0(array) {
  var length = array.length;
  return length ? array[baseRandom(0, length - 1)] : undefined;
}

const arraySample = (arraySample0);



/**
 * The base implementation of `_.sample`.
 *
 * @private
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 */

function baseSample0(collection) {
  return arraySample(values(collection));
}

const baseSample = (baseSample0);




/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */

function sample(collection) {
  var func = isArray(collection) ? arraySample : baseSample;
  return func(collection);
}

const _default = (sample);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTcxLmpzAZPCqy4vdmFsdWVzLmpzBZPCrC4vaXNBcnJheS5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQjwJGTI8DCiapiYXNlUmFuZG9tm6FpkMICwJIDBMAAwKdkZWZhdWx0kKZ2YWx1ZXOboWmQwgbAkgcIwAHAp2RlZmF1bHSQp2lzQXJyYXmboWmQwgrAkgsMwALAp2RlZmF1bHSQrGFycmF5U2FtcGxlMJuhbJGqYmFzZVJhbmRvbcINwJIOD8DAwMCQq2FycmF5U2FtcGxlm6FskaxhcnJheVNhbXBsZTDCEcCTEhMUktlaaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2FycmF5U2FtcGxlLmpzp2RlZmF1bHTAwMCQq2Jhc2VTYW1wbGUwm6FskqthcnJheVNhbXBsZaZ2YWx1ZXPCFcCSFhfAwMDAkKpiYXNlU2FtcGxlm6FskatiYXNlU2FtcGxlMMIZwJIaG5LZWWh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlU2FtcGxlLmpzp2RlZmF1bHTAwMCQpnNhbXBsZZuhbJOnaXNBcnJheathcnJheVNhbXBsZapiYXNlU2FtcGxlwhzAkh0ewMDAwJCoX2RlZmF1bHSboWyRpnNhbXBsZcIgwJIhIsDAwMCQ3AAklgAAAcDCw5YAGAIFwsKWCQADwMLClgsKwMDCwpY/CsDAwsKWARYGCcLClgkAB8DCwpYLBsDAwsKWAQbAwMLClgEXCg3CwpYJAAvAwsKWCwfAwMLClhwHwBTCwpbMpx8OEMLClgkMwATCwpYEDMDAwsKWAgERFcLClgYBEsDCwpYAC8APwsKWGAvACMLClg8LwBvCwpbMsBAWGMLClgkLwBPCwpYEC8DAwsKWAgEZHMLClgYBGsDCwpYACsAXwsKWAwrAwMLCls0BHh4dH8LClgkGwAzCwpYEBsDAwsKWAgEgI8LClgYBIcDCwpYACMAewsKWCQjAwMLClgEOIsDCwg==
====catalogjs annotation end====*/