import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIsNaN } from "./dist/125.js";
import { default as toInteger } from "./toInteger.js";

/**
 * A specialized version of `_.lastIndexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictLastIndexOf0(array, value, fromIndex) {
  var index = fromIndex + 1;

  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }

  return index;
}

const strictLastIndexOf = (strictLastIndexOf0);





/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * This method is like `_.indexOf` except that it iterates over elements of
 * `array` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 1, 2], 2);
 * // => 3
 *
 * // Search from the `fromIndex`.
 * _.lastIndexOf([1, 2, 1, 2], 2, 2);
 * // => 1
 */

function lastIndexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = length;

  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }

  return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
}

const _default = (lastIndexOf);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTI0LmpzAZPCrS4vZGlzdC8xMjUuanMFk8KuLi90b0ludGVnZXIuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0JMCRkyTAwomtYmFzZUZpbmRJbmRleJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpYmFzZUlzTmFOm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQsnN0cmljdExhc3RJbmRleE9mMJuhbJDCDcCSDg/AwMDAkLFzdHJpY3RMYXN0SW5kZXhPZpuhbJGyc3RyaWN0TGFzdEluZGV4T2YwwhHAkhITktlgaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX3N0cmljdExhc3RJbmRleE9mLmpzp2RlZmF1bHTAwMCQqW5hdGl2ZU1heJuhbJGkTWF0aMIVGJIWF8DAwMCQqW5hdGl2ZU1pbpuhbJGkTWF0aMIZHJIaG8DAwMCQq2xhc3RJbmRleE9mm6Fslql0b0ludGVnZXKpbmF0aXZlTWF4qW5hdGl2ZU1pbrFzdHJpY3RMYXN0SW5kZXhPZq1iYXNlRmluZEluZGV4qWJhc2VJc05hTsIdwJIeH8DAwMCQqF9kZWZhdWx0m6FskatsYXN0SW5kZXhPZsIhwJIiI8DAwMCQ3AAllgAAAcDCw5YAGAIFwsKWCQADwMLClgsNwMDCwpYYDcAIwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWCAnAwMLClgEZCg3CwpYJAAvAwsKWCwnAwMLClsy3CcAXwsKWzQFkzKAOEMLClgkSwMDCwpYEEsDAwsKWAgERFMLClgYBEsDCwpYAEcAPwsKWNRHABMLClmABFR3CwpYEABYZwsKWAAnAGMLCliUJwBvCwpYDCMDAwsKWBgAawMLClgAJwBzCwpYWCcATwsKWAwjAwMLCls0CNBEeIMLClgkLwAzCwpYEC8DAwsKWAgEhJMLClgYBIsDCwpYACMAfwsKWCQjAwMLClgEOI8DCwg==
====catalogjs annotation end====*/