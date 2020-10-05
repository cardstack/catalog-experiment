import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";






/** Used to match leading and trailing whitespace. */

var reTrimStart = /^\s+/;
/**
 * Removes leading whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trimStart('  abc  ');
 * // => 'abc  '
 *
 * _.trimStart('-_-abc-_-', '_-');
 * // => 'abc-_-'
 */

function trimStart(string, chars, guard) {
  string = toString(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimStart, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      start = charsStartIndex(strSymbols, stringToArray(chars));
  return castSlice(strSymbols, start).join('');
}

const _default = (trimStart);
export { _default as default };
/*====catalogjs annotation start====
lZWTwqwuL2Rpc3QvMjIuanMBk8KtLi9kaXN0LzE0MC5qcwWTwq0uL2Rpc3QvMTIyLmpzCZPCrS4vZGlzdC8xNDMuanMNk8KtLi90b1N0cmluZy5qcxKBp2RlZmF1bHSUoWyoX2RlZmF1bHQiwJGTIsDCiKxiYXNlVG9TdHJpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQqWNhc3RTbGljZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCvY2hhcnNTdGFydEluZGV4m6FpkMIKwJILDMACwKdkZWZhdWx0kK1zdHJpbmdUb0FycmF5m6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCodG9TdHJpbmeboWmQwhPAkhQVwATAp2RlZmF1bHSQq3JlVHJpbVN0YXJ0m6FskMIXGpIYGcDAwMCQqXRyaW1TdGFydJuhbJaodG9TdHJpbmercmVUcmltU3RhcnSsYmFzZVRvU3RyaW5nrXN0cmluZ1RvQXJyYXmvY2hhcnNTdGFydEluZGV4qWNhc3RTbGljZcIbwJIcHcDAwMCQqF9kZWZhdWx0m6Fskal0cmltU3RhcnTCH8CSICHAwMDAkNwAI5YAAAHAwsOWABcCBcLClgkAA8DCwpYLDMDAwsKWJwzAEMLClgEYBgnCwpYJAAfAwsKWCwnAwMLClhMJwMDCwpYBGAoNwsKWCQALwMLClgsPwMDCwpYYD8ARwsKWARgOEsLClgkAD8DCwpYLDcDAwsKWNw3ADMLClg0NwAjCwpYBGBMWwsKWCQAUwMLClgsIwMDCwpYkCMAZwsKWPgEXG8LClgQAGMDCwpYAC8AawsKWVwvABMLClgMGwMDCwpbNAfYfHB7CwpYJCcAVwsKWBAnAwMLClgIBHyLCwpYGASDAwsKWAAjAHcLClgkIwMDCwpYBDiHAwsI=
====catalogjs annotation end====*/