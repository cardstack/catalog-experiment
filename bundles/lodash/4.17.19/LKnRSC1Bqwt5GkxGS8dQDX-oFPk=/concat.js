import { default as arrayPush } from "./dist/139.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";





/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */

function concat() {
  var length = arguments.length;

  if (!length) {
    return [];
  }

  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }

  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}


export { concat as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTM5LmpzAcLAlcKsLi9kaXN0Lzg1LmpzBcLAlcKtLi9kaXN0LzExNy5qcwnCwJXCrC4vaXNBcnJheS5qcw3CwIGnZGVmYXVsdJShbKZjb25jYXQUwJGTFMDAhalhcnJheVB1c2iboWmQwgLAkgMEwADAp2RlZmF1bHSQq2Jhc2VGbGF0dGVum6FpkMIGwJIHCMABwKdkZWZhdWx0kKljb3B5QXJyYXmboWmQwgrAkgsMwALAp2RlZmF1bHSQp2lzQXJyYXmboWmQwg7Akg8QwAPAp2RlZmF1bHSQpmNvbmNhdJuhbJSpYXJyYXlQdXNop2lzQXJyYXmpY29weUFycmF5q2Jhc2VGbGF0dGVuwhHAkhITwMDAwJDcABWWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClszpCcAQwsKWARcGCcLClgkAB8DCwpYLC8DAwsKWEwvAwMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgoJwAjCwpYBFw4RwsKWCQAPwMLClgsHwMDCwpYBB8AMwsKWzQHzDRIUwsKWCQbABMLClgkGwMDCwpYDDhPAwsI=
====catalogjs annotation end====*/