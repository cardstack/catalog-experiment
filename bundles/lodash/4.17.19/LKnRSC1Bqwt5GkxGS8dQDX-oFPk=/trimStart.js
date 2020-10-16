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


export { trimStart as default };
/*====catalogjs annotation start====
lZWVwqwuL2Rpc3QvMjIuanMBwsCVwq0uL2Rpc3QvMTQwLmpzBcLAlcKtLi9kaXN0LzEyMi5qcwnCwJXCrS4vZGlzdC8xNDMuanMNwsCVwq0uL3RvU3RyaW5nLmpzEsLAgadkZWZhdWx0lKFsqXRyaW1TdGFydB7AkZMewMCHrGJhc2VUb1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCpY2FzdFNsaWNlm6FpkMIGwJIHCMABwKdkZWZhdWx0kK9jaGFyc1N0YXJ0SW5kZXiboWmQwgrAkgsMwALAp2RlZmF1bHSQrXN0cmluZ1RvQXJyYXmboWmQwg7Akw8QEcADwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCE8CSFBXABMCnZGVmYXVsdJCrcmVUcmltU3RhcnSboWyQwhcakhgZwMDAwJCpdHJpbVN0YXJ0m6Fslqh0b1N0cmluZ6tyZVRyaW1TdGFydKxiYXNlVG9TdHJpbmetc3RyaW5nVG9BcnJhea9jaGFyc1N0YXJ0SW5kZXipY2FzdFNsaWNlwhvAkhwdwMDAwJDcAB+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwzAwMLClicMwBDCwpYBGAYJwsKWCQAHwMLClgsJwMDCwpYTCcDAwsKWARgKDcLClgkAC8DCwpYLD8DAwsKWGA/AEcLClgEYDhLCwpYJAA/AwsKWCw3AwMLCljcNwAzCwpYNDcAIwsKWARgTFsLClgkAFMDCwpYLCMDAwsKWJAjAGcLClj4BFxvCwpYEABjAwsKWAAvAGsLCllcLwATCwpYDBsDAwsKWzQH2HxwewsKWCQnAFcLClgkJwMDCwpYDDh3AwsI=
====catalogjs annotation end====*/