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


export { trim as default };
/*====catalogjs annotation start====
lZaVwqwuL2Rpc3QvMjIuanMBwsCVwq0uL2Rpc3QvMTQwLmpzBcLAlcKtLi9kaXN0LzEyMS5qcwnCwJXCrS4vZGlzdC8xMjIuanMNwsCVwq0uL2Rpc3QvMTQzLmpzEcLAlcKtLi90b1N0cmluZy5qcxbCwIGnZGVmYXVsdJShbKR0cmltIsCRkyLAwIisYmFzZVRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kKljYXN0U2xpY2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQrWNoYXJzRW5kSW5kZXiboWmQwgrAkgsMwALAp2RlZmF1bHSQr2NoYXJzU3RhcnRJbmRleJuhaZDCDsCSDxDAA8CnZGVmYXVsdJCtc3RyaW5nVG9BcnJheZuhaZDCEsCTExQVwATAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIXwJIYGcAFwKdkZWZhdWx0kKZyZVRyaW2boWyQwhsekhwdwMDAwJCkdHJpbZuhbJeodG9TdHJpbmemcmVUcmltrGJhc2VUb1N0cmluZ61zdHJpbmdUb0FycmF5r2NoYXJzU3RhcnRJbmRleK1jaGFyc0VuZEluZGV4qWNhc3RTbGljZcIfwJIgIcDAwMCQ3AAjlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYnDMAUwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWJwnAwMLClgEYCg3CwpYJAAvAwsKWCw3AwMLCliYNwAjCwpYBGA4RwsKWCQAPwMLClgsPwMDCwpYXD8AMwsKWARgSFsLClgkAE8DCwpYLDcDAwsKWNw3AFcLClh0NwBDCwpYBGBcawsKWCQAYwMLClgsIwMDCwpYkCMAdwsKWPwEbH8LClgQAHMDCwpYABsAewsKWVwbABMLClgMMwMDCwpbNAjkkICLCwpYJBMAZwsKWCQTAwMLClgMOIcDCwg==
====catalogjs annotation end====*/