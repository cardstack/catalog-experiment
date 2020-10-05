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
lZOTwq0uL2Rpc3QvMTI0LmpzAZPCrS4vZGlzdC8xMjUuanMFk8KuLi90b0ludGVnZXIuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0JMCRkyTAwomtYmFzZUZpbmRJbmRleJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpYmFzZUlzTmFOm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQsnN0cmljdExhc3RJbmRleE9mMJuhbJDCDcCSDg/AwMDAkLFzdHJpY3RMYXN0SW5kZXhPZpuhbJGyc3RyaWN0TGFzdEluZGV4T2YwwhHAkhITwMDAwJCpbmF0aXZlTWF4m6FskaRNYXRowhUYkhYXwMDAwJCpbmF0aXZlTWlum6FskaRNYXRowhkckhobwMDAwJCrbGFzdEluZGV4T2aboWyWqXRvSW50ZWdlcqluYXRpdmVNYXipbmF0aXZlTWlusXN0cmljdExhc3RJbmRleE9mrWJhc2VGaW5kSW5kZXipYmFzZUlzTmFOwh3Akh4fwMDAwJCoX2RlZmF1bHSboWyRq2xhc3RJbmRleE9mwiHAkiIjwMDAwJDcACWWAAABwMLDlgAYAgXCwpYJAAPAwsKWCw3AwMLClhgNwAjCwpYBGAYJwsKWCQAHwMLClgsJwMDCwpYICcDAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWzLcJwBfCwpbNAWTMoA4QwsKWCRLAwMLClgQSwMDCwpYCAREUwsKWBgESwMLClgARwA/CwpY1EcAEwsKWYAEVHcLClgQAFhnCwpYACcAYwsKWJQnAG8LClgMIwMDCwpYGABrAwsKWAAnAHMLClhYJwBPCwpYDCMDAwsKWzQI0ER4gwsKWCQvADMLClgQLwMDCwpYCASEkwsKWBgEiwMLClgAIwB/CwpYJCMDAwsKWAQ4jwMLC
====catalogjs annotation end====*/