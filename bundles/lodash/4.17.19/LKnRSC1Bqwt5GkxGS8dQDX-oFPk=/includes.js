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

const _default = (includes);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTIzLmpzAZPCsC4vaXNBcnJheUxpa2UuanMFk8KtLi9pc1N0cmluZy5qcwmTwq4uL3RvSW50ZWdlci5qcw2TwqsuL3ZhbHVlcy5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQhwJGTIcDCiKtiYXNlSW5kZXhPZpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCraXNBcnJheUxpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqGlzU3RyaW5nm6FpkMIKwJILDMACwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwg7Akg8QwAPAp2RlZmF1bHSQpnZhbHVlc5uhaZDCEsCSExTABMCnZGVmYXVsdJCpbmF0aXZlTWF4m6FskaRNYXRowhYZkhcYwMDAwJCoaW5jbHVkZXOboWyWq2lzQXJyYXlMaWtlpnZhbHVlc6l0b0ludGVnZXKpbmF0aXZlTWF4qGlzU3RyaW5nq2Jhc2VJbmRleE9mwhrAkhscwMDAwJCoX2RlZmF1bHSboWyRqGluY2x1ZGVzwh7Akh8gwMDAwJDcACKWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLCll4LwMDCwpYBGwYJwsKWCQAHwMLClgsLwMDCwpY3C8AUwsKWARgKDcLClgkAC8DCwpYLCMDAwsKWJwjABMLClgEZDhHCwpYJAA/AwsKWCwnAwMLCljIJwBjCwpYBFhIVwsKWCQATwMLClgsGwMDCwpYcBsAQwsKWYQEWGsLClgQAF8DCwpYACcAZwsKWWwnADMLClgMIwMDCwpbNA7QmGx3CwpYJCMAIwsKWBAjAwMLClgIBHiHCwpYGAR/AwsKWAAjAHMLClgkIwMDCwpYBDiDAwsI=
====catalogjs annotation end====*/