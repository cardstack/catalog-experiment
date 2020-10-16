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
function strictLastIndexOf(array, value, fromIndex) {
  var index = fromIndex + 1;

  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }

  return index;
}







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


export { lastIndexOf as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTI0LmpzAcLAlcKtLi9kaXN0LzEyNS5qcwXCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0lKFsq2xhc3RJbmRleE9mHMCRkxzAwIetYmFzZUZpbmRJbmRleJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpYmFzZUlzTmFOm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQsXN0cmljdExhc3RJbmRleE9mm6FskMINwJIOD5LZYGh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19zdHJpY3RMYXN0SW5kZXhPZi5qc6dkZWZhdWx0wMDAkKluYXRpdmVNYXiboWyRpE1hdGjCERSSEhPAwMDAkKluYXRpdmVNaW6boWyRpE1hdGjCFRiSFhfAwMDAkKtsYXN0SW5kZXhPZpuhbJapdG9JbnRlZ2VyqW5hdGl2ZU1heKluYXRpdmVNaW6xc3RyaWN0TGFzdEluZGV4T2atYmFzZUZpbmRJbmRleKliYXNlSXNOYU7CGcCSGhvAwMDAkNwAHZYAAAHAwsOWABgCBcLClgkAA8DCwpYLDcDAwsKWGA3ACMLClgEYBgnCwpYJAAfAwsKWCwnAwMLClggJwMDCwpYBGQoNwsKWCQALwMLClgsJwMDCwpbMtwnAE8LCls0BZMygDhDCwpYJEcDAwsKWNRHABMLClmIBERnCwpYEABIVwsKWAAnAFMLCliUJwBfCwpYDCMDAwsKWBgAWwMLClgAJwBjCwpYWCcAPwsKWAwjAwMLCls0CNBEaHMLClgkLwAzCwpYJC8DAwsKWAw4bwMLC
====catalogjs annotation end====*/