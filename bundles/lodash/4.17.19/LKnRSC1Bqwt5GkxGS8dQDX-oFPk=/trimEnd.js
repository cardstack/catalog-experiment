import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";






/** Used to match leading and trailing whitespace. */

var reTrimEnd = /\s+$/;
/**
 * Removes trailing whitespace or specified characters from `string`.
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
 * _.trimEnd('  abc  ');
 * // => '  abc'
 *
 * _.trimEnd('-_-abc-_-', '_-');
 * // => '-_-abc'
 */

function trimEnd(string, chars, guard) {
  string = toString(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
  return castSlice(strSymbols, 0, end).join('');
}

const _default = (trimEnd);
export { _default as default };
/*====catalogjs annotation start====
lZWTwqwuL2Rpc3QvMjIuanMBk8KtLi9kaXN0LzE0MC5qcwWTwq0uL2Rpc3QvMTIxLmpzCZPCrS4vZGlzdC8xNDMuanMNk8KtLi90b1N0cmluZy5qcxKBp2RlZmF1bHSUoWyoX2RlZmF1bHQiwJGTIsDCiKxiYXNlVG9TdHJpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQqWNhc3RTbGljZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCtY2hhcnNFbmRJbmRleJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCtc3RyaW5nVG9BcnJheZuhaZDCDsCTDxARwAPAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMITwJIUFcAEwKdkZWZhdWx0kKlyZVRyaW1FbmSboWyQwhcakhgZwMDAwJCndHJpbUVuZJuhbJaodG9TdHJpbmepcmVUcmltRW5krGJhc2VUb1N0cmluZ61zdHJpbmdUb0FycmF5rWNoYXJzRW5kSW5kZXipY2FzdFNsaWNlwhvAkhwdwMDAwJCoX2RlZmF1bHSboWyRp3RyaW1FbmTCH8CSICHAwMDAkNwAI5YAAAHAwsOWABcCBcLClgkAA8DCwpYLDMDAwsKWJwzAEMLClgEYBgnCwpYJAAfAwsKWCwnAwMLClhcJwMDCwpYBGAoNwsKWCQALwMLClgsNwMDCwpYWDcARwsKWARgOEsLClgkAD8DCwpYLDcDAwsKWNw3ADMLClg0NwAjCwpYBGBMWwsKWCQAUwMLClgsIwMDCwpYkCMAZwsKWPgEXG8LClgQAGMDCwpYACcAawsKWVwnABMLClgMGwMDCwpbNAfMgHB7CwpYJB8AVwsKWBAfAwMLClgIBHyLCwpYGASDAwsKWAAjAHcLClgkIwMDCwpYBDiHAwsI=
====catalogjs annotation end====*/