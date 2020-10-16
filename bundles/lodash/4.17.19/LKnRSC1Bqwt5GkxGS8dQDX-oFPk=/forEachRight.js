import { default as baseEachRight } from "./dist/78.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";

/**
 * A specialized version of `_.forEachRight` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEachRight(array, iteratee) {
  var length = array == null ? 0 : array.length;

  while (length--) {
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }

  return array;
}







/**
 * This method is like `_.forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEach
 * @example
 *
 * _.forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */

function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, castFunction(iteratee));
}


export { forEachRight as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvNzguanMBwsCVwq0uL2Rpc3QvMTA4LmpzBcLAlcKsLi9pc0FycmF5LmpzCcLAgadkZWZhdWx0lKFsrGZvckVhY2hSaWdodBPAkZMTwMCFrWJhc2VFYWNoUmlnaHSboWmQwgLAkgMEwADAp2RlZmF1bHSQrGNhc3RGdW5jdGlvbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCnaXNBcnJheZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCuYXJyYXlFYWNoUmlnaHSboWyQwg3Akg4PktldaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2FycmF5RWFjaFJpZ2h0Lmpzp2RlZmF1bHTAwMCQrGZvckVhY2hSaWdodJuhbJSnaXNBcnJhea5hcnJheUVhY2hSaWdodK1iYXNlRWFjaFJpZ2h0rGNhc3RGdW5jdGlvbsIQwJIREsDAwMCQ3AAUlgAAAcDCw5YAFwIFwsKWCQADwMLClgsNwMDCwpYDDcAIwsKWARgGCcLClgkAB8DCwpYLDMDAwsKWHAzAwMLClgEXCg3CwpYJAAvAwsKWCwfAwMLCliYHwA/CwpbNARnMwA4QwsKWCQ7AwMLClg8OwATCwpbNAicOERPCwpYJDMAMwsKWCQzAwMLClgMOEsDCwg==
====catalogjs annotation end====*/