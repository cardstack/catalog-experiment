import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";







/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */

function trim(string, chars, guard) {
  string = toString(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;
  return castSlice(strSymbols, start, end).join('');
}

const _default = (trim);
export { _default as default };
/*====catalogjs annotation start====
lZaTwqwuL2Rpc3QvMjIuanMBk8KtLi9kaXN0LzE0MC5qcwWTwq0uL2Rpc3QvMTIxLmpzCZPCrS4vZGlzdC8xMjIuanMNk8KtLi9kaXN0LzE0My5qcxGTwq0uL3RvU3RyaW5nLmpzFoGnZGVmYXVsdJShbKhfZGVmYXVsdCbAkZMmwMKJrGJhc2VUb1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCpY2FzdFNsaWNlm6FpkMIGwJIHCMABwKdkZWZhdWx0kK1jaGFyc0VuZEluZGV4m6FpkMIKwJILDMACwKdkZWZhdWx0kK9jaGFyc1N0YXJ0SW5kZXiboWmQwg7Akg8QwAPAp2RlZmF1bHSQrXN0cmluZ1RvQXJyYXmboWmQwhLAkxMUFcAEwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCF8CSGBnABcCnZGVmYXVsdJCmcmVUcmltm6FskMIbHpIcHcDAwMCQpHRyaW2boWyXqHRvU3RyaW5npnJlVHJpbaxiYXNlVG9TdHJpbmetc3RyaW5nVG9BcnJhea9jaGFyc1N0YXJ0SW5kZXitY2hhcnNFbmRJbmRleKljYXN0U2xpY2XCH8CSICHAwMDAkKhfZGVmYXVsdJuhbJGkdHJpbcIjwJIkJcDAwMCQ3AAnlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYnDMAUwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWJwnAwMLClgEYCg3CwpYJAAvAwsKWCw3AwMLCliYNwAjCwpYBGA4RwsKWCQAPwMLClgsPwMDCwpYXD8AMwsKWARgSFsLClgkAE8DCwpYLDcDAwsKWNw3AFcLClh0NwBDCwpYBGBcawsKWCQAYwMLClgsIwMDCwpYkCMAdwsKWPwEbH8LClgQAHMDCwpYABsAewsKWVwbABMLClgMMwMDCwpbNAjkkICLCwpYJBMAZwsKWBATAwMLClgIBIybCwpYGASTAwsKWAAjAIcLClgkIwMDCwpYBDiXAwsI=
====catalogjs annotation end====*/