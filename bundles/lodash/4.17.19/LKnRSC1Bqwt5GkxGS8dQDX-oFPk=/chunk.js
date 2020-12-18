import { default as baseSlice } from "./dist/142.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";




/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeCeil = Math.ceil,
    nativeMax = Math.max;
/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */

function chunk(array, size, guard) {
  if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }

  var length = array == null ? 0 : array.length;

  if (!length || size < 1) {
    return [];
  }

  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, index += size);
  }

  return result;
}


export { chunk as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTQyLmpzAcLAlcKsLi9kaXN0LzcwLmpzBcLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWylY2h1bmsZwJGTGcDAhqliYXNlU2xpY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQqm5hdGl2ZUNlaWyboWyRpE1hdGjCDhGSDxDAwMDAkKluYXRpdmVNYXiboWyRpE1hdGjCEhWSExTAwMDAkKVjaHVua5uhbJWuaXNJdGVyYXRlZUNhbGypbmF0aXZlTWF4qXRvSW50ZWdlcqpuYXRpdmVDZWlsqWJhc2VTbGljZcIWwJIXGMDAwMCQ3AAalgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpZHCcDAwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWJQ7AFMLClgEZCg3CwpYJAAvAwsKWCwnAwMLClgEJwBDCwpZfAQ4WwsKWBAAPEsLClgAKwBHCwpbMrgrABMLClgMJwMDCwpYGABPAwsKWAAnAFcLCllEJwAzCwpYDCMDAwsKWzQJzNhcZwsKWCQXACMLClgkFwMDCwpYDDhjAwsI=
====catalogjs annotation end====*/