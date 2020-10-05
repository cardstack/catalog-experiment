import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";








/** Used as references for the maximum length and index of an array. */

var MAX_ARRAY_LENGTH = 4294967295;
/**
 * Splits `string` by `separator`.
 *
 * **Note:** This method is based on
 * [`String#split`](https://mdn.io/String/split).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to split.
 * @param {RegExp|string} separator The separator pattern to split by.
 * @param {number} [limit] The length to truncate results to.
 * @returns {Array} Returns the string segments.
 * @example
 *
 * _.split('a-b-c', '-', 2);
 * // => ['a', 'b']
 */

function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }

  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;

  if (!limit) {
    return [];
  }

  string = toString(string);

  if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
    separator = baseToString(separator);

    if (!separator && hasUnicode(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }

  return string.split(separator, limit);
}

const _default = (split);
export { _default as default };
/*====catalogjs annotation start====
lZeTwqwuL2Rpc3QvMjIuanMBk8KtLi9kaXN0LzE0MC5qcwWTwq0uL2Rpc3QvMTQ1LmpzCZPCrC4vZGlzdC83MC5qcw2Twq0uL2lzUmVnRXhwLmpzEZPCrS4vZGlzdC8xNDMuanMVk8KtLi90b1N0cmluZy5qcxmBp2RlZmF1bHSUoWyoX2RlZmF1bHQowJGTKMDCiqxiYXNlVG9TdHJpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQqWNhc3RTbGljZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCqaGFzVW5pY29kZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCuaXNJdGVyYXRlZUNhbGyboWmQwg7Akg8QwAPAp2RlZmF1bHSQqGlzUmVnRXhwm6FpkMISwJITFMAEwKdkZWZhdWx0kK1zdHJpbmdUb0FycmF5m6FpkMIWwJIXGMAFwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCGsCSGxzABsCnZGVmYXVsdJCwTUFYX0FSUkFZX0xFTkdUSJuhbJDCHsCSHyDAwMDAkKVzcGxpdJuhbJiuaXNJdGVyYXRlZUNhbGywTUFYX0FSUkFZX0xFTkdUSKh0b1N0cmluZ6hpc1JlZ0V4cKxiYXNlVG9TdHJpbmeqaGFzVW5pY29kZaljYXN0U2xpY2Wtc3RyaW5nVG9BcnJhecIhwJIiI8DAwMCQqF9kZWZhdWx0m6FskaVzcGxpdMIlwJImJ8DAwMCQ3AAplgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYgDMAMwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWGQnAGMLClgEYCg3CwpYJAAvAwsKWCwrAwMLCliQKwAjCwpYBFw4RwsKWCQAPwMLClgsOwMDCwpZIDsAgwsKWARgSFcLClgkAE8DCwpYLCMDAwsKWUgjABMLClgEYFhnCwpYJABfAwsKWCw3AwMLClgENwMDCwpYBGBodwsKWCQAbwMLClgsIwMDCwpZACMAUwsKWUgEeIcLClgQNH8DCwpYAEMDAwsKWZhDAHMLCls0B8koiJMLClgkFwBDCwpYEBcDAwsKWAgElKMLClgYBJsDCwpYACMAjwsKWCQjAwMLClgEOJ8DCwg==
====catalogjs annotation end====*/