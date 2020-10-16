import { default as baseIndexOf } from "./dist/123.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as toInteger } from "./toInteger.js";
import { default as values } from "./values.js";






/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max;
/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */

function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
  var length = collection.length;

  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }

  return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}


export { includes as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTIzLmpzAcLAlcKwLi9pc0FycmF5TGlrZS5qcwXCwJXCrS4vaXNTdHJpbmcuanMJwsCVwq4uL3RvSW50ZWdlci5qcw3CwJXCqy4vdmFsdWVzLmpzEcLAgadkZWZhdWx0lKFsqGluY2x1ZGVzHcCRkx3AwIerYmFzZUluZGV4T2aboWmQwgLAkgMEwADAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKhpc1N0cmluZ5uhaZDCCsCSCwzAAsCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIOwJIPEMADwKdkZWZhdWx0kKZ2YWx1ZXOboWmQwhLAkhMUwATAp2RlZmF1bHSQqW5hdGl2ZU1heJuhbJGkTWF0aMIWGZIXGMDAwMCQqGluY2x1ZGVzm6Fslqtpc0FycmF5TGlrZaZ2YWx1ZXOpdG9JbnRlZ2VyqW5hdGl2ZU1heKhpc1N0cmluZ6tiYXNlSW5kZXhPZsIawJIbHMDAwMCQ3AAelgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpZeC8DAwsKWARsGCcLClgkAB8DCwpYLC8DAwsKWNwvAFMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClicIwATCwpYBGQ4RwsKWCQAPwMLClgsJwMDCwpYyCcAYwsKWARYSFcLClgkAE8DCwpYLBsDAwsKWHAbAEMLClmEBFhrCwpYEABfAwsKWAAnAGcLCllsJwAzCwpYDCMDAwsKWzQO0JhsdwsKWCQjACMLClgkIwMDCwpYDDhzAwsI=
====catalogjs annotation end====*/