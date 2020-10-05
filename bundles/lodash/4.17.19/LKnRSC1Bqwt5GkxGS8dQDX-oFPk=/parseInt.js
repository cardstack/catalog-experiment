import { default as root } from "./dist/93.js";
import { default as toString } from "./toString.js";



/** Used to match leading and trailing whitespace. */

var reTrimStart = /^\s+/;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeParseInt = root.parseInt;
/**
 * Converts `string` to an integer of the specified radix. If `radix` is
 * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
 * hexadecimal, in which case a `radix` of `16` is used.
 *
 * **Note:** This method aligns with the
 * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category String
 * @param {string} string The string to convert.
 * @param {number} [radix=10] The radix to interpret `value` by.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 *
 * _.map(['6', '08', '10'], _.parseInt);
 * // => [6, 8, 10]
 */

function parseInt(string, radix, guard) {
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }

  return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
}

const _default = (parseInt);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvOTMuanMBk8KtLi90b1N0cmluZy5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQawJGTGsDChqRyb290m6FpkMICwJIDBMAAwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCrcmVUcmltU3RhcnSboWyQwgoNkgsMwMDAwJCubmF0aXZlUGFyc2VJbnSboWyRpHJvb3TCDxKSEBHAwMDAkaRyb290qHBhcnNlSW50m6Fsk65uYXRpdmVQYXJzZUludKh0b1N0cmluZ6tyZVRyaW1TdGFydMITwJIUFcDAwMCQqF9kZWZhdWx0m6FskahwYXJzZUludMIXwJIYGcDAwMCQ3AAblgAAAcDCw5YAFwIFwsKWCQADwMLClgsEwMDCwpYABMDAwsKWARgGCcLClgkAB8DCwpYLCMDAwsKWAQjADMLCljsBCg7CwpYEAAvAwsKWAAvADcLClhELwMDCwpYDBsDAwsKWWwEPE8LClgQAEMDCwpYADsASwsKWzIAOwAjCwpYDCQTAwsKWzQLtFRQWwsKWCQjAEcLClgQIwMDCwpYCARcawsKWBgEYwMLClgAIwBXCwpYJCMDAwsKWAQ4ZwMLC
====catalogjs annotation end====*/